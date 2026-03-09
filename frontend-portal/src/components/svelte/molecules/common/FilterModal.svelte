<script lang="ts">
  import Icon from '../../atoms/Icon.svelte';
  import { fade, fly } from 'svelte/transition';

  interface FilterConfig {
    id: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'number_range';
    options?: string[];
    min?: number;
    max?: number;
  }

  interface Props {
    isOpen: boolean;
    filters: FilterConfig[];
    onClose: () => void;
    onApply: (values: Record<string, any>) => void;
  }

  let { isOpen, filters, onClose, onApply }: Props = $props();
  let filterValues = $state<Record<string, any>>({});

  const handleApply = () => {
    onApply(filterValues);
    onClose();
  };

  const handleReset = () => {
    filterValues = {};
  };
</script>

{#if isOpen}
  <div class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
    <!-- Backdrop -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      transition:fade={{ duration: 200 }}
      onclick={onClose}
    ></div>

    <!-- Modal Content -->
    <div 
      class="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] overflow-hidden border border-slate-200/60 dark:border-slate-700/60"
      transition:fly={{ y: 20, duration: 400 }}
    >
      <!-- Header -->
      <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">Advanced Filters</h3>
          <p class="text-[13px] font-medium text-slate-400 dark:text-slate-400 mt-0.5">Refine your data view</p>
        </div>
        <button 
          onclick={onClose}
          class="w-10 h-10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
        >
          <Icon name="close" size="18" />
        </button>
      </div>

      <!-- Body -->
      <div class="px-8 py-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {#each filters as filter}
          <div class="space-y-2">
            <label for={filter.id} class="text-[12px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest ml-1">
              {filter.label}
            </label>
            
            {#if filter.type === 'text'}
              <input 
                id={filter.id}
                type="text" 
                bind:value={filterValues[filter.id]}
                placeholder={`Search by ${filter.label.toLowerCase()}...`}
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-[14px] font-medium text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
              />
            {:else if filter.type === 'select'}
              <select 
                id={filter.id}
                bind:value={filterValues[filter.id]}
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-[14px] font-medium text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="">All {filter.label}s</option>
                {#each filter.options || [] as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
            {:else if filter.type === 'date'}
              <input 
                id={filter.id}
                type="date" 
                bind:value={filterValues[filter.id]}
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-[14px] font-medium text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
              />
            {:else if filter.type === 'number_range'}
              <div class="flex items-center gap-4">
                <input 
                  type="number" 
                  placeholder="Min"
                  bind:value={filterValues[`${filter.id}_min`]}
                  class="w-1/2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-[14px] font-medium text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
                />
                <div class="h-px w-4 bg-slate-200 dark:bg-slate-700"></div>
                <input 
                  type="number" 
                  placeholder="Max"
                  bind:value={filterValues[`${filter.id}_max`]}
                  class="w-1/2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-[14px] font-medium text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
                />
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Footer -->
      <div class="px-8 py-6 bg-slate-50/50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button 
          onclick={handleReset}
          class="text-[13px] font-bold text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          Reset All
        </button>
        <div class="flex items-center gap-3">
          <button 
            onclick={onClose}
            class="px-6 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button 
            onclick={handleApply}
            class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[13px] font-bold transition-all active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Local styles if needed, but using global slim scrollbar */
</style>
