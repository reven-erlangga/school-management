import type { User } from './index';
import * as yup from 'yup';

export interface Auth {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export const loginSchema = yup.object({
  username: yup.string().required('Username atau Email wajib diisi'),
  password: yup.string().required('Password wajib diisi'),
});

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type Form<T> = {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    meta: {
        loading: boolean;
        touched: Partial<Record<keyof T, boolean>>;
        isValid: boolean;
        error?: string;
    }
};
