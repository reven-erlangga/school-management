import { writable } from 'svelte/store';
import type { User } from '../../types';

// Simple user store
export const user = writable<User | null>(null);

/**
 * Save tokens and user data to localStorage
 */
export const saveAuthData = (userData: User, accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_user', JSON.stringify(userData));
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
};

/**
 * Clear auth data from localStorage
 */
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export * from './login.store';
export * from './logout.store';
export * from './refresh-token.store';
