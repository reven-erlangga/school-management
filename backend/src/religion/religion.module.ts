import { Module } from '@nestjs/common';
import { ReligionService } from './religion.service';
import { ReligionController } from './religion.controller';

@Module({
  controllers: [ReligionController],
  providers: [ReligionService],
})
export class ReligionModule {}
