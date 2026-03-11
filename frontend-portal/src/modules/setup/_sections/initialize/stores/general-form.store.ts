import { writable, get } from 'svelte/store';
import * as yup from 'yup';
import { configurationService } from '../services/configuration.service';
import { stage } from './stage.store';
import { snackbar } from '@modules/snackbar/stores/control.store';

export interface GeneralFormData {
    foundationName: string;
    appName: string;
    shortName: string;
    description: string;
    logo: FileList | null;
    favicon: FileList | null;
    logoUrl?: string | null;
    faviconUrl?: string | null;
}

export interface GeneralFormState {
    values: GeneralFormData;
    errors: Partial<Record<keyof GeneralFormData, string>>;
    meta: {
        loading: boolean;
        isValid: boolean;
        error: string | null;
        original?: {
            foundationName: string;
            appName: string;
            shortName: string;
            description: string;
            logoUrl?: string | null;
            faviconUrl?: string | null;
        };
    };
}

const initialState: GeneralFormState = {
    values: {
        foundationName: '',
        appName: '',
        shortName: '',
        description: '',
        logo: null,
        favicon: null
    },
    errors: {},
    meta: {
        loading: false,
        isValid: false,
        error: null
    }
};

const validationSchema = yup.object({
    foundationName: yup.string().required('Foundation name is required'),
    appName: yup.string().required('Application name is required'),
    shortName: yup.string().required('Short name is required').max(10, 'Max 10 characters'),
    description: yup.string().optional()
});

const createGeneralFormStore = () => {
    const { subscribe, set, update } = writable<GeneralFormState>(initialState);

    const validateField = async (field: keyof GeneralFormData, value: any) => {
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

    const handleInput = (field: keyof GeneralFormData, value: any) => {
        update(s => ({
            ...s,
            values: { ...s.values, [field]: value }
        }));
        validateField(field, value);
    };

    const loadData = async () => {
        update(s => ({ ...s, meta: { ...s.meta, loading: true } }));
        try {
            const data = await configurationService.getGeneralSettings();
            update(s => ({
                ...s,
                values: {
                    ...s.values,
                    foundationName: data.foundationName || '',
                    appName: data.appName || '',
                    shortName: data.shortName || '',
                    description: data.description || '',
                    logoUrl: data.logoUrl || null,
                    faviconUrl: data.faviconUrl || null
                },
                meta: { 
                    ...s.meta, 
                    loading: false,
                    original: {
                        foundationName: data.foundationName || '',
                        appName: data.appName || '',
                        shortName: data.shortName || '',
                        description: data.description || '',
                        logoUrl: data.logoUrl || null,
                        faviconUrl: data.faviconUrl || null
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
            update(s => ({ ...s, meta: { ...s.meta, loading: true, error: '' } }));
            
            await validationSchema.validate(state.values, { abortEarly: false });

            const original = state.meta.original;
            const logoChanged = !!(state.values.logo && state.values.logo.length > 0);
            const faviconChanged = !!(state.values.favicon && state.values.favicon.length > 0);
            const textChanged = original
                ? (
                    state.values.foundationName !== original.foundationName ||
                    state.values.appName !== original.appName ||
                    state.values.shortName !== original.shortName ||
                    (state.values.description || '') !== (original.description || '')
                  )
                : true;
            const hasChanges = textChanged || logoChanged || faviconChanged;

            if (!hasChanges) {
                update(s => ({ ...s, meta: { ...s.meta, loading: false } }));
                stage.next();
                return;
            }
            
            await configurationService.saveGeneralSettings({
                foundationName: state.values.foundationName,
                appName: state.values.appName,
                shortName: state.values.shortName,
                description: state.values.description,
                logo: state.values.logo ? state.values.logo[0] : null,
                favicon: state.values.favicon ? state.values.favicon[0] : null
            });

            update(s => ({ ...s, meta: { ...s.meta, loading: false } }));
            stage.next();
            snackbar.show('General settings saved successfully', 'success');
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

export const generalForm = createGeneralFormStore();
