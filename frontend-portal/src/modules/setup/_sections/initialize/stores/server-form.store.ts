import { writable, get } from 'svelte/store';
import * as yup from 'yup';
import { configurationService } from '../services/configuration.service';
import { stage } from './stage.store';
import { snackbar } from '@modules/snackbar/stores/control.store';

export interface ServerFormData {
    tolgee: {
        apiUrl: string;
        apiKey: string;
    };
    mailServer: {
        host: string;
        port: string;
        username: string;
        password?: string;
        fromEmail: string;
    };
}

export interface ServerFormState {
    values: ServerFormData;
    errors: Partial<Record<string, string>>; // Flattened errors
    meta: {
        loading: boolean;
        isValid: boolean;
        error: string | null;
    };
}

const initialState: ServerFormState = {
    values: {
        tolgee: {
            apiUrl: '',
            apiKey: ''
        },
        mailServer: {
            host: '',
            port: '',
            username: '',
            password: '',
            fromEmail: ''
        }
    },
    errors: {},
    meta: {
        loading: false,
        isValid: false,
        error: null
    }
};

const validationSchema = yup.object({
    tolgee: yup.object({
        apiUrl: yup.string().url('Must be a valid URL').required('Tolgee API URL is required'),
        apiKey: yup.string().required('Tolgee API Key is required')
    }),
    mailServer: yup.object({
        host: yup.string().required('SMTP Host is required'),
        port: yup.string().required('SMTP Port is required'), // Could be number, but text field usually returns string
        username: yup.string().required('SMTP Username is required'),
        password: yup.string().optional(),
        fromEmail: yup.string().email('Must be a valid email').required('From Email is required')
    })
});

const createServerFormStore = () => {
    const { subscribe, set, update } = writable<ServerFormState>(initialState);

    // Helper to update nested state safely
    const updateNestedValue = (path: string, value: any) => {
        update(s => {
            const newValues = { ...s.values };
            const keys = path.split('.');
            let current: any = newValues;
            
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            
            return { ...s, values: newValues };
        });
    };

    const validateField = async (path: string, value: any) => {
        try {
            await validationSchema.validateAt(path, { [path.split('.')[0]]: get({ subscribe }).values[path.split('.')[0] as keyof ServerFormData] });
            update(s => ({
                ...s,
                errors: { ...s.errors, [path]: undefined }
            }));
        } catch (err: any) {
            update(s => ({
                ...s,
                errors: { ...s.errors, [path]: err.message }
            }));
        }
    };

    const handleInput = (path: string, value: any) => {
        updateNestedValue(path, value);
        // We validate the whole object branch for nested fields usually, but yup validateAt supports paths
        // We need to construct a partial object matching the schema structure for validateAt to work correctly with nested paths in some yup versions,
        // or just rely on the fact that we updated the store value first.
        // Actually yup.validateAt validates against the whole schema object but focuses on the path.
        // So passing the FULL current values is correct.
        
        const currentValues = get({ subscribe }).values;
        
        try {
             validationSchema.validateAt(path, currentValues)
                .then(() => {
                    update(s => ({
                        ...s,
                        errors: { ...s.errors, [path]: undefined }
                    }));
                })
                .catch((err: any) => {
                    update(s => ({
                        ...s,
                        errors: { ...s.errors, [path]: err.message }
                    }));
                });
        } catch (e) {
            // Synchronous error handling if needed
        }
    };

    const loadData = async () => {
        update(s => ({ ...s, meta: { ...s.meta, loading: true } }));
        try {
            const data = await configurationService.getServerSettings();
            update(s => ({
                ...s,
                values: data,
                meta: { ...s.meta, loading: false }
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
            
            await configurationService.saveServerSettings(state.values);

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
