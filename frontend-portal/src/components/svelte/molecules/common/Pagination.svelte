<script lang="ts">
  import Icon from '../../atoms/Icon.svelte';

  interface Props {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPrev?: () => void;
    onNext?: () => void;
    onGoToPage?: (p: number) => void;
    onLimitChange?: (limit: number) => void;
  }

  let { 
    page, 
    limit, 
    total, 
    totalPages,
    onPrev,
    onNext,
    onGoToPage,
    onLimitChange
  }: Props = $props();

  const handleLimitSelect = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    onLimitChange?.(Number(target.value));
  };
</script>

<div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 pb-4">
  <div class="flex items-center gap-4">
    <div class="flex items-center gap-2">
      <span class="text-[13px] font-medium text-slate-400 dark:text-slate-400">Rows per page:</span>
      <select 
        class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[13px] font-bold py-1 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
        value={limit}
        onchange={handleLimitSelect}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </div>
    <div class="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
    <p class="text-[13px] font-medium text-slate-400 dark:text-slate-400">
      Showing <span class="text-slate-900 dark:text-slate-100 font-bold">{(page - 1) * limit + 1}</span> 
      to <span class="text-slate-900 dark:text-slate-100 font-bold">{Math.min(page * limit, total)}</span> 
      of <span class="text-slate-900 dark:text-slate-100 font-bold">{total}</span> records
    </p>
  </div>

  <div class="flex items-center gap-2">
    <!-- Prev Button -->
    <button 
      onclick={onPrev}
      disabled={page === 1}
      class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all active:scale-95 bg-white dark:bg-slate-900"
      title="Previous Page"
    >
      <Icon name="play" size="14" class="rotate-180" />
    </button>

    <!-- Page Numbers -->
    <div class="flex items-center gap-1.5 mx-1">
      {#each Array(totalPages) as _, i}
        {@const p = i + 1}
        {#if p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)}
          <button 
            onclick={() => onGoToPage?.(p)}
            class="w-9 h-9 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all active:scale-90
                   {page === p 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:border-indigo-600 hover:text-indigo-600'}"
          >
            {p}
          </button>
        {:else if p === 2 || p === totalPages - 1}
          <span class="text-slate-300 dark:text-slate-500 px-0.5">...</span>
        {/if}
      {/each}
    </div>

    <!-- Next Button -->
    <button 
      onclick={onNext}
      disabled={page >= totalPages}
      class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all active:scale-95 bg-white dark:bg-slate-900"
      title="Next Page"
    >
      <Icon name="play" size="14" />
    </button>
  </div>
</div>
