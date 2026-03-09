import { api } from '../../utils/api.util';
import type { Response } from '../../interfaces/api.interface';

export const logoutApi = () => {
  return api.post<Response<any>>('/auth/logout', {});
};
