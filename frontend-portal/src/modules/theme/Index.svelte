<script lang="ts">
    import Icon from "@components/svelte/atoms/Icon.svelte";
    import Button from "@components/svelte/atoms/Button.svelte";
    import { fade } from "svelte/transition";
    import { appearance } from "./stores/apperance.store";
</script>

<Button
    onclick={appearance.toggle}
    variant="ghost"
    size="icon"
    class="rounded-2xl border-none flex items-center justify-center group w-11 h-11 transition-all duration-300 focus:outline-none
         {$appearance === 'light'
        ? 'bg-amber-50/40 hover:bg-amber-50'
        : 'bg-slate-800/40 hover:bg-slate-800'} dark:bg-slate-800/40 dark:hover:bg-slate-800"
    title="Toggle Theme"
>
    <div class="relative w-full h-full flex items-center justify-center">
        {#if $appearance === "light"}
                <div
                    in:fade={{ duration: 300 }}
                    out:fade={{ duration: 300 }}
                    class="absolute inset-0 flex items-center justify-center"
                >
                    <Icon
                        name="moon"
                        size="20"
                        class="text-slate-500 group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-slate-100 transition-colors"
                    />
                </div>
            {:else}
                <div
                    in:fade={{ duration: 300 }}
                    out:fade={{ duration: 300 }}
                    class="absolute inset-0 flex items-center justify-center"
                >
                    <Icon
                        name="sun"
                        size="20"
                        class="text-amber-400 group-hover:text-amber-300 transition-colors"
                    />
                </div>
            {/if}
    </div>
</Button>
