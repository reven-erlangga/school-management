<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@components/svelte/atoms/Icon.svelte';

  interface Props {
    title?: string;
    subtitle?: string;
    source?: { url: string; method: string } | null;
  }

  let { 
    title = 'Grading Windows', 
    source = null 
  }: Props = $props();

  let data = $state<any[]>([]);
  let loading = $state(false);

  onMount(async () => {
    if (source?.url) {
      loading = true;
      try {
        const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}${source.url}`);
        if (res.ok) {
           data = await res.json();
        }
      } catch (e) {
        console.error('Failed to fetch grading data:', e);
      } finally {
        loading = false;
      }
    }
  });
</script>

<div class="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm space-y-8">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <h3 class="text-[15px] font-black text-slate-900 uppercase tracking-tight">
      {title}
    </h3>
    <div class="flex items-center gap-3">
      <div class="relative group">
        <Icon
          name="community"
          size="14"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"
        />
        <input
          type="text"
          placeholder="Search here..."
          class="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-[12px] font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all w-full sm:w-48"
        />
      </div>
      <button class="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
        <Icon name="grad" size="18" />
      </button>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center py-8">
      <div class="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else}
    <div class="space-y-4">
      {#each data as item}
        <div class="border border-slate-100 rounded-[24px] p-6 space-y-5 hover:bg-slate-50/50 transition-colors group/card">
          <div class="flex justify-between items-center">
            <h4 class="text-[14px] font-black text-slate-800 tracking-tight">
              {item.label} —
              <span class="text-slate-400 font-bold">{item.status}</span>
            </h4>
            <button class="p-1.5 rounded-lg hover:bg-white transition-colors">
              <Icon name="play" size="10" class="rotate-90 text-slate-300 group-hover/card:text-slate-600" />
            </button>
          </div>
          {#if item.children}
            <div class="grid grid-cols-3 gap-6">
              {#each item.children as child}
                <div class="space-y-2">
                  <p class="text-[12px] font-black text-slate-800">{child.label}</p>
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] font-black px-2 py-0.5 rounded-md {child.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : child.color === 'rose' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-amber-50 text-amber-500 border border-amber-100'}">
                      {child.status}
                    </span>
                    <span class="text-[12px] font-black text-slate-900 tracking-tighter">{child.value}</span>
                  </div>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">submitted</p>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
