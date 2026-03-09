<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    class?: string;
    children: Snippet;
  }

  let { 
    variant = 'primary', 
    class: className = '', 
    children 
  }: Props = $props();

  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider transition-all duration-300';
  
  const variants = {
    primary: 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]',
    secondary: 'bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]',
    outline: 'border border-[#E2E8F0] text-[#64748B]',
    ghost: 'text-[#64748B]'
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;
</script>

<span class={combinedStyles}>
  {@render children()}
</span>
