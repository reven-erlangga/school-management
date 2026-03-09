<script lang="ts">
  import { onMount } from 'svelte';
  import StackedBarChart from "@components/svelte/molecules/StackedBarChart.svelte";
  import Icon from "@components/svelte/atoms/Icon.svelte";

  interface Props {
      title?: string;
      subtitle?: string;
      source?: { url: string; method: string } | null;
  }

  let {
      title = "Finance Collection",
      subtitle = "Overview of financial collections and overdue",
      source = null
  }: Props = $props();

  let datasets = $state<any[]>([]);
  let labels = $state<string[]>([]);
  let loading = $state(false);

  onMount(async () => {
    if (source?.url) {
      loading = true;
      try {
        const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}${source.url}`);
        if (res.ok) {
           const fetchedData = await res.json();
           if (fetchedData.datasets) datasets = fetchedData.datasets;
           if (fetchedData.labels) labels = fetchedData.labels;
        }
      } catch (e) {
        console.error('Failed to fetch finance data:', e);
      } finally {
        loading = false;
      }
    }
  });
</script>

{#if loading}
  <div class="w-full h-[300px] flex items-center justify-center bg-slate-50 rounded-[32px] animate-pulse">
    <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
{:else}
  <StackedBarChart
      {title}
      {subtitle}
      {datasets}
      {labels}
      yMax={100}
      yStepSize={20}
      unit="M"
  >
      {#snippet rightAction()}
          <div class="flex items-center gap-2">
              <button
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                  This Month <Icon
                      name="play"
                      size="10"
                      class="rotate-90 opacity-40"
                  />
              </button>
              <button
                  class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              >
                  <Icon name="grad" size="18" />
              </button>
          </div>
      {/snippet}
  </StackedBarChart>
{/if}
