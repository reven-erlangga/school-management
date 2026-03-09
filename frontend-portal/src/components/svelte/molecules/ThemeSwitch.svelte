<script lang="ts">
  import Icon from '../atoms/Icon.svelte';
  import Button from '../atoms/Button.svelte';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  interface Props {
    theme?: 'light' | 'dark';
    onThemeChange?: (theme: 'light' | 'dark') => void;
  }

  let { theme, onThemeChange = () => {} }: Props = $props();

  let currentTheme = $state<'light' | 'dark'>(theme ?? 'light');
  let mounted = $state(false);

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    currentTheme = nextTheme;
    localStorage.setItem('admin_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    onThemeChange(nextTheme);
  };

  $effect(() => {
    if (theme && theme !== currentTheme) {
      currentTheme = theme;
    }
  });

  onMount(() => {
    mounted = true;
    if (theme) return;

    const storedTheme = localStorage.getItem('admin_theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      currentTheme = storedTheme;
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      onThemeChange(storedTheme);
      return;
    }
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme = 'dark';
      document.documentElement.classList.add('dark');
      onThemeChange('dark');
    }
  });
</script>

<Button 
  onclick={toggleTheme}
  variant="ghost"
  size="icon"
  class="rounded-2xl border-none flex items-center justify-center group w-11 h-11 transition-all duration-300 focus:outline-none
         {currentTheme === 'light' ? 'bg-amber-50/40 hover:bg-amber-50' : 'bg-slate-800/40 hover:bg-slate-800'} dark:bg-slate-800/40 dark:hover:bg-slate-800"
  title="Toggle Theme"
>
  <div class="relative w-full h-full flex items-center justify-center">
    {#if mounted}
      {#if currentTheme === 'light'}
        <div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }} class="absolute inset-0 flex items-center justify-center">
          <Icon name="moon" size="20" class="text-slate-500 group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-slate-100 transition-colors" />
        </div>
      {:else}
        <div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }} class="absolute inset-0 flex items-center justify-center">
          <Icon name="sun" size="20" class="text-amber-400 group-hover:text-amber-300 transition-colors" />
        </div>
      {/if}
    {/if}
  </div>
</Button>
