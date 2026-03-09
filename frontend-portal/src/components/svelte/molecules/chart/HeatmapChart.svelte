<script lang="ts">
  import Icon from '../../atoms/Icon.svelte';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  interface LegendItem {
    label: string;
    color: string;
  }

  interface Props {
    title?: string;
    subtitle?: string;
    labelsX?: string[];
    labelsY?: string[];
    legend?: LegendItem[];
    data?: number[][]; // Attendance percentages (0-100)
  }

  let { 
    title = 'Attendance Heatmap',
    subtitle = '',
    labelsX = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'C1'],
    labelsY = ['Sat', 'Fri', 'Thu', 'Wed', 'Tue', 'Mon'],
    legend = [
      { label: '<80%', color: '#BE123C' },
      { label: '80-95%', color: '#D4A017' },
      { label: '>95%', color: '#10B981' }
    ],
    data = []
  }: Props = $props();

  // Generate random data if not provided
  const gridData = $derived(
    data.length > 0 ? data : labelsY.map(() => labelsX.map(() => Math.floor(Math.random() * 40) + 60))
  );

  const getColor = (value: number) => {
    if (value < 80) return '#BE123C'; // Rose
    if (value < 95) return '#D4A017'; // Amber
    return '#10B981'; // Emerald
  };

  // State for interaction
  let hoveredCell = $state<{ x: number, y: number } | null>(null);
  let selectedColumn = $state<number | null>(7); // Default to A8 (index 7)

  const toggleColumn = (x: number) => {
    if (selectedColumn === x) {
      selectedColumn = null;
    } else {
      selectedColumn = x;
    }
  };
</script>

<div class="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-8 flex flex-col h-full overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700">
  <div class="flex justify-between items-start">
    <div class="space-y-1">
      <h3 class="text-[14px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">{title}</h3>
      {#if subtitle}
        <p class="text-[12px] font-medium text-slate-400 dark:text-slate-400">{subtitle}</p>
      {/if}
    </div>
    <button class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
      <Icon name="grad" size="18" />
    </button>
  </div>
  
  <!-- Legend -->
  <div class="flex justify-center gap-8">
    {#each legend as item}
      <div class="flex items-center gap-2.5">
        <div class="w-4 h-4 rounded-lg shadow-sm" style="background-color: {item.color}"></div>
        <span class="text-[12px] font-bold text-slate-500 dark:text-slate-300 tracking-tight">{item.label}</span>
      </div>
    {/each}
  </div>

  <div class="flex-grow flex flex-col justify-between pt-4 overflow-x-auto custom-scrollbar">
    <!-- Grid Labels Y & Heatmap Grid -->
    <div class="flex gap-4 min-w-max pb-4">
      <!-- Y Labels (Days) -->
      <div class="flex flex-col gap-2 py-1">
        {#each labelsY as label}
          <span class="text-[11px] font-bold text-slate-400 dark:text-slate-400 w-6 h-8 flex items-center">{label}</span>
        {/each}
      </div>

      <!-- Main Grid Area -->
      <div class="flex flex-col gap-2">
        {#each gridData as row, y}
          <div class="flex gap-2">
            {#each row as value, x}
              {@const color = getColor(value)}
              {@const isSelected = x === selectedColumn}
              <!-- svelte-ignore a11y_mouse_events_have_key_events -->
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div 
                class="w-8 h-8 rounded-lg cursor-pointer transition-all duration-500 relative group flex items-center justify-center shrink-0
                       {isSelected ? 'shadow-md scale-110 z-10' : 'hover:scale-105'}"
                style="background-color: {color}{isSelected ? 'CC' : '33'}"
                onmouseover={() => hoveredCell = { x, y }}
                onmouseleave={() => hoveredCell = null}
                onclick={() => toggleColumn(x)}
              >
                {#if isSelected}
                  <span 
                    class="text-[9px] font-black text-white" 
                    in:scale={{ duration: 400, start: 0.8, easing: cubicOut }}
                    out:fade={{ duration: 200 }}
                  >
                    {value}%
                  </span>
                {/if}
              </div>
            {/each}
          </div>
        {/each}

        <!-- X Labels (Classes) -->
        <div class="flex gap-2 pt-2">
          {#each labelsX as label, x}
            <span class="w-8 text-center text-[10px] font-bold uppercase tracking-tighter transition-all duration-300 {x === selectedColumn ? 'text-slate-900 dark:text-slate-100 font-black scale-110' : 'text-slate-300 dark:text-slate-600'}">
              {label}
            </span>
          {/each}
        </div>
      </div>
    </div>

    <p class="text-center text-[11px] font-black text-slate-400 dark:text-slate-500 italic mt-6 uppercase tracking-widest">Class Rows</p>
  </div>
</div>
