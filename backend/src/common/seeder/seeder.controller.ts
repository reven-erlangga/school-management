import { Controller, Post, Get, Body, Param, Sse, MessageEvent } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { Observable, interval, from } from 'rxjs';
import { map, switchMap, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { toResponse } from '../query-builder/interfaces/response.interface';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('run')
  @ApiOperation({ summary: 'Trigger a seeder job' })
  async runSeeder(@Body('type') type: string) {
    const result = await this.seederService.runSeeder(type);
    return toResponse(result, { message: 'Job triggered successfully' });
  }

  @Sse('stream/:jobId')
  @ApiOperation({ summary: 'Stream job progress via SSE' })
  streamJob(@Param('jobId') jobId: string): Observable<MessageEvent> {
    return interval(1000).pipe( // Poll every 1 second
      switchMap(() => from(this.seederService.getJobStatus(jobId))),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      map((status) => {
        if (!status) {
          // Send a standardized error/not found structure wrapped in SSE
          return {
            data: toResponse(null, undefined, undefined, undefined, [{
              status: '404',
              title: 'Job Not Found',
              detail: `Job with ID ${jobId} not found`
            }]),
          } as MessageEvent;
        }

        // Return the current status using toResponse but flattened for SSE
        const response = toResponse({
          job_id: status.id,
          progress: status.progress,
          state: status.state,
          result: status.result,
          failed_reason: status.failedReason,
        });

        return {
          data: {
            ...response.data, // Flatten the data object
            meta: response.meta,
            jsonapi: response.jsonapi,
          },
        } as MessageEvent;
      }),
      // Stop stream when completed or failed
      takeWhile((event: any) => {
        // We need to parse data back because toResponse returns an object, 
        // but SSE data usually is serialized. However, NestJS @Sse handles object serialization.
        // Let's inspect the structure we returned: { data: { ... } }
        // The event.data is the Response<T> object.
        const responseData = event.data;
        
        // If it's an error response
        if (responseData.errors) {
            return false;
        }

        const state = responseData.data?.state;
        return state !== 'completed' && state !== 'failed';
      }, true) // inclusive: true ensures the final 'completed' event is sent
    );
  }
}
