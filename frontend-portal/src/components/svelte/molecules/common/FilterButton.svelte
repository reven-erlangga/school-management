<script lang="ts">
  import Icon from '../../atoms/Icon.svelte';

  interface Props {
    activeFiltersCount?: number;
    onclick?: () => void;
    title?: string;
  }

  let { 
    activeFiltersCount = 0, 
    onclick,
    title = 'Advanced Filters'
  }: Props = $props();
</script>

<button 
  {onclick}
  class="flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 text-slate-400 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-all active:scale-95 shrink-0 cursor-pointer relative"
  {title}
>
  <Icon name="filter" size="20" />
  {#if activeFiltersCount > 0}
    <span class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
      {activeFiltersCount}
    </span>
  {/if}
</button>
