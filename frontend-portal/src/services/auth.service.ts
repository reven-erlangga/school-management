import { loginApi } from '../api/auth/login.api';
import { refreshTokenApi } from '../api/auth/refresh-token.api';
import { logoutApi } from '../api/auth/logout.api';
import type { LoginRequest, Auth } from '../types/auth.type';

export const authService = {
  login: async (credentials: LoginRequest): Promise<Auth> => {
    try {
      const response = await loginApi(credentials);
      
      if (response.data) {
        // Map snake_case from API to camelCase for Auth interface
        const data = response.data as any;
        const accessToken = data.access_token || data.accessToken;
        const refreshToken = data.refresh_token || data.refreshToken;
        
        // Ensure user object exists
        let user = data.user;
        if (!user) {
            // Fallback if API doesn't return user object
            console.warn('Login API response missing user object, using fallback');
            user = {
                id: 'temp-id',
                username: credentials.username,
                role: 'admin', // Default role
                permissions: [],
                roles: []
            };
        }

        return {
            user,
            accessToken,
            refreshToken
        };
      }
      
      if (response.errors && response.errors.length > 0) {
        throw new Error(response.errors[0].detail || response.errors[0].title || 'Login failed');
      }

      throw new Error('Login failed');
    } catch (error) {
      console.error('Auth Service Login Error:', error);
      throw error;
    }
  },

  refreshToken: async (refreshToken: string): Promise<Auth> => {
    try {
      const response = await refreshTokenApi({ refreshToken });

      if (response.data) {
        const data = response.data as any;
        const accessToken = data.access_token || data.accessToken;
        const newRefreshToken = data.refresh_token || data.refreshToken;
        
        // Return dummy user or existing user if returned, to satisfy Auth interface
        // In reality, refresh token endpoint might not return user data
        const user = data.user || { id: 'refresh-placeholder', username: 'refresh', role: 'admin' };

        return {
            user,
            accessToken,
            refreshToken: newRefreshToken
        };
      }

      if (response.errors && response.errors.length > 0) {
        throw new Error(response.errors[0].detail || response.errors[0].title || 'Refresh token failed');
      }

      throw new Error('Refresh token failed');
    } catch (error) {
      console.error('Auth Service Refresh Token Error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Auth Service Logout Error:', error);
      // We generally want to proceed with client-side logout even if server fails
      throw error;
    }
  }
};
