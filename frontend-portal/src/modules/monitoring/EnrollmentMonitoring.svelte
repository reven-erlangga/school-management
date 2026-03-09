<script lang="ts">
  import LineChart from '@components/svelte/molecules/chart/LineChart.svelte';
  import Icon from '@components/svelte/atoms/Icon.svelte';
  import { onMount } from 'svelte';

  interface Props {
    title?: string;
    subtitle?: string;
    source?: { url: string; method: string } | null;
  }

  let { 
    title = 'Enrollment Trend',
    subtitle = 'Overview of student enrollment across units',
    source = null
  }: Props = $props();

  let datasets = $state([
    {
      label: 'TK',
      data: [420, 510, 400, 580, 420, 600, 450, 520, 480, 620, 580, 400],
      color: '#3b82f6',
    },
    {
      label: 'SD',
      data: [620, 710, 600, 780, 620, 800, 650, 720, 680, 820, 780, 600],
      color: '#D4A017',
    },
    {
      label: 'SMP',
      data: [820, 750, 650, 880, 720, 650, 920, 850, 700, 880, 850, 650],
      color: '#BE123C',
    },
    {
      label: 'SMA',
      data: [720, 650, 550, 780, 620, 550, 820, 750, 600, 780, 750, 550],
      color: '#10b981',
    }
  ]);

  let labels = $state(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

  onMount(async () => {
    if (source?.url) {
      try {
        const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}${source.url}`);
        if (res.ok) {
           const fetchedData = await res.json();
           if (fetchedData.datasets) datasets = fetchedData.datasets;
           if (fetchedData.labels) labels = fetchedData.labels;
        }
      } catch (e) {
        console.error('Failed to fetch enrollment data:', e);
      }
    }
  });
</script>

<LineChart 
  {title} 
  {subtitle} 
  {datasets} 
  {labels} 
  yMax={1200}
  yStepSize={200}
  unit=""
>
  {#snippet rightAction()}
    <div class="flex items-center gap-3">
      <button class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
        2024 <Icon name="play" size="10" class="rotate-90 opacity-40" />
      </button>
      <button class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer">
        <Icon name="grad" size="18" />
      </button>
    </div>
  {/snippet}
</LineChart>
