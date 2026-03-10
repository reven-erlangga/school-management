import {
  Controller,
  Get,
  Query,
  Put,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('profile/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(
    @Req() req,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    return this.notificationService.getUserNotifications(
      req.user.id,
      cursor,
      limit ? Number(limit) : 10,
    );
  }

  @Get('count')
  async getUnreadCount(@Req() req) {
    return this.notificationService.countUnreadNotifications(req.user.id);
  }

  @Put('read-all')
  async markAllAsRead(@Req() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Put(':id/read')
  async markAsRead(@Req() req, @Param('id') id: string) {
    return this.notificationService.markAsRead(req.user.id, id);
  }
}
