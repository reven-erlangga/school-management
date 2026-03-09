<script module lang="ts">
    import Icon from '@components/svelte/atoms/Icon.svelte';
</script>

<script lang="ts">
    import { step } from '../stores/step.store';
</script>

<div class="px-8 py-6 border-b border-slate-800 bg-slate-900">
    <div class="flex items-center justify-center gap-4">
        <div class="flex items-center gap-2">
            <div
                class="w-8 h-8 rounded-xl flex items-center justify-center {$step ===
                'general'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400'}"
            >
                <Icon name="community" size="16" />
            </div>
            <span
                class="text-[12px] font-bold {$step === 'general'
                    ? 'text-indigo-600'
                    : 'text-slate-500'}">General</span
            >
        </div>
        <div class="w-10 h-0.5 bg-slate-800"></div>
        <div class="flex items-center gap-2">
            <div
                class="w-8 h-8 rounded-xl flex items-center justify-center {$step ===
                'server'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400'}"
            >
                <Icon name="settings" size="16" />
            </div>
            <span
                class="text-[12px] font-bold {$step === 'server'
                    ? 'text-indigo-600'
                    : 'text-slate-500'}">Server</span
            >
        </div>
        <div class="w-10 h-0.5 bg-slate-800"></div>
        <div class="flex items-center gap-2">
            <div
                class="w-8 h-8 rounded-xl flex items-center justify-center {$step ===
                'superuser'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400'}"
            >
                <Icon name="user" size="16" />
            </div>
            <span
                class="text-[12px] font-bold {$step === 'superuser'
                    ? 'text-indigo-600'
                    : 'text-slate-500'}">Super User</span
            >
        </div>
    </div>
</div>
