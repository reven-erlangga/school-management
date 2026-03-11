import { Module } from '@nestjs/common';
import { SeederKeyService } from './seeder/seeder-key.service';

@Module({
  providers: [SeederKeyService],
  exports: [SeederKeyService],
})
export class UtilsModule {}
