import { Injectable } from '@nestjs/common';
import { QueryBuilderService } from '../../common/query-builder/query-builder.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly queryBuilder: QueryBuilderService,
  ) {}

  async getUserNotifications(userId: String, cursor?: String, limit: number = 10) {
    const notifications = await this.queryBuilder
      .using('notification', {
        filter: { user_id: userId },
        cursor: cursor ? String(cursor) : undefined,
        limit: limit + 1, // Fetch one extra to check for next page
        sort: '-created_at',
      })
      .allowedFilters(['user_id'])
      .allowedSorts(['created_at'])
      .execute();

    let nextCursor = null;
    if (notifications.length > limit) {
      const nextItem = notifications.pop();
      nextCursor = nextItem.id;
    }

    return {
      data: notifications,
      meta: {
        next_cursor: nextCursor,
        has_more: nextCursor !== null,
      },
    };
  }

  async countUnreadNotifications(userId: String) {
    const count = await this.queryBuilder
      .using('notification', {
        filter: { 
          user_id: userId,
          is_read: false 
        }
      })
      .allowedFilters(['user_id', 'is_read'])
      .count();

    return { count };
  }

  async markAsRead(userId: String, notificationId: String) {
    // We use using() just to set the model name, though update() primarily uses id
    // However, for security we might want to verify ownership if update() supported complex where
    // But our simple update(id, data) only takes ID.
    // If strict ownership check is needed, we should probably fetch first or use updateMany with user_id.
    // Given the simple implementation of update(id, data), it directly updates by ID.
    // To ensure user owns the notification, let's use updateMany with id AND user_id
    
    return this.queryBuilder
      .using('notification', {
        filter: {
          id: notificationId,
          user_id: userId
        }
      })
      .allowedFilters(['id', 'user_id'])
      .updateMany({ is_read: true });
  }

  async markAllAsRead(userId: String) {
    return this.queryBuilder
      .using('notification', {
        filter: {
          user_id: userId,
          is_read: false
        }
      })
      .allowedFilters(['user_id', 'is_read'])
      .updateMany({
        is_read: true,
      });
  }
}
