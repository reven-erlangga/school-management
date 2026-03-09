<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';

  interface Props {
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    title: string;
    subtitle?: string;
    data: number[];
    labels: string[];
  }

  let { type, title, subtitle = '', data, labels }: Props = $props();
  let canvas: HTMLCanvasElement;
  let chart: Chart;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    chart = new Chart(ctx, {
      type: type as any,
      data: {
        labels: labels,
        datasets: [{
          label: title,
          data: data,
          backgroundColor: [
            'rgba(79, 70, 229, 0.1)',
            'rgba(147, 51, 234, 0.1)',
            'rgba(16, 185, 129, 0.1)',
            'rgba(245, 158, 11, 0.1)',
          ],
          borderColor: [
            '#4F46E5',
            '#9333EA',
            '#10B981',
            '#F59E0B',
          ],
          borderWidth: 2,
          tension: 0.4,
          fill: type === 'line'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: ['pie', 'doughnut'].includes(type),
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 11, family: 'Inter' }
            }
          },
          title: {
            display: false
          }
        },
        scales: ['pie', 'doughnut'].includes(type) ? {} : {
          y: {
            beginAtZero: true,
            grid: { display: false },
            ticks: { font: { size: 10, family: 'Inter' } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10, family: 'Inter' } }
          }
        }
      }
    });
  });

  onDestroy(() => {
    if (chart) chart.destroy();
  });
</script>

<div class="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm flex flex-col min-h-[300px] transition-all hover:border-slate-300">
  <div class="mb-6 flex items-start justify-between">
    <div class="space-y-1">
      <h3 class="text-[14px] font-black text-slate-900 uppercase tracking-wider">{title}</h3>
      {#if subtitle}
        <p class="text-[12px] font-medium text-slate-400">{subtitle}</p>
      {/if}
    </div>
  </div>
  <div class="flex-grow relative min-h-[220px]">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>
