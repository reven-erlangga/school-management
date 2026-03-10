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
    {#snippet tag()}Mail Server{/snippet}
    {#snippet title()}
        Connect <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400"
            >Mail Server</span
        >
    {/snippet}
    {#snippet description()}
        Set up SMTP host, port, credentials, and sender email so the portal can send notifications.
    {/snippet}
    {#snippet illustration()}
        <div class="space-y-5">
            {#each Array(5) as _}
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-900/10 dark:bg-white/10"></div>

                    <div class="flex-1 space-y-2">
                        <div class="h-4 w-48 bg-slate-900/10 dark:bg-white/10 rounded"></div>
                        <div class="h-4 w-72 bg-slate-900/10 dark:bg-white/10 rounded"></div>
                    </div>

                    <div class="h-4 w-12 bg-slate-900/10 dark:bg-white/10 rounded"></div>
                </div>
            {/each}
        </div>
    {/snippet}
</SideVisual>
