import { writable, get } from 'svelte/store';
import * as yup from 'yup';
import { configurationService } from '../services/configuration.service';
import { stage } from './stage.store';
import { snackbar } from '@modules/snackbar/stores/control.store';

export type PaymentMode = 'manual' | 'xendit';

export interface XenditFormData {
  enabled: boolean;
  paymentMode: PaymentMode;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
}

export interface XenditFormState {
  values: XenditFormData;
  errors: Partial<Record<keyof XenditFormData, string>>;
  meta: {
    loading: boolean;
    isValid: boolean;
    error: string | null;
    original?: {
      enabled: boolean;
      paymentMode: PaymentMode;
      apiKey: string;
      secretKey: string;
      webhookUrl: string;
    };
  };
}

const storageKey = 'initialize:xendit';

const initialState: XenditFormState = {
  values: {
    enabled: false,
    paymentMode: 'manual',
    apiKey: '',
    secretKey: '',
    webhookUrl: '',
  },
  errors: {},
  meta: {
    loading: false,
    isValid: false,
    error: null,
  },
};

const validationSchema = yup.object({
  enabled: yup.boolean().required(),
  paymentMode: yup
    .mixed<PaymentMode>()
    .oneOf(['manual', 'xendit'])
    .required('Payment mode is required'),
  apiKey: yup.string().when('enabled', {
    is: true,
    then: (s) => s.required('API key is required'),
    otherwise: (s) => s.optional(),
  }),
  secretKey: yup.string().when('enabled', {
    is: true,
    then: (s) => s.required('Secret key is required'),
    otherwise: (s) => s.optional(),
  }),
  webhookUrl: yup.string().when('enabled', {
    is: true,
    then: (s) => s.required('Webhook URL is required').url('Must be a valid URL'),
    otherwise: (s) => s.optional(),
  }),
});

const readPersisted = (): Partial<XenditFormData> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<XenditFormData>;
    return parsed || {};
  } catch {
    return {};
  }
};

const persist = (values: XenditFormData) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(values));
  } catch {
    return;
  }
};

const toBool = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true' || value === '1';
  if (typeof value === 'number') return value === 1;
  return false;
};

const createXenditFormStore = () => {
  const persisted = readPersisted();
  const { subscribe, set, update } = writable<XenditFormState>({
    ...initialState,
    values: {
      ...initialState.values,
      ...persisted,
    },
  });

  const handleInput = (field: keyof XenditFormData, value: any) => {
    update((s) => {
      const nextValues = { ...s.values, [field]: value } as XenditFormData;
      persist(nextValues);
      return {
        ...s,
        values: nextValues,
        errors: { ...s.errors, [field]: undefined },
      };
    });
  };

  const toggleEnabled = (enabled: boolean) => {
    update((s) => {
      const nextValues: XenditFormData = {
        ...s.values,
        enabled,
        paymentMode: enabled ? s.values.paymentMode : 'manual',
      };
      persist(nextValues);
      return {
        ...s,
        values: nextValues,
        errors: {},
        meta: { ...s.meta, error: null },
      };
    });
  };

  const setPaymentMode = (paymentMode: PaymentMode) => {
    update((s) => {
      const nextValues: XenditFormData = { ...s.values, paymentMode };
      persist(nextValues);
      return { ...s, values: nextValues, meta: { ...s.meta, error: null } };
    });
  };

  const loadData = async () => {
    update((s) => ({ ...s, meta: { ...s.meta, loading: true } }));
    try {
      const data = await configurationService.getXenditSettings();
      update((s) => {
        const nextValues: XenditFormData = {
          ...s.values,
          enabled: toBool(data.enabled),
          paymentMode: (data.paymentMode || s.values.paymentMode) as PaymentMode,
          apiKey: data.apiKey || s.values.apiKey,
          secretKey: data.secretKey || s.values.secretKey,
          webhookUrl: data.webhookUrl || s.values.webhookUrl,
        };
        persist(nextValues);
        return { 
          ...s, 
          values: nextValues, 
          meta: { 
            ...s.meta, 
            loading: false,
            original: {
              enabled: nextValues.enabled,
              paymentMode: nextValues.paymentMode,
              apiKey: nextValues.apiKey,
              secretKey: nextValues.secretKey,
              webhookUrl: nextValues.webhookUrl,
            }
          } 
        };
      });
    } catch {
      update((s) => ({ ...s, meta: { ...s.meta, loading: false, error: null } }));
    }
  };

  const submit = async () => {
    const state = get({ subscribe });

    try {
      update((s) => ({ ...s, meta: { ...s.meta, loading: true, error: null } }));

      await validationSchema.validate(state.values, { abortEarly: false });

      const original = state.meta.original;
      const hasChanges = original
        ? (
          state.values.enabled !== original.enabled ||
          state.values.paymentMode !== original.paymentMode ||
          state.values.apiKey !== original.apiKey ||
          state.values.secretKey !== original.secretKey ||
          state.values.webhookUrl !== original.webhookUrl
        )
        : true;

      if (!hasChanges) {
        update((s) => ({ ...s, meta: { ...s.meta, loading: false } }));
        stage.next();
        return;
      }

      await configurationService.saveXenditSettings(state.values);

      update((s) => ({ ...s, meta: { ...s.meta, loading: false } }));
      stage.next();
      snackbar.show('Xendit settings saved successfully', 'success');
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        const errors: Partial<Record<keyof XenditFormData, string>> = {};
        error.inner.forEach((err) => {
          if (err.path) errors[err.path as keyof XenditFormData] = err.message;
        });
        update((s) => ({
          ...s,
          errors,
          meta: { ...s.meta, loading: false, error: 'Validation failed' },
        }));
        snackbar.show('Please check your input', 'error');
      } else {
        const msg = error.message || 'Failed to save Xendit settings';
        update((s) => ({
          ...s,
          meta: { ...s.meta, loading: false, error: msg },
        }));
        snackbar.show(msg, 'error');
      }
    }
  };

  return {
    subscribe,
    handleInput,
    toggleEnabled,
    setPaymentMode,
    loadData,
    submit,
    reset: () => {
      persist(initialState.values);
      set(initialState);
    },
  };
};

export const xenditForm = createXenditFormStore();
