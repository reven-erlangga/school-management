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
  {#snippet tag()}Super User{/snippet}
  {#snippet title()}
    Create <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Super User</span>
  {/snippet}
  {#snippet description()}
    Create the first administrator account to manage schools, users, and system configuration.
  {/snippet}
  {#snippet illustration()}
    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-slate-900/10 dark:bg-white/10"></div>

        <div class="space-y-2">
          <div class="h-4 w-32 bg-slate-900/10 dark:bg-white/10 rounded"></div>
          <div class="h-3 w-48 bg-slate-900/10 dark:bg-white/10 rounded"></div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="h-3 w-16 bg-slate-900/10 dark:bg-white/10 rounded"></div>
          <div class="h-10 w-full bg-slate-900/10 dark:bg-white/10 rounded-xl"></div>
        </div>

        <div class="space-y-2">
          <div class="h-3 w-20 bg-slate-900/10 dark:bg-white/10 rounded"></div>
          <div class="h-10 w-full bg-slate-900/10 dark:bg-white/10 rounded-xl"></div>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <div class="h-10 w-24 bg-slate-900/10 dark:bg-white/10 rounded-xl"></div>
        <div class="h-10 w-32 bg-slate-900/10 dark:bg-white/10 rounded-xl"></div>
      </div>
    </div>
  {/snippet}
</SideVisual>
