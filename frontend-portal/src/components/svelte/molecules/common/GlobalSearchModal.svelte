<script lang="ts">
  import Icon from '../../atoms/Icon.svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { onMount } from 'svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
  }

  let { isOpen, onClose }: Props = $props();
  let searchQuery = $state('');
  let searchInput = $state<HTMLInputElement | null>(null);

  // Mock search results
  const results = [
    { category: 'Modules', items: [
      { name: 'Institutes', icon: 'grad', path: '/admin/institutes' },
      { name: 'User Management', icon: 'community', path: '/admin/users' },
      { name: 'Demographics', icon: 'grad', path: '/admin/demographics' }
    ]},
    { category: 'Quick Actions', items: [
      { name: 'Add New Student', icon: 'plus', path: '/admin/students/new' },
      { name: 'Generate Report', icon: 'excellence', path: '/admin/reports' }
    ]}
  ];

  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  $effect(() => {
    if (isOpen && searchInput) {
      setTimeout(() => searchInput?.focus(), 50);
    }
  });

  function handleResultClick(path: string) {
    window.location.href = path;
    onClose();
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000] flex items-start justify-center pt-[15vh] px-4"
    transition:fade={{ duration: 200 }}
    onclick={onClose}
  >
    <!-- Search Modal Panel -->
    <div 
      class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800"
      transition:scale={{ duration: 300, start: 0.95 }}
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Search Input Header -->
      <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
        <Icon name="community" size="24" class="text-indigo-600" />
        <input 
          bind:this={searchInput}
          bind:value={searchQuery}
          type="text" 
          placeholder="Search for modules, actions, or settings..." 
          class="flex-grow bg-transparent border-none outline-none text-lg font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <div class="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest border border-slate-200/60 dark:border-slate-700/60">
          Esc
        </div>
      </div>

      <!-- Search Results Area -->
      <div class="flex-grow overflow-y-auto max-h-[60vh] p-4 custom-scrollbar">
        {#if searchQuery.trim() === ''}
          <div class="py-12 text-center">
            <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Icon name="community" size="32" />
            </div>
            <p class="text-slate-400 dark:text-slate-400 font-bold text-sm tracking-tight uppercase">Start typing to search...</p>
          </div>
        {:else}
          <div class="space-y-6">
            {#each results as group}
              <div class="space-y-2">
                <h4 class="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{group.category}</h4>
                <div class="space-y-1">
                  {#each group.items as item}
                    <button 
                      onclick={() => handleResultClick(item.path)}
                      class="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50/50 dark:hover:bg-slate-800 group transition-all text-left border border-transparent hover:border-indigo-100 dark:hover:border-slate-700"
                    >
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/30 shadow-sm transition-all">
                          <Icon name={item.icon as any} size="20" />
                        </div>
                        <div>
                          <p class="text-[14px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-900 transition-colors">{item.name}</p>
                          <p class="text-[11px] font-medium text-slate-400 dark:text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{item.path}</p>
                        </div>
                      </div>
                      <Icon name="arrow-right" size="18" class="text-slate-300 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Search Footer -->
      <div class="p-5 bg-slate-50/50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">
            <span class="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100">Enter</span>
            Select
          </div>
          <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">
            <span class="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100">↑↓</span>
            Navigate
          </div>
        </div>
        <div class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
          Lumina Search Engine
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Local styles for search modal if needed, but using global slim scrollbar */
</style>
