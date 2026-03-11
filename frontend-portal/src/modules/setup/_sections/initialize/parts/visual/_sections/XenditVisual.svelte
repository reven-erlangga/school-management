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
  {#snippet tag()}Xendit{/snippet}
  {#snippet title()}
    Configure <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Payments</span>
  {/snippet}
  {#snippet description()}
    Enable Xendit integration to automate payments, or keep manual flow with no dependency.
  {/snippet}
  {#snippet illustration()}
    <div class="h-[240px] overflow-hidden">
      <div class="h-full flex flex-col justify-between">
        <div class="rounded-3xl border border-slate-900/10 dark:border-white/10 bg-white/40 dark:bg-white/5 p-5">
          <div class="flex items-start justify-between gap-6">
            <div class="space-y-3 flex-1">
              <div class="h-6 w-24 rounded-xl bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-3 w-40 rounded bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-3 w-32 rounded bg-slate-900/10 dark:bg-white/10"></div>
            </div>
            <div class="space-y-3">
              <div class="h-3 w-28 rounded bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-3 w-24 rounded bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-9 w-9 rounded-2xl bg-slate-900/10 dark:bg-white/10"></div>
            </div>
          </div>

          <div class="mt-5 h-px w-full bg-slate-900/10 dark:bg-white/10"></div>

          <div class="mt-4 space-y-3">
            <div class="flex items-center gap-4">
              <div class="h-3 flex-1 rounded bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-3 w-14 rounded bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-3 w-16 rounded bg-slate-900/10 dark:bg-white/10"></div>
            </div>
            <div class="flex items-center gap-4">
              <div class="h-3 flex-1 rounded bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-3 w-14 rounded bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-3 w-16 rounded bg-slate-900/10 dark:bg-white/10"></div>
            </div>
            <div class="flex items-center gap-4">
              <div class="h-3 flex-1 rounded bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-3 w-14 rounded bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-3 w-16 rounded bg-slate-900/10 dark:bg-white/10"></div>
            </div>
          </div>

          <div class="mt-5 h-px w-full bg-slate-900/10 dark:bg-white/10"></div>

          <div class="mt-4 flex items-end justify-between gap-6">
            <div class="space-y-3">
              <div class="h-3 w-32 rounded bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-3 w-28 rounded bg-slate-900/10 dark:bg-white/10"></div>
            </div>

            <div class="space-y-3">
              <div class="h-3 w-24 rounded bg-slate-900/10 dark:bg-white/10"></div>
              <div class="h-9 w-36 rounded-2xl bg-slate-900/10 dark:bg-white/10"></div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between gap-6">
          <div class="h-11 w-24 rounded-2xl border border-slate-900/10 dark:border-white/10 bg-slate-900/5 dark:bg-white/5"></div>
          <div class="h-11 w-11 rounded-2xl border border-slate-900/10 dark:border-white/10 bg-slate-900/5 dark:bg-white/5"></div>
        </div>
      </div>
    </div>
  {/snippet}
</SideVisual>
