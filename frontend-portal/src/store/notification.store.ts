import { writable, get } from 'svelte/store';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  data?: any;
}

interface NotificationState {
  data: Notification[];
  unreadCount: number;
  loading: boolean;
  hasMore: boolean;
  nextCursor: string | null;
}

function createNotificationStore() {
  const { subscribe, update, set } = writable<NotificationState>({
    data: [],
    unreadCount: 0,
    loading: false,
    hasMore: true,
    nextCursor: null,
  });

  const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  return {
    subscribe,
    
    fetchNotifications: async (reset = false) => {
      const state = get({ subscribe });
      if (state.loading || (!state.hasMore && !reset)) return;

      update(s => ({ ...s, loading: true }));

      try {
        const cursorParam = reset ? '' : (state.nextCursor ? `&cursor=${state.nextCursor}` : '');
        const res = await fetch(`${apiUrl}/profile/notifications?limit=10${cursorParam}`, {
          headers: getHeaders()
        });

        if (res.ok) {
          const result = await res.json();
          update(s => ({
            ...s,
            data: reset ? result.data : [...s.data, ...result.data],
            nextCursor: result.meta.next_cursor,
            hasMore: result.meta.has_more,
            loading: false
          }));
        } else {
            update(s => ({ ...s, loading: false }));
        }
      } catch (e) {
        console.error('Failed to fetch notifications', e);
        update(s => ({ ...s, loading: false }));
      }
    },

    fetchUnreadCount: async () => {
      try {
        const res = await fetch(`${apiUrl}/profile/notifications/count`, {
          headers: getHeaders()
        });
        if (res.ok) {
          const { count } = await res.json();
          update(s => ({ ...s, unreadCount: count }));
        }
      } catch (e) {
        console.error('Failed to fetch unread count', e);
      }
    },

    markAsRead: async (id: string) => {
      try {
        // Optimistic update
        update(s => ({
          ...s,
          data: s.data.map(n => n.id === id ? { ...n, is_read: true } : n),
          unreadCount: Math.max(0, s.unreadCount - 1)
        }));

        await fetch(`${apiUrl}/profile/notifications/${id}/read`, {
          method: 'PUT',
          headers: getHeaders()
        });
      } catch (e) {
        console.error('Failed to mark notification as read', e);
      }
    },

    markAllAsRead: async () => {
      try {
         // Optimistic update
         update(s => ({
            ...s,
            data: s.data.map(n => ({ ...n, is_read: true })),
            unreadCount: 0
         }));

        await fetch(`${apiUrl}/profile/notifications/read-all`, {
          method: 'PUT',
          headers: getHeaders()
        });
      } catch (e) {
        console.error('Failed to mark all as read', e);
      }
    },

    reset: () => {
        set({
            data: [],
            unreadCount: 0,
            loading: false,
            hasMore: true,
            nextCursor: null,
        })
    }
  };
}

export const notifications = createNotificationStore();
