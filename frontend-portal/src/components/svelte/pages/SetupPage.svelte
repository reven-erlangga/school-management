<script lang="ts">
  import InitializeVisual from '../organisms/landing/InitializeVisual.svelte';
  import InitializeForm from '../../../modules/initialize/Index.svelte';
  import SeederForm from '../../../modules/seeder/Index.svelte';
  import { step } from '../../../modules/initialize/stores/step.store';
  import Button from '../atoms/Button.svelte';
  import SetupSeederVisual from '../organisms/SideVisual.svelte';

  let mode: 'initialize' | 'seeder' = $state('initialize');

  const toggleMode = () => {
    mode = mode === 'initialize' ? 'seeder' : 'initialize';
  };
</script>

<div class="dark min-h-screen bg-slate-950 flex overflow-hidden relative">

  <!-- Toggle -->
  <div class="absolute top-4 left-1/2 -translate-x-1/2 z-50">
    <Button onclick={toggleMode}>
      Switch to {mode === 'initialize' ? 'Seeder' : 'Initialize'}
    </Button>
  </div>

  <!-- LEFT : FORM -->
  <div class="hidden lg:block w-1/2 relative">

    <!-- Initialize Form -->
    <div
      class={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
        mode === 'initialize'
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      <InitializeForm />
    </div>

    <!-- Seeder Form -->
    <div
      class={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
        mode === 'seeder'
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      <SeederForm />
    </div>

  </div>

  <!-- RIGHT : VISUAL -->
  <div class="hidden lg:block w-1/2 relative">

    <!-- Initialize Visual -->
    <div
      class={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
        mode === 'initialize'
          ? 'opacity-100'
          : 'opacity-0'
      }`}
    >
      <InitializeVisual step={$step} />
    </div>

    <!-- Seeder Visual -->
    <div
      class={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
        mode === 'seeder'
          ? 'opacity-100'
          : 'opacity-0'
      }`}
    >
      <SetupSeederVisual
        theme={{
          primary: 'bg-emerald-500',
          secondary: 'bg-teal-600',
          accent: 'bg-emerald-400'
        }}
      >
        {#snippet tag()}Foundation Setup{/snippet}
        {#snippet title()}
          Define Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Identity</span>
        {/snippet}
        {#snippet description()}
          Set up your organization profile. This information will be displayed across the portal and official documents.
        {/snippet}
        {#snippet illustration()}
          <div class="space-y-5">
            <!-- Title -->
            <div class="h-6 w-40 bg-white/10 rounded-lg"></div>

            <!-- Unit Cards -->
            <div class="grid grid-cols-3 gap-3">
                <!-- SD -->
                <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <div class="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Unit</div>
                    <div class="text-sm font-bold text-white">SD</div>
                    <div class="flex gap-1 flex-wrap text-[9px]">
                        <span class="px-2 py-0.5 rounded bg-white/10 text-slate-300">Morning</span>
                        <span class="px-2 py-0.5 rounded bg-white/10 text-slate-300">Regular</span>
                    </div>
                </div>

                <!-- SMP -->
                <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <div class="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Unit</div>
                    <div class="text-sm font-bold text-white">SMP</div>
                    <div class="flex gap-1 flex-wrap text-[9px]">
                        <span class="px-2 py-0.5 rounded bg-white/10 text-slate-300">Regular</span>
                        <span class="px-2 py-0.5 rounded bg-white/10 text-slate-300">Afternoon</span>
                    </div>
                </div>

                <!-- SMA -->
                <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <div class="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Unit</div>
                    <div class="text-sm font-bold text-white">SMA</div>
                    <div class="flex gap-1 flex-wrap text-[9px]">
                        <span class="px-2 py-0.5 rounded bg-white/10 text-slate-300">Science</span>
                        <span class="px-2 py-0.5 rounded bg-white/10 text-slate-300">Social</span>
                    </div>
                </div>
            </div>

            <!-- Streams Overview -->
            <div class="pt-2 border-t border-white/5 flex gap-2 flex-wrap text-[9px]">
                <span class="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Morning</span>
                <span class="px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Regular</span>
                <span class="px-2 py-1 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">Afternoon</span>
            </div>
          </div>
        {/snippet}
      </SetupSeederVisual>
    </div>

  </div>

</div>