<script module lang="ts">
  import Icon from "@components/svelte/atoms/Icon.svelte";
  import Button from "@components/svelte/atoms/Button.svelte";
  import Card from "@components/svelte/atoms/Card.svelte";
  import Unit from "./parts/Unit.svelte";
  import Stream from "./parts/Stream.svelte";
  import SeedingCLI from "./parts/SeedingCLI.svelte";
  import StepIndicator from "@components/svelte/atoms/StepIndicator.svelte";
</script>

<script lang="ts">
  import { fade } from "svelte/transition";
  import { Stage, stage } from "./stores/stage.store";
  import { steps } from "./const/step.const";
</script>

<div class="px-8 w-full max-w-2xl h-full flex items-center justify-center">
  <Card class="w-full">
    {#snippet header()}<StepIndicator
        items={steps}
        activeId={$stage}
      />{/snippet}
    {#snippet children()}
      {#if $stage === Stage.Unit}
        <div in:fade={{ duration: 300 }}>
          <Unit />
        </div>
      {:else if $stage === Stage.Stream}
        <div in:fade={{ duration: 300 }}>
          <Stream />
        </div>
      {:else if $stage === Stage.Seeding}
        <div in:fade={{ duration: 300 }}>
          <SeedingCLI />
        </div>
      {:else}
        <div
          class="p-12 flex flex-col items-center justify-center text-center space-y-4"
          in:fade={{ duration: 300 }}
        >
          <div
            class="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"
          >
            <Icon name="check" size="24" />
          </div>
          <h3 class="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Seeding Complete
          </h3>
          <p class="text-[13px] font-medium text-slate-400">
            Database has been successfully populated.
          </p>
          <Button
            variant="primary"
            size="lg"
            class="px-8"
            onclick={() => (window.location.href = "/admin/dashboard")}
            >Go to Dashboard</Button
          >
        </div>
      {/if}
    {/snippet}
  </Card>
</div>
