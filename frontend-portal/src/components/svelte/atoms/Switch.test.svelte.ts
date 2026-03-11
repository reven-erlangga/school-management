import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Switch from './Switch.svelte';

describe('Switch atom', () => {
  it('calls onValueChange when toggled', async () => {
    const onValueChange = vi.fn();
    const { getByTestId } = render(Switch, {
      props: { checked: false, dataTestid: 'switch', onValueChange },
    });
    const el = getByTestId('switch');
    await fireEvent.click(el);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});

