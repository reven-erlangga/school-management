import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { SeederProcessor } from './seeder.processor';
import { queueConfig, SEEDER_QUEUE } from './queue/queue.config';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: SEEDER_QUEUE,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => queueConfig(configService),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SeederController],
  providers: [SeederService, SeederProcessor],
  exports: [SeederService],
})
export class SeederModule {}
