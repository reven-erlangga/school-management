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
    {#snippet tag()}General Setup{/snippet}
    {#snippet title()}
        Prepare Your <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400"
            >Workspace</span
        >
    {/snippet}
    {#snippet description()}
        Configure foundation identity, branding, and basic profile information.
    {/snippet}
    {#snippet illustration()}
        <div class="space-y-5">
            <div class="h-6 w-82 bg-slate-900/10 dark:bg-white/10 rounded-lg"></div>

            {#each Array(2) as _}
                <div class="grid grid-cols-3 gap-3">
                    {#each [40, 32, 48, 24, 36] as w}
                        <div
                            class="h-6 bg-slate-900/10 dark:bg-white/10 rounded-lg mb-2"
                            style={`width:${w * 4}px`}
                        ></div>
                    {/each}
                </div>
            {/each}
        </div>
    {/snippet}
</SideVisual>
