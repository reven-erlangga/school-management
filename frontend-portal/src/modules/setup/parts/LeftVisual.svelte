<script lang="ts">
  import InitializeForm from '../_sections/initialize/Index.svelte';
  import StarterForm from '../_sections/starter/Index.svelte';
  import { screen } from '../stores/pages.store';
</script>

<div class="hidden lg:block w-1/2 relative">
  <div
    class={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
      $screen === 'initialize'
        ? 'opacity-100 pointer-events-auto'
        : 'opacity-0 pointer-events-none'
    }`}
  >
    <InitializeForm />
  </div>

  <div
    class={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
      $screen === 'starter'
        ? 'opacity-100 pointer-events-auto'
        : 'opacity-0 pointer-events-none'
    }`}
  >
    <StarterForm />
  </div>
</div>
