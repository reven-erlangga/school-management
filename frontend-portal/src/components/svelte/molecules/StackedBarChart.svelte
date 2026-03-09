<script lang="ts">
  import { onMount, onDestroy, type Snippet } from 'svelte';
  import Chart from 'chart.js/auto';
  import Icon from '../atoms/Icon.svelte';

  interface Dataset {
    label: string;
    data: number[];
    color: string;
  }

  interface Props {
    title?: string;
    subtitle?: string;
    datasets?: Dataset[];
    labels?: string[];
    yMax?: number;
    yStepSize?: number;
    unit?: string;
    rightAction?: Snippet;
  }

  let { 
    title = 'Stacked Bar Chart',
    subtitle = '',
    datasets = [], 
    labels = [],
    yMax,
    yStepSize,
    unit = 'M',
    rightAction
  }: Props = $props();

  let canvas: HTMLCanvasElement;
  let chart: Chart;
  let isDark = $state(false);
  onMount(() => {
    const updateMode = () => (isDark = document.documentElement.classList.contains('dark'));
    updateMode();
    const mo = new MutationObserver(updateMode);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  });

  // Use props data or fallback to default mock if empty
  const defaultDatasets = [
    { label: 'Invoiced', data: [25, 20, 22, 30, 24, 28, 32, 26, 22, 24, 18], color: '#A35C14' },
    { label: 'Collected', data: [45, 38, 42, 52, 40, 48, 55, 46, 40, 42, 35], color: '#D4A017' },
    { label: 'Overdue', data: [15, 12, 10, 18, 14, 11, 16, 13, 15, 12, 14], color: '#BE123C' }
  ];

  const defaultLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

  const getChartData = () => {
    // Deep copy to strip proxies
    const dsToUse = JSON.parse(JSON.stringify(datasets.length > 0 ? datasets : defaultDatasets));
    const labelsToUse = JSON.parse(JSON.stringify(labels.length > 0 ? labels : defaultLabels));

    return {
      labels: labelsToUse,
      datasets: dsToUse.map((ds: any) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.color,
        borderRadius: 0,
        borderSkipped: false,
        barThickness: 24,
      }))
    };
  };

  const createChart = () => {
    if (chart) chart.destroy();
    if (!canvas) return;

    try {
      chart = new Chart(canvas, {
        type: 'bar',
        data: getChartData(),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#1e293b',
              bodyColor: '#475569',
              borderColor: '#f1f5f9',
              borderWidth: 1,
              padding: 16,
              boxPadding: 8,
              usePointStyle: true,
              callbacks: {
                label: function(context) {
                  const val = context.parsed.y ?? 0;
                  return ` ${context.dataset.label}: ${val.toLocaleString()}${unit}`;
                }
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              border: { display: false },
              ticks: {
                display: false
              }
            },
            y: {
              stacked: true,
              min: 0,
              max: yMax,
              border: { display: false },
              grid: { 
                color: '#f1f5f9',
                drawTicks: false
              },
              ticks: {
                stepSize: yStepSize,
                color: '#94a3b8',
                font: { size: 10, weight: 'bold' },
                padding: 10,
                callback: (value) => `${value}${unit}`
              }
            }
          }
        }
      });
    } catch (e) {
      console.error('Error creating stacked bar chart:', e);
    }
  };

  onMount(() => {
    setTimeout(() => createChart(), 100);
  });

  $effect(() => {
    // Explicitly access the props to ensure reactivity tracks them
    const _d = datasets;
    const _l = labels;
    if (canvas && (_d || _l)) {
       createChart();
    }
  });

  onDestroy(() => {
    if (chart) chart.destroy();
  });
</script>

<div class="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-8 flex flex-col h-full transition-all hover:border-slate-300 dark:hover:border-slate-700">
  <div class="flex justify-between items-start">
    <div class="space-y-1">
      <h3 class="text-[14px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">{title}</h3>
      {#if subtitle}
        <p class="text-[12px] font-medium text-slate-400 dark:text-slate-400">{subtitle}</p>
      {/if}
    </div>
    <div class="flex items-center gap-3">
      {#if rightAction}
        {@render rightAction()}
      {:else}
        <button class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer">
          <Icon name="grad" size="18" />
        </button>
      {/if}
    </div>
  </div>
  
  <div class="flex justify-center gap-6 flex-wrap">
    {#each (datasets.length > 0 ? datasets : defaultDatasets) as ds}
      <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-transparent">
        <div class="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style="background-color: {ds.color}{isDark ? '33' : '20'}">
          <Icon name="community" size="14" style="color: {ds.color}" />
        </div>
        <span class="text-[13px] font-bold text-slate-500 dark:text-slate-300">{ds.label}</span>
      </div>
    {/each}
  </div>

  <div class="flex-grow min-h-[250px] w-full relative pt-4">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>
