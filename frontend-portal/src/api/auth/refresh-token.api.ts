import { api } from '../../utils/api.util';
import type { RefreshTokenRequest, Auth } from '../../types/auth.type';
import type { Response } from '../../interfaces/api.interface';

export const refreshTokenApi = (data: RefreshTokenRequest) => {
  return api.post<Response<Auth>>('/auth/refresh', data);
};
