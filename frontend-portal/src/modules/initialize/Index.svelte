<script lang="ts">
  import Icon from '../../components/svelte/atoms/Icon.svelte';
  import Button from '../../components/svelte/atoms/Button.svelte';
  import { fade } from 'svelte/transition';
  import General from './parts/General.svelte';
  import Server from './parts/server/Index.svelte';
  import Superuser from './parts/Superuser.svelte';
  import { step } from './stores/step.store';
    import Step from './parts/Step.svelte';
</script>

<div class="px-8 h-full flex items-center justify-center">
  <div class="w-full bg-slate-900/95 rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
    <Step />
  
    {#if $step === 'general'}
      <General />
    {:else if $step === 'server'}
      <Server onBack={() => step.back()} />
    {:else if $step === 'superuser'}
      <Superuser onBack={() => step.back()} />
    {:else}
      <div class="p-12 flex flex-col items-center justify-center text-center space-y-4" in:fade={{ duration: 300 }}>
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Icon name="check" size="24" />
        </div>
        <h3 class="text-xl font-extrabold text-slate-900 dark:text-slate-100">Inisialisasi Berhasil</h3>
        <p class="text-[13px] font-medium text-slate-400">Semua konfigurasi dasar telah disimpan.</p>
        <Button variant="primary" size="lg" class="px-8" onclick={() => (window.location.href = '/admin/dashboard')}>Go to Dashboard</Button>
      </div>
    {/if}
  </div>
</div>
