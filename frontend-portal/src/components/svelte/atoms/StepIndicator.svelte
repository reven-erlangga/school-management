<script lang="ts">
  import Icon from '@components/svelte/atoms/Icon.svelte';

  export interface StepIndicatorItem {
    id: string;
    label: string;
    icon: string;
  }

  interface Props {
    items: StepIndicatorItem[];
    activeId: string;
    class?: string;
    padding?: string;
  }

  let {
    items,
    activeId,
    class: className = '',
    padding = 'px-8 py-6',
  }: Props = $props();
</script>

<div class="{padding} border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 {className}">
  <div class="flex items-center justify-center gap-4">
    {#each items as item, index (item.id)}
      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center {activeId === item.id
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}"
        >
          <Icon name={item.icon as any} size="16" />
        </div>
        <span class="text-[12px] font-bold {activeId === item.id ? 'text-indigo-600' : 'text-slate-500'}"
          >{item.label}</span
        >
      </div>

      {#if index < items.length - 1}
        <div class="w-10 h-0.5 bg-slate-200 dark:bg-slate-800"></div>
      {/if}
    {/each}
  </div>
</div>
