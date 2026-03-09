<script lang="ts">
    import Icon from '@components/svelte/atoms/Icon.svelte';
    import { seederStep } from '../stores/step.store';
</script>

<div class="px-8 py-6 border-b border-slate-800 bg-slate-900">
    <div class="flex items-center justify-center gap-4">
        <!-- Unit Step -->
        <div class="flex items-center gap-2">
            <div
                class="w-8 h-8 rounded-xl flex items-center justify-center {$seederStep === 'unit'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'}"
            >
                <Icon name="community" size="16" />
            </div>
            <span
                class="text-[12px] font-bold {$seederStep === 'unit'
                    ? 'text-emerald-500'
                    : 'text-slate-500'}">Unit</span
            >
        </div>

        <div class="w-10 h-0.5 bg-slate-800"></div>

        <!-- Stream Step -->
        <div class="flex items-center gap-2">
            <div
                class="w-8 h-8 rounded-xl flex items-center justify-center {$seederStep === 'stream'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'}"
            >
                <Icon name="server" size="16" />
            </div>
            <span
                class="text-[12px] font-bold {$seederStep === 'stream'
                    ? 'text-emerald-500'
                    : 'text-slate-500'}">Stream</span
            >
        </div>

        <div class="w-10 h-0.5 bg-slate-800"></div>

        <!-- Seeding/Done Step -->
        <div class="flex items-center gap-2">
            <div
                class="w-8 h-8 rounded-xl flex items-center justify-center {$seederStep === 'seeding' || $seederStep === 'done'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'}"
            >
                <Icon name="check" size="16" />
            </div>
            <span
                class="text-[12px] font-bold {$seederStep === 'seeding' || $seederStep === 'done'
                    ? 'text-emerald-500'
                    : 'text-slate-500'}">Seeding</span
            >
        </div>
    </div>
</div>
