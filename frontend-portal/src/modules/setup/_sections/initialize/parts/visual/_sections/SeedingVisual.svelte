<script lang="ts">
  import SideVisual from "@components/svelte/organisms/SideVisual.svelte";
  import Icon from "@components/svelte/atoms/Icon.svelte";
</script>

<SideVisual
  theme={{
    primary: "bg-indigo-500",
    secondary: "bg-violet-600",
    accent: "bg-indigo-400",
  }}
>
  {#snippet tag()}Seeding{/snippet}
  {#snippet title()}
    Running <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Seeders</span>
  {/snippet}
  {#snippet description()}
    Populate essential data in the background. Keep this tab open until the process completes.
  {/snippet}
  {#snippet illustration()}
    <div class="h-[240px] overflow-hidden">
      <div class="h-full flex flex-col justify-between">
        <div class="rounded-3xl border border-slate-900/10 dark:border-white/10 bg-white/40 dark:bg-white/5 overflow-hidden">
          <div class="bg-slate-900/5 dark:bg-white/5 px-4 py-3 border-b border-slate-900/10 dark:border-white/10 flex items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-rose-500/80"></div>
              <div class="w-2 h-2 rounded-full bg-amber-500/80"></div>
              <div class="w-2 h-2 rounded-full bg-emerald-500/80"></div>
            </div>
            <div class="text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-300">
              seeder-cli
            </div>
            <div class="text-slate-500 dark:text-slate-300">
              <Icon name="server" size="14" />
            </div>
          </div>

          <div class="p-4 space-y-2 font-mono text-[11px]">
            <div class="flex items-center gap-2 text-indigo-500 dark:text-indigo-300">
              <span>$</span>
              <div class="h-3 w-56 rounded bg-slate-900/10 dark:bg-white/10"></div>
            </div>
            <div class="h-3 w-44 rounded bg-slate-900/10 dark:bg-white/10"></div>
            <div class="h-3 w-52 rounded bg-slate-900/10 dark:bg-white/10"></div>
            <div class="h-3 w-40 rounded bg-slate-900/10 dark:bg-white/10"></div>
            <div class="h-3 w-60 rounded bg-slate-900/10 dark:bg-white/10"></div>
            <div class="h-3 w-32 rounded bg-slate-900/10 dark:bg-white/10"></div>
          </div>

          <div class="px-4 pb-4">
            <div class="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 mb-2">
              <span>Progress</span>
              <span>72%</span>
            </div>
            <div class="h-2 rounded-full bg-slate-900/10 dark:bg-white/10 overflow-hidden">
              <div class="h-full w-[72%] bg-indigo-500/70"></div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between gap-6">
          <div class="h-11 w-24 rounded-2xl border border-slate-900/10 dark:border-white/10 bg-slate-900/5 dark:bg-white/5"></div>
          <div class="h-11 w-40 rounded-2xl border border-slate-900/10 dark:border-white/10 bg-slate-900/5 dark:bg-white/5"></div>
        </div>
      </div>
    </div>
  {/snippet}
</SideVisual>
