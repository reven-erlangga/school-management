<script lang="ts">
  import { screen } from '../stores/pages.store';
  // import InitializeVisual from '../_sections/initialize/parts/';
  // import SeederVisual from '../_sections/seeder/parts/visual/Index.svelte';

</script>

<div class="hidden lg:block w-1/2 relative">
  <div
    class={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
      $screen === 'initialize'
        ? 'opacity-100'
        : 'opacity-0'
    }`}
  >
    <!-- <InitializeVisual /> -->
  </div>

  <div
    class={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
      $screen === 'seeder'
        ? 'opacity-100'
        : 'opacity-0'
    }`}
  >
    <!-- <SeederVisual /> -->
</div>
</div>
