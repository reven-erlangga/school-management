<script lang="ts">
    import { onMount } from "svelte";

    interface Props {
        /** Additional CSS classes */
        class?: string;
        /** Layout variant */
        variant?: "centered" | "split" | "with-form";
        /** Theme colors for background blobs and accents */
        theme?: {
            primary: string;
            secondary: string;
            accent: string;
        };
        /** Enable/disable entry animations */
        animate?: boolean;
        
        // Slots / Snippets
        tag?: import("svelte").Snippet;
        title?: import("svelte").Snippet;
        description?: import("svelte").Snippet;
        illustration?: import("svelte").Snippet;
        actions?: import("svelte").Snippet;
        children?: import("svelte").Snippet;
    }

    let {
        class: className = "",
        variant = "centered",
        theme = {
            primary: "bg-emerald-500",
            secondary: "bg-teal-600",
            accent: "bg-emerald-400"
        },
        animate = true,
        tag,
        title,
        description,
        illustration,
        actions,
        children
    }: Props = $props();

    let mounted = $state(false);

    onMount(() => {
        if (animate) {
            // Small delay to ensure smooth entry after render
            setTimeout(() => {
                mounted = true;
            }, 100);
        } else {
            mounted = true;
        }
    });
</script>

<div
    class="flex w-full h-full relative bg-slate-900 overflow-hidden rounded-none {className}"
    class:items-center={variant === "centered"}
    class:justify-center={variant === "centered"}
    class:p-12={variant !== "with-form"}
>
    <!-- Abstract Background Shapes -->
    <div
        class="absolute top-0 left-0 w-full h-full opacity-20 transition-colors duration-1000"
    >
        <div
            class="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-all duration-1000 {theme.primary}"
        ></div>
        <div
            class="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-all duration-1000 {theme.secondary}"
        ></div>
    </div>

    <!-- Pattern Overlay -->
    <div
        class="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
    ></div>

    <div
        class="relative z-10 w-full max-w-lg transition-all duration-1000 ease-out transform"
        class:translate-x-0={!animate || mounted}
        class:opacity-100={!animate || mounted}
        class:-translate-x-10={animate && !mounted}
        class:opacity-0={animate && !mounted}
    >
        <div class="space-y-8">
            {#if tag}
            <div
                class="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10"
            >
                <div
                    class="w-2 h-2 rounded-full animate-ping transition-colors duration-500 {theme.accent}"
                ></div>
                <span
                    class="text-xs font-bold text-white tracking-widest uppercase"
                >
                    {@render tag()}
                </span>
            </div>
            {/if}

            {#if title}
            <h1
                class="text-6xl font-black text-white leading-[1.1] tracking-tight"
            >
                {@render title()}
            </h1>
            {/if}

            {#if description}
            <p
                class="text-slate-400 text-lg font-medium leading-relaxed max-w-md"
            >
                {@render description()}
            </p>
            {/if}

            {#if actions}
            <div class="pt-4">
                {@render actions()}
            </div>
            {/if}

            {@render children?.()}
        </div>
    </div>

    <!-- Floating Image/Card Mockup -->
    {#if illustration}
    <div
        class="absolute bottom-[-10%] right-[-5%] w-[70%] aspect-video bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 shadow-2xl transform rotate-[-6deg] group hover:rotate-0 transition-all duration-1000 delay-200 ease-out"
        class:translate-y-0={!animate || mounted}
        class:opacity-100={!animate || mounted}
        class:translate-y-20={animate && !mounted}
        class:opacity-0={animate && !mounted}
    >
        <div class="p-8 space-y-6">
            <div class="flex items-center justify-between">
                <div class="flex gap-2">
                    <div class="w-3 h-3 rounded-full bg-rose-500/50"></div>
                    <div class="w-3 h-3 rounded-full bg-amber-500/50"></div>
                    <div class="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                </div>
                <div class="w-24 h-2 bg-white/10 rounded-full"></div>
            </div>

            {@render illustration()}
        </div>
    </div>
    {/if}
</div>
