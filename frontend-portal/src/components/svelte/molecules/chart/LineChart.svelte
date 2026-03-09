<script lang="ts">
  import { onMount, onDestroy, type Snippet } from "svelte";
  import Chart from "chart.js/auto";
  import Icon from "../../atoms/Icon.svelte";

  interface Dataset {
    label: string;
    data: number[];
    color?: string;
    bgColor?: string;
  }

  interface Props {
    title?: string;
    subtitle?: string;
    labels?: string[];
    datasets?: Dataset[];
    yMax?: number;
    yStepSize?: number;
    unit?: string;
    rightAction?: Snippet;
  }

  let {
    title = "Chart Title",
    subtitle = "",
    labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets = [],
    yMax,
    yStepSize = 200,
    unit = "",
    rightAction,
  }: Props = $props();

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  // Default colors if not provided
  const defaultColors = [
    "#3b82f6",
    "#D4A017",
    "#BE123C",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
  ];
  let isDark = $state(false);
  onMount(() => {
    const updateMode = () =>
      (isDark = document.documentElement.classList.contains("dark"));
    updateMode();
    const mo = new MutationObserver(updateMode);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });

  const getChartData = () => {
    // Deep copy to remove Svelte proxies
    const labelsCopy = JSON.parse(JSON.stringify(labels));
    const datasetsCopy = JSON.parse(JSON.stringify(datasets));

    return {
      labels: labelsCopy,
      datasets: datasetsCopy.map((ds: any, i: number) => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.color || defaultColors[i % defaultColors.length],
        backgroundColor: "transparent",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor:
          ds.color || defaultColors[i % defaultColors.length],
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 3,
      })),
    };
  };

  const createChart = () => {
    if (chart) chart.destroy();
    if (!canvas) return;

    try {
      chart = new Chart(canvas, {
        type: "line",
        data: getChartData(),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: "index",
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              titleColor: "#1e293b",
              bodyColor: "#475569",
              borderColor: "#f1f5f9",
              borderWidth: 1,
              padding: 12,
              boxPadding: 6,
              usePointStyle: true,
              callbacks: {
                label: function (context) {
                  return ` ${context.dataset.label}: ${context.parsed.y}${unit}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: {
                color: "#94a3b8",
                font: { size: 11, weight: "bold" },
                padding: 10,
              },
            },
            y: {
              min: 0,
              max: yMax,
              border: { display: false },
              grid: { color: "#f1f5f9" },
              ticks: {
                stepSize: yStepSize,
                color: "#94a3b8",
                font: { size: 11, weight: "bold" },
                padding: 10,
                callback: (value) => `${value}${unit}`,
              },
            },
          },
        },
      });
    } catch (e) {
      console.error("Error creating chart:", e);
    }
  };

  onMount(() => {
    // Small delay to ensure canvas is ready and size is calculated
    setTimeout(() => createChart(), 100);
  });

  // Re-create chart when datasets or labels change
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

  // Helper for Legend BG colors
  const getLightColor = (color: string) => {
    if (color.startsWith("#")) {
      return `${color}${isDark ? "30" : "15"}`; // stronger for dark mode
    }
    return color;
  };
</script>

<div
  class="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-8 flex flex-col h-full transition-all hover:border-slate-300 dark:hover:border-slate-700"
>
  <div class="flex justify-between items-start">
    <div class="space-y-1">
      <h3
        class="text-[14px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider"
      >
        {title}
      </h3>
      {#if subtitle}
        <p class="text-[12px] font-medium text-slate-400 dark:text-slate-400">
          {subtitle}
        </p>
      {/if}
    </div>
    <div class="flex items-center gap-3">
      {#if rightAction}
        {@render rightAction()}
      {:else}
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
        >
          All <Icon name="play" size="10" class="rotate-90 opacity-40" />
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
        >
          <Icon name="grad" size="18" />
        </button>
      {/if}
    </div>
  </div>

  <!-- Dynamic Legend -->
  <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
    {#each datasets as ds, i}
      {@const color = ds.color || defaultColors[i % defaultColors.length]}
      <div
        class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border"
        style="background-color: {ds.bgColor ||
          getLightColor(color)}; border-color: {color}{isDark ? '55' : '30'}"
      >
        <div
          class="w-3.5 h-3.5 rounded flex items-center justify-center"
          style="background-color: {color}"
        >
          <Icon name="play" size="7" class="text-white opacity-80" />
        </div>
        <span class="text-[11px] font-bold text-slate-700 dark:text-slate-100"
          >{ds.label}</span
        >
      </div>
    {/each}
  </div>

  <div class="flex-grow min-h-[250px] w-full relative">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>
