<script module lang="ts">
  import StepIndicator from "@components/svelte/atoms/StepIndicator.svelte";
  import Card from "@components/svelte/atoms/Card.svelte";
  import Button from "@components/svelte/atoms/Button.svelte";
  import Icon from "@components/svelte/atoms/Icon.svelte";
  import UnitForm from "./_sections/UnitForm.svelte";
  import StreamForm from "./_sections/StreamForm.svelte";
  import SeedingCLI from "../SeedingCLI.svelte";
</script>

<script lang="ts">
  import { fade } from "svelte/transition";
  import { Stage, stage } from "../../stores/stage.store";
  import { steps } from "../../const/step.const";
</script>

<div class="px-8 w-full h-full flex items-center justify-center">
  <div class="w-full max-w-2xl">
    <Card class="w-full" headerPadding="p-0" contentPadding="p-0">
      {#snippet header()}<StepIndicator items={steps} activeId={$stage} />{/snippet}
      {#snippet children()}
        {#if $stage === Stage.Unit}
          <UnitForm />
        {:else if $stage === Stage.Stream}
          <StreamForm />
        {:else if $stage === Stage.Seeding}
          <SeedingCLI />
        {:else}
          <div
            class="p-12 flex flex-col items-center justify-center text-center space-y-4"
            in:fade={{ duration: 300 }}
          >
            <div
              class="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center"
            >
              <Icon name="check" size="24" />
            </div>
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Seeding Complete
            </h3>
            <p class="text-[13px] font-medium text-slate-600 dark:text-slate-400">
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
      {#snippet footer()}
        {#if $stage === Stage.Unit}
          <div class="flex items-center justify-end">
            <Button variant="primary" size="lg" class="px-8" onclick={() => stage.next()}>
              Next
            </Button>
          </div>
        {:else if $stage === Stage.Stream}
          <div class="flex items-center justify-between">
            <Button variant="ghost" onclick={() => stage.back()}>Back</Button>
            <Button variant="primary" size="lg" class="px-8" onclick={() => stage.next()}>
              Start Seeding
            </Button>
          </div>
        {:else if $stage === Stage.Seeding}
          <div></div>
        {/if}
      {/snippet}
    </Card>
  </div>
</div>
