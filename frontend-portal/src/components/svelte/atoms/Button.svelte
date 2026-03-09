<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade } from 'svelte/transition';

  interface Props {
    onclick?: (e: MouseEvent) => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    class?: string;
    disabled?: boolean;
    title?: string;
    children?: Snippet;
    ref?: HTMLButtonElement | null;
  }

  let { 
    onclick, 
    type = 'button', 
    variant = 'primary', 
    size = 'md',
    class: className = '',
    disabled = false,
    title = '',
    children,
    ref = $bindable(null)
  }: Props = $props();

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 border-transparent',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white border-transparent',
    outline: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:border-indigo-600 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400',
    ghost: 'bg-transparent border-transparent text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[12px] rounded-lg',
    md: 'px-5 py-2.5 text-[13px] rounded-xl',
    lg: 'px-8 py-3.5 text-[14px] rounded-2xl',
    icon: 'p-2.5 rounded-xl'
  };
</script>

<button
  bind:this={ref}
  {type}
  {onclick}
  {disabled}
  {title}
  class="
    flex items-center justify-center transition-all active:scale-95 cursor-pointer border
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    {variants[variant]}
    {sizes[size]}
    {className}
  "
>
  {@render children?.()}
</button>
