import { authService } from '../../services/auth.service';
import { user, clearAuthData } from './index';

/**
 * Logout function
 */
export const logout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout warning:', error);
  } finally {
    user.set(null);
    clearAuthData();
  }
};
