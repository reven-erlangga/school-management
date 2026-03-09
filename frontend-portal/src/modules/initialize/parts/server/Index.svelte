<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Button from '../../../../components/svelte/atoms/Button.svelte';
  import { serverForm } from '../../stores/server-form.store';
  import TolgeeSection from './_sections/TolgeeSection.svelte';
  import MailSection from './_sections/MailSection.svelte';

  interface Props {
    onBack: () => void;
  }

  let { onBack }: Props = $props();
  let activeTab: 'tolgee' | 'mail' = $state('tolgee');

  const { loadData, submit } = serverForm;

  onMount(() => {
    loadData();
  });
</script>

<div class="p-8 space-y-6" in:fade={{ duration: 300 }}>
  <!-- Tabs -->
  <div class="flex gap-8 border-b border-slate-100 dark:border-slate-800">
      <button 
        class="pb-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 relative {activeTab === 'tolgee' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}"
        onclick={() => activeTab = 'tolgee'}
      >
        Tolgee
        {#if activeTab === 'tolgee'}
            <div class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" in:fade={{ duration: 200 }}></div>
        {/if}
      </button>
      <button 
        class="pb-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 relative {activeTab === 'mail' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}"
        onclick={() => activeTab = 'mail'}
      >
        Mail Server
        {#if activeTab === 'mail'}
            <div class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" in:fade={{ duration: 200 }}></div>
        {/if}
      </button>
  </div>

  <div class="min-h-[300px]">
    {#if activeTab === 'tolgee'}
        <div in:fade={{ duration: 200 }}>
            <TolgeeSection />
        </div>
    {:else}
        <div in:fade={{ duration: 200 }}>
            <MailSection />
        </div>
    {/if}
  </div>

  <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
    <Button variant="ghost" onclick={onBack}>Back</Button>
    <Button 
        variant="primary" 
        size="lg" 
        onclick={submit} 
        disabled={$serverForm.meta.loading} 
        class="px-8"
    >
      {$serverForm.meta.loading ? 'Saving...' : 'Save & Continue'}
    </Button>
  </div>
</div>
