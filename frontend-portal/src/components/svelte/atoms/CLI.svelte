<script lang="ts">
  import Icon from '@components/svelte/atoms/Icon.svelte';

  export let logs: string[] = [];
  export let completed = false;
  export let progress = 0;
  export let title = 'seeder-cli — bash';
  export let containerId = 'cli-container';
  export let heightClass = 'h-64';
</script>

<div class="bg-slate-950 rounded-xl border border-slate-800 shadow-inner overflow-hidden font-mono text-xs md:text-sm">
  <div class="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
    <div class="flex gap-1.5">
      <div class="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
      <div class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
      <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
    </div>
    <div class="flex-1 text-center text-slate-500 text-[10px] uppercase tracking-wider">{title}</div>
    <div class="text-slate-500">
      <Icon name="server" size="14" />
    </div>
  </div>

  <div id={containerId} class={`p-4 ${heightClass} overflow-y-auto space-y-1 text-slate-300 custom-scrollbar`}>
    {#each logs as log}
      <div class="font-mono break-all whitespace-pre-wrap">
        {#if log.includes('✔')}
          <span class="text-emerald-400">{log}</span>
        {:else if log.startsWith('>')}
          <span class="text-indigo-400">$</span> {log.substring(2)}
        {:else if log.includes('successfully')}
          <span class="text-emerald-400 font-bold">{log}</span>
        {:else if log.includes('Error') || log.includes('failed')}
          <span class="text-red-400">{log}</span>
        {:else}
          {log}
        {/if}
      </div>
    {/each}

    {#if !completed}
      <div class="animate-pulse">_</div>
    {/if}
  </div>

  <div class="bg-slate-900 px-4 py-2 border-t border-slate-800">
    <div class="flex justify-between text-[10px] text-slate-500 mb-1">
      <span>Progress</span>
      <span>{progress}%</span>
    </div>
    <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div class="h-full bg-indigo-500 transition-all duration-300 ease-out" style={`width: ${progress}%`}></div>
    </div>
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
</style>
