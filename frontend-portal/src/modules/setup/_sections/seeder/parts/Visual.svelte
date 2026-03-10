<script lang="ts">
  import SideVisual from '@components/svelte/organisms/SideVisual.svelte';
</script>

<SideVisual
  theme={{
    primary: 'bg-emerald-500',
    secondary: 'bg-teal-600',
    accent: 'bg-emerald-400'
  }}
>
  {#snippet tag()}Foundation Setup{/snippet}
  {#snippet title()}
    Define Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Identity</span>
  {/snippet}
  {#snippet description()}
    Set up your organization profile. This information will be displayed across the portal and official documents.
  {/snippet}
  {#snippet illustration()}
    <div class="space-y-5">
      <div class="h-6 w-40 bg-slate-900/10 dark:bg-white/10 rounded-lg"></div>

      <div class="grid grid-cols-3 gap-3">
        <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div class="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Unit</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white">SD</div>
          <div class="flex gap-1 flex-wrap text-[9px]">
            <span class="px-2 py-0.5 rounded bg-slate-900/10 dark:bg-white/10 text-slate-600 dark:text-slate-300">Morning</span>
            <span class="px-2 py-0.5 rounded bg-slate-900/10 dark:bg-white/10 text-slate-600 dark:text-slate-300">Regular</span>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div class="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Unit</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white">SMP</div>
          <div class="flex gap-1 flex-wrap text-[9px]">
            <span class="px-2 py-0.5 rounded bg-slate-900/10 dark:bg-white/10 text-slate-600 dark:text-slate-300">Regular</span>
            <span class="px-2 py-0.5 rounded bg-slate-900/10 dark:bg-white/10 text-slate-600 dark:text-slate-300">Afternoon</span>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div class="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Unit</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white">SMA</div>
          <div class="flex gap-1 flex-wrap text-[9px]">
            <span class="px-2 py-0.5 rounded bg-slate-900/10 dark:bg-white/10 text-slate-600 dark:text-slate-300">Science</span>
            <span class="px-2 py-0.5 rounded bg-slate-900/10 dark:bg-white/10 text-slate-600 dark:text-slate-300">Social</span>
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-slate-900/10 dark:border-white/5 flex gap-2 flex-wrap text-[9px]">
        <span class="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Morning</span>
        <span class="px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Regular</span>
        <span class="px-2 py-1 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">Afternoon</span>
      </div>
    </div>
  {/snippet}
</SideVisual>
