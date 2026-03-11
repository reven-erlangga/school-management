<script lang="ts">
  import SideVisual from "@components/svelte/organisms/SideVisual.svelte";
</script>

<SideVisual
  theme={{
    primary: "bg-indigo-500",
    secondary: "bg-violet-600",
    accent: "bg-indigo-400",
  }}
>
  {#snippet tag()}Starter{/snippet}
  {#snippet title()}
    Configure <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Unit & Stream</span>
  {/snippet}
  {#snippet description()}
    Define organizational units and academic streams to bootstrap the portal structure.
  {/snippet}
  {#snippet illustration()}
    <div class="h-[240px] overflow-hidden">
      <div class="h-full flex flex-col justify-between">
        <div class="space-y-5">
          {#each Array(3) as _}
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full bg-slate-900/10 dark:bg-white/10"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 w-40 bg-slate-900/10 dark:bg-white/10 rounded"></div>
                <div class="h-4 w-64 bg-slate-900/10 dark:bg-white/10 rounded"></div>
              </div>
              <div class="h-4 w-10 bg-slate-900/10 dark:bg-white/10 rounded"></div>
            </div>
          {/each}
        </div>
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-900/10 dark:bg-white/10"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-36 bg-slate-900/10 dark:bg-white/10 rounded"></div>
            <div class="h-4 w-56 bg-slate-900/10 dark:bg-white/10 rounded"></div>
          </div>
          <div class="h-4 w-8 bg-slate-900/10 dark:bg-white/10 rounded"></div>
        </div>
      </div>
    </div>
  {/snippet}
</SideVisual>

