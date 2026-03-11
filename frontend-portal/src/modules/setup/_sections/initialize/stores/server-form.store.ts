import { writable, get } from 'svelte/store';
import * as yup from 'yup';
import { configurationService } from '../services/configuration.service';
import { stage } from './stage.store';
import { snackbar } from '@modules/snackbar/stores/control.store';

export interface ServerFormData {
    host: string;
    port: string;
    username: string;
    password?: string;
    fromEmail: string;
}

export interface ServerFormState {
    values: ServerFormData;
    errors: Partial<Record<keyof ServerFormData, string>>;
    meta: {
        loading: boolean;
        isValid: boolean;
        error: string | null;
        original?: {
            host: string;
            port: string;
            username: string;
            password?: string;
            fromEmail: string;
        };
    };
}

const initialState: ServerFormState = {
    values: {
        host: '',
        port: '',
        username: '',
        password: '',
        fromEmail: ''
    },
    errors: {},
    meta: {
        loading: false,
        isValid: false,
        error: null
    }
};

const validationSchema = yup.object({
    host: yup.string().required('SMTP Host is required'),
    port: yup.string().required('SMTP Port is required'), // Could be number, but text field usually returns string
    username: yup.string().required('SMTP Username is required'),
    password: yup.string().optional(),
    fromEmail: yup.string().email('Must be a valid email').required('From Email is required')
});

const createServerFormStore = () => {
    const { subscribe, set, update } = writable<ServerFormState>(initialState);

    const validateField = async (field: keyof ServerFormData, value: any) => {
        try {
            await validationSchema.validateAt(field, { [field]: value });
            update(s => ({
                ...s,
                errors: { ...s.errors, [field]: undefined }
            }));
        } catch (err: any) {
            update(s => ({
                ...s,
                errors: { ...s.errors, [field]: err.message }
            }));
        }
    };

    const handleInput = (field: keyof ServerFormData, value: any) => {
        update(s => ({
            ...s,
            values: { ...s.values, [field]: value }
        }));
        validateField(field, value);
    };

    const loadData = async () => {
        update(s => ({ ...s, meta: { ...s.meta, loading: true } }));
        try {
            const data = await configurationService.getMailServerSettings();
            update(s => ({
                ...s,
                values: {
                    ...s.values,
                    host: data.host || '',
                    port: data.port || '',
                    username: data.username || '',
                    password: '',
                    fromEmail: data.fromEmail || ''
                },
                meta: { 
                    ...s.meta, 
                    loading: false,
                    original: { 
                        host: data.host || '', 
                        port: data.port || '', 
                        username: data.username || '', 
                        password: '', 
                        fromEmail: data.fromEmail || '' 
                    } 
                }
            }));
        } catch (error) {
            update(s => ({ ...s, meta: { ...s.meta, loading: false, error: null } }));
        }
    };

    const submit = async () => {
        const state = get({ subscribe });
        
        try {
            update(s => ({ ...s, meta: { ...s.meta, loading: true, error: null } }));
            
            await validationSchema.validate(state.values, { abortEarly: false });

            const original = state.meta.original;
            const textChanged = original
                ? (
                    state.values.host !== original.host ||
                    state.values.port !== original.port ||
                    state.values.username !== original.username ||
                    state.values.fromEmail !== original.fromEmail
                  )
                : true;
            const passwordChanged = !!(state.values.password && state.values.password.length > 0);
            const hasChanges = textChanged || passwordChanged;

            if (!hasChanges) {
                update(s => ({ ...s, meta: { ...s.meta, loading: false } }));
                stage.next();
                return;
            }

            await configurationService.saveMailServerSettings(state.values);

            update(s => ({ ...s, meta: { ...s.meta, loading: false } }));
            stage.next();
            snackbar.show('Server settings saved successfully', 'success');
        } catch (error: any) {
            if (error instanceof yup.ValidationError) {
                const errors: Record<string, string> = {};
                error.inner.forEach(err => {
                    if (err.path) errors[err.path] = err.message;
                });
                update(s => ({ 
                    ...s, 
                    errors, 
                    meta: { ...s.meta, loading: false, error: 'Validation failed' } 
                }));
                snackbar.show('Please check your input', 'error');
            } else {
                const msg = error.message || 'Failed to save settings';
                update(s => ({ ...s, meta: { ...s.meta, loading: false, error: msg } }));
                snackbar.show(msg, 'error');
            }
        }
    };

    return {
        subscribe,
        handleInput,
        loadData,
        submit,
        reset: () => set(initialState)
    };
};

export const serverForm = createServerFormStore();
