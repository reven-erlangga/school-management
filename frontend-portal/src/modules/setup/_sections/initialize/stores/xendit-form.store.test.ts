import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

describe('xendit-form.store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('persists enabled toggle to localStorage', async () => {
    const { xenditForm } = await import('./xendit-form.store');
    xenditForm.toggleEnabled(true);

    const state = get(xenditForm);
    expect(state.values.enabled).toBe(true);

    const persisted = JSON.parse(localStorage.getItem('initialize:xendit') || '{}');
    expect(persisted.enabled).toBe(true);
  });

  it('clears payment mode to manual when disabled', async () => {
    const { xenditForm } = await import('./xendit-form.store');
    xenditForm.toggleEnabled(true);
    xenditForm.setPaymentMode('xendit');
    xenditForm.toggleEnabled(false);

    const state = get(xenditForm);
    expect(state.values.enabled).toBe(false);
    expect(state.values.paymentMode).toBe('manual');
  });
});

