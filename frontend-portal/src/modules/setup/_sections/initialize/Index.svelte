<script module lang="ts">
import Icon from "@components/svelte/atoms/Icon.svelte";
import Button from "@components/svelte/atoms/Button.svelte";
import Card from "@components/svelte/atoms/Card.svelte";
import General from "./parts/General.svelte";
import Server from "./parts/server/Index.svelte";
import Superuser from "./parts/Superuser.svelte";
import StepIndicator from "@components/svelte/atoms/StepIndicator.svelte";
</script>

<script lang="ts">
  import { fade } from "svelte/transition";
  import { stage, Stage } from "./stores/stage.store";
  import { steps } from "./const/step.const";
</script>

<div class="px-8 w-full max-w-2xl h-full flex items-center justify-center">
  <Card class="w-full">
    {#snippet header()}<StepIndicator
        items={steps}
        activeId={$stage}
      />{/snippet}
    {#snippet children()}
      {#if $stage === Stage.General}
        <General />
      {:else if $stage === Stage.Server}
        <Server onBack={() => stage.back()} />
      {:else if $stage === Stage.Superuser}
        <Superuser onBack={() => stage.back()} />
      {:else}stage
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
            Inisialisasi Berhasil
          </h3>
          <p class="text-[13px] font-medium text-slate-600 dark:text-slate-400">
            Semua konfigurasi dasar telah disimpan.
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
