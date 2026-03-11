<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import Button from '@components/svelte/atoms/Button.svelte';
  import Icon from '@components/svelte/atoms/Icon.svelte';
  import CLI from '@components/svelte/atoms/CLI.svelte';
  import { setScreen } from '../../../../../stores/pages.store';
  import { seedingCli } from "../../../stores/seeding-cli";

  onMount(async () => {
    await seedingCli.resume();
  });

  onDestroy(() => {
    seedingCli.stop();
  });

  const handleFinish = () => {
    setScreen('starter');
  };
</script>

<div class="p-8 space-y-6" in:fade={{ duration: 300 }}>
  {#if $seedingCli.meta.error}
    <div class="p-4 rounded-2xl border border-rose-200/70 bg-rose-50 text-rose-700 text-[13px] font-semibold">
      {$seedingCli.meta.error}
    </div>
  {/if}

  <CLI logs={$seedingCli.logs} completed={$seedingCli.completed} progress={$seedingCli.progress} />

  {#if $seedingCli.completed}
    <div class="pt-2 flex justify-center" in:fade>
      <Button variant="primary" onclick={handleFinish}>
        <span class="inline-flex items-center gap-2">
          <Icon name="arrow-right" size="16" />
          Isi Data Starter
        </span>
      </Button>
    </div>
  {/if}
</div>
