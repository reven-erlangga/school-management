<script lang="ts">
  import type { Snippet } from 'svelte';

  interface TabItem {
    id: string;
    label: string;
  }

  interface Props {
    tabs: TabItem[];
    activeTabId: string;
    onTabChange: (id: string) => void;
    class?: string;
    children?: Snippet; // For optional right side content after separator
  }

  let { 
    tabs = [], 
    activeTabId, 
    onTabChange, 
    class: className = '',
    children
  }: Props = $props();
</script>

<div class="flex items-center gap-2 p-1.5 bg-[#F4F7FB] dark:bg-slate-900 rounded-[24px] w-fit border border-slate-100/50 dark:border-slate-700/60 {className}">
  <!-- Main Tabs -->
  <div class="flex items-center gap-1">
    {#each tabs as tab}
      <button
        onclick={() => onTabChange(tab.id)}
        class="px-8 py-2.5 text-[14px] font-bold capitalize transition-all duration-300 rounded-[18px] cursor-pointer whitespace-nowrap
               {activeTabId === tab.id
          ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white dark:border-slate-700'
          : 'text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/60 border border-transparent'}"
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <!-- Optional Separator & Children -->
  {#if children}
    <div class="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
    <div class="flex items-center gap-1">
      {@render children()}
    </div>
  {/if}
</div>
