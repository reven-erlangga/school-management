import { Module } from '@nestjs/common';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  controllers: [NotificationController, ProfileController],
  providers: [NotificationService, ProfileService],
  exports: [NotificationService],
})
export class ProfileModule {}
