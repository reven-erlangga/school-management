<script lang="ts">
  import { onMount } from 'svelte';
  import AttendanceHeatmap from '@components/svelte/molecules/chart/HeatmapChart.svelte';

  interface Props {
    title?: string;
    subtitle?: string;
    source?: { url: string; method: string } | null;
  }

  let { 
    title = 'Attendance Heatmap', 
    subtitle = 'Weekly attendance intensity',
    source = null 
  }: Props = $props();

  let data = $state<number[][]>([]);
  let labelsX = $state<string[]>([]);
  let labelsY = $state<string[]>([]);
  let legend = $state<any[]>([]);
  let loading = $state(false);

  onMount(async () => {
    if (source?.url) {
      loading = true;
      try {
        const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}${source.url}`);
        if (res.ok) {
           const fetchedData = await res.json();
           data = fetchedData.data;
           labelsX = fetchedData.labelsX;
           labelsY = fetchedData.labelsY;
           if (fetchedData.legend) legend = fetchedData.legend;
        }
      } catch (e) {
        console.error('Failed to fetch attendance data:', e);
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
  {#if data.length > 0 && labelsX.length > 0 && labelsY.length > 0}
    <AttendanceHeatmap 
      {title} 
      {subtitle} 
      {labelsX} 
      {labelsY} 
      {data} 
      {legend}
    />
  {:else}
     <!-- Render with defaults if data is not yet loaded or empty, but don't pass empty arrays -->
     <AttendanceHeatmap 
      {title} 
      {subtitle} 
    />
  {/if}
{/if}
