<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Button from "../../components/svelte/atoms/Button.svelte";
    import Icon from "../../components/svelte/atoms/Icon.svelte";
    import TextField from "../../components/svelte/atoms/TextField.svelte";
    import { login, form as loginForm, handleInput } from "../../store/auth";

    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });
</script>

<div
    class="w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen sm:min-h-0"
>
    <div
        class="w-full max-w-[440px] space-y-6 transition-all duration-700 ease-out transform {mounted
            ? 'translate-y-0 opacity-100'
            : 'translate-y-4 opacity-0'}"
    >
        <div class="space-y-2">
            <span
                class="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400"
                >Admin</span
            >
            <h1
                class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white"
            >
                Masuk ke Admin Panel
            </h1>
            <p class="text-[13px] font-medium text-slate-400">
                Gunakan kredensial administrator Anda untuk mengakses dashboard.
            </p>
        </div>

        <div
            class="bg-white/80 dark:bg-slate-900/95 backdrop-blur-xl rounded-[24px] border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-black/10"
        >
            <form class="space-y-6" onsubmit={login}>
                <div class="space-y-1">
                    <TextField
                        id="username"
                        label="IDENTIFICATION"
                        icon="user"
                        placeholder="Username atau Email"
                        name="username"
                        value={$loginForm.values.username}
                        error={$loginForm.errors.username}
                        onValueChange={handleInput}
                    />
                </div>

                <div class="space-y-2.5">
                    <div class="space-y-1">
                        <TextField
                            id="password"
                            label="SECURITY KEY"
                            type="password"
                            icon="settings"
                            placeholder="••••••••••••"
                            name="password"
                            value={$loginForm.values.password}
                            error={$loginForm.errors.password}
                            onValueChange={handleInput}
                        />
                    </div>
                    <div class="flex justify-end pr-1">
                        <a
                            href="/forgot-password"
                            class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 uppercase tracking-wider"
                        >
                            Recovery?
                        </a>
                    </div>
                </div>

                {#if $loginForm.meta.error}
                    <!-- Error handled by Snackbar -->
                {/if}

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    class="w-full h-14 rounded-2xl font-black text-[14px] active:scale-[0.98]"
                    disabled={$loginForm.meta.loading}
                >
                    {#if $loginForm.meta.loading}
                        <div class="flex items-center justify-center gap-3">
                            <div
                                class="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"
                            ></div>
                            <span
                                class="tracking-widest uppercase text-xs font-black"
                                >Processing...</span
                            >
                        </div>
                    {:else}
                        <span
                            class="flex items-center justify-center gap-2 tracking-widest uppercase text-xs font-black"
                        >
                            Enter Dashboard
                            <Icon name="arrow-right" size="18" />
                        </span>
                    {/if}
                </Button>
            </form>
        </div>

        <!-- Footer Info -->
        <div
            class="w-full flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest px-2"
        >
            <span>© 2024 Lumina Academy</span>
            <div class="flex gap-4">
                <button class="hover:text-slate-500 transition-colors"
                    >Privacy</button
                >
                <button class="hover:text-slate-500 transition-colors"
                    >Support</button
                >
            </div>
        </div>
    </div>
</div>
