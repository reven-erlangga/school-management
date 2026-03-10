<script lang="ts">
  import Button from "@components/svelte/atoms/Button.svelte";
  import InitializeSection from "./_sections/initialize/Index.svelte";
  import SeederSection from "./_sections/seeder/Index.svelte"
  import { screen, toggleScreen } from "./stores/pages.store";
</script>

<div
  class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex overflow-hidden relative transition-colors duration-300"
>
  <div class="absolute top-4 left-1/2 -translate-x-1/2 z-50">
    <Button onclick={toggleScreen}>
      Switch to {$screen === "initialize" ? "Seeder" : "Initialize"}
    </Button>
  </div>

  <div class="hidden lg:block w-full relative">
    {#if $screen === "initialize"}
    <InitializeSection />
    {:else}
    <SeederSection />
    {/if}
  </div>

</div>
