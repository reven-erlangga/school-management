import { logout } from './logout.store';
import { saveAuthData } from './index';
import { authService } from '../../services/auth.service';

/**
 * Refresh the access token using the refresh token via authService
 */
export const refreshAccessToken = async () => {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
  console.log('[AuthStore] Refreshing access token...', { hasRefreshToken: !!refreshToken });
  
  if (!refreshToken) return null;

  try {
    const authData = await authService.refreshToken(refreshToken);

    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      saveAuthData(userData, authData.accessToken, authData.refreshToken);
      console.log('[AuthStore] Access token refreshed successfully');
      return authData.accessToken;
    } else {
        // Should generally not happen if refresh token exists, but good to handle
        console.warn('[AuthStore] No saved user found during refresh, logging out');
        logout();
    }
  } catch (error) {
    console.error('[AuthStore] Refresh token error:', error);
    logout();
  }
  return null;
};
