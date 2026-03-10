import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StreamService } from './stream.service';
import { CreateStreamDto, UpdateStreamDto } from './dto/create-stream.dto';

@Controller('streams')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post()
  create(@Body() createStreamDto: CreateStreamDto) {
    return this.streamService.create(createStreamDto);
  }

  @Get()
  findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      name?: string;
      institute_id?: string;
    },
  ) {
    return this.streamService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.streamService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStreamDto: UpdateStreamDto) {
    return this.streamService.update(id, updateStreamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.streamService.remove(id);
  }
}
