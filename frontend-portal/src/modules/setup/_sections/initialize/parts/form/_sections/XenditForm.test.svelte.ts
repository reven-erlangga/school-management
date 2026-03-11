import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';

vi.mock('../../../stores/xendit-form.store', async () => {
  const { writable } = await import('svelte/store');

  const store = writable({
    values: {
      enabled: false,
      paymentMode: 'manual',
      apiKey: '',
      secretKey: '',
      webhookUrl: '',
    },
    errors: {},
    meta: { loading: false, isValid: false, error: null },
  });

  const toggleEnabled = vi.fn((enabled: boolean) => {
    store.update((s: any) => ({
      ...s,
      values: { ...s.values, enabled, paymentMode: enabled ? s.values.paymentMode : 'manual' },
    }));
  });

  const setPaymentMode = vi.fn((paymentMode: 'manual' | 'xendit') => {
    store.update((s: any) => ({ ...s, values: { ...s.values, paymentMode } }));
  });

  return {
    xenditForm: {
      subscribe: store.subscribe,
      handleInput: vi.fn(),
      toggleEnabled,
      setPaymentMode,
      loadData: vi.fn(),
      submit: vi.fn(),
    },
  };
});

import XenditForm from './XenditForm.svelte';
import { xenditForm } from '../../../stores/xendit-form.store';

describe('XenditForm', () => {
  it('toggles integration ON and shows payment mode options', async () => {
    const { getByTestId, queryByTestId } = render(XenditForm);

    expect(queryByTestId('xendit-mode-auto')).toBeNull();

    const toggle = getByTestId('xendit-enabled-switch');
    await fireEvent.click(toggle);

    expect(xenditForm.toggleEnabled).toHaveBeenCalledWith(true);
    expect(queryByTestId('xendit-mode-auto')).not.toBeNull();
    expect(queryByTestId('xendit-mode-manual')).not.toBeNull();
  });
});

