import { writable, get } from 'svelte/store';
import * as yup from 'yup';
import { configurationService } from '../services/configuration.service';
import { step } from './step.store';
import { snackbar } from '../../../store/snackbar.store';

export interface SuperuserFormData {
    name: string;
    email: string;
    password: string;
}

export interface SuperuserFormState {
    values: SuperuserFormData;
    errors: Partial<Record<keyof SuperuserFormData, string>>;
    meta: {
        loading: boolean;
        isValid: boolean;
        error: string | null;
    };
}

const initialState: SuperuserFormState = {
    values: {
        name: '',
        email: '',
        password: ''
    },
    errors: {},
    meta: {
        loading: false,
        isValid: false,
        error: null
    }
};

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Must be a valid email').required('Email is required'),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters')
});

const createSuperuserFormStore = () => {
    const { subscribe, set, update } = writable<SuperuserFormState>(initialState);

    const validateField = async (field: keyof SuperuserFormData, value: any) => {
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

    const handleInput = (field: keyof SuperuserFormData, value: any) => {
        update(s => ({
            ...s,
            values: { ...s.values, [field]: value }
        }));
        validateField(field, value);
    };

    const submit = async () => {
        const state = get({ subscribe });
        
        try {
            update(s => ({ ...s, meta: { ...s.meta, loading: true, error: null } }));
            
            await validationSchema.validate(state.values, { abortEarly: false });
            
            await configurationService.createSuperUser(state.values);

            update(s => ({ ...s, meta: { ...s.meta, loading: false } }));
            step.next(); // Go to done
            snackbar.show('Super user created successfully', 'success');
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
                const msg = error.message || 'Failed to create super user';
                update(s => ({ ...s, meta: { ...s.meta, loading: false, error: msg } }));
                snackbar.show(msg, 'error');
            }
        }
    };

    return {
        subscribe,
        handleInput,
        submit,
        reset: () => set(initialState)
    };
};

export const superuserForm = createSuperuserFormStore();
