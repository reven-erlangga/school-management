import { Controller, Post, Param, Sse, MessageEvent } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { Observable, interval, from } from 'rxjs';
import {
  map,
  switchMap,
  distinctUntilChanged,
  takeWhile,
} from 'rxjs/operators';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { toResponse } from '../query-builder/interfaces/response.interface';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('run')
  @ApiOperation({ summary: 'Trigger a seeder job' })
  async run() {
    const result = await this.seederService.run();
    return toResponse(result, { message: 'Job triggered successfully' });
  }

  @Sse('stream/:key')
  @ApiOperation({ summary: 'Stream job progress via SSE' })
  stream(@Param('key') key: string): Observable<MessageEvent> {
    const isRecord = (value: unknown): value is Record<string, unknown> =>
      typeof value === 'object' && value !== null;

    return interval(200).pipe(
      // Poll every 200ms
      switchMap(() => from(this.seederService.checkStatus(key))),
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
      ),
      map((status) => {
        if (!status) {
          return {
            data: JSON.stringify(
              toResponse(null, undefined, undefined, undefined, [
                {
                  status: '404',
                  title: 'Job Not Found',
                  detail: `Job with key ${key} not found`,
                },
              ]),
            ),
          } as MessageEvent;
        }

        return {
          data: JSON.stringify(toResponse(status)),
        } as MessageEvent;
      }),
      // Stop stream when completed or failed
      takeWhile((event: MessageEvent) => {
        if (typeof event.data !== 'string') return false;
        const responseData = JSON.parse(event.data) as unknown;
        if (!isRecord(responseData)) return false;

        // If it's an error response
        if (Array.isArray(responseData['errors'])) {
          return false;
        }

        const data = responseData['data'];
        if (!isRecord(data)) return false;
        const state = data['state'];
        return state !== 'completed' && state !== 'failed';
      }, true), // inclusive: true ensures the final 'completed' event is sent
    );
  }
}
