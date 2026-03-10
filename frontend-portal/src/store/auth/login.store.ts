import { writable, get } from 'svelte/store';
import type { Form, LoginRequest } from '../../types/auth.type';
import { loginSchema } from '../../types/auth.type';
import { authService } from '../../services/auth.service';
import { user, saveAuthData } from './index';
import { snackbar } from '../../modules/snackbar/stores/control.store';
import * as yup from 'yup';

// Login form state
export const form = writable<Form<LoginRequest>>({
    values: { username: '', password: '' },
    errors: {},
    meta: {
        loading: false,
        touched: {},
        isValid: false,
        error: ''
    }
});

/**
 * Validate form field
 */
export const validateField = async (field: keyof LoginRequest, value: string) => {
    try {
        await loginSchema.validateAt(field, { [field]: value });
        form.update(state => ({
            ...state,
            errors: { ...state.errors, [field]: undefined },
            meta: {
                ...state.meta,
                isValid: Object.keys(state.errors).length === 0 && Object.keys(state.errors).filter(k => k !== field).every(k => !state.errors[k as keyof LoginRequest]),
                error: ''
            }
        }));
    } catch (err: any) {
        form.update(state => ({
            ...state,
            errors: { ...state.errors, [field]: err.message },
            meta: {
                ...state.meta,
                isValid: false
            }
        }));
    }
};

/**
 * Handle input change
 */
export const handleInput = (field: string, value: string) => {
    const key = field as keyof LoginRequest;
    form.update(state => ({
        ...state,
        values: { ...state.values, [key]: value }
    }));
    validateField(key, value);
};

/**
 * Login function
 */
export const login = async (e?: Event) => {
  if (e) e.preventDefault();
  
  const state = get(form);
  
  try {
    // Validate all fields before submitting
    await loginSchema.validate(state.values, { abortEarly: false });
    
    form.update(s => ({ 
        ...s, 
        errors: {},
        meta: { ...s.meta, loading: true, error: '' }
    }));
    
    // Call the service which calls the API
    const authData = await authService.login(state.values);
    
    // Store update
    user.set(authData.user);
    saveAuthData(authData.user, authData.accessToken, authData.refreshToken);
    
    form.update(s => ({ 
        ...s, 
        meta: { ...s.meta, loading: false }
    }));
    
    // Redirect on success
    if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
    }
    
    return { success: true, user: authData.user };
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        error.inner.forEach(err => {
            if (err.path) errors[err.path] = err.message;
        });
        form.update(s => ({ 
            ...s, 
            errors, 
            meta: { ...s.meta, loading: false, error: 'Validation failed' }
        }));
        snackbar.show('Mohon periksa kembali input Anda.', 'error');
        return { success: false, message: 'Validation failed' };
    }
    
    console.error('Login error:', error);
    const errorMessage = error.message || 'Connection error';
    
    form.update(s => ({ 
        ...s, 
        meta: { ...s.meta, loading: false, error: errorMessage }
    }));
    snackbar.show(errorMessage, 'error', 'bottom-right');
    return { success: false, message: errorMessage };
  }
};
