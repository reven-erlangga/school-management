<script lang="ts">
  import LandingTemplate from '../templates/LandingTemplate.svelte';
  import InstituteTemplate from '../templates/InstituteTemplate.svelte';
  import { currentSchoolBranding, updateSubdomain } from '../../../store/subdomain';
  import { onMount } from 'svelte';

  onMount(() => {
    updateSubdomain();
  });
</script>

{#if $currentSchoolBranding}
  <InstituteTemplate />
{:else}
  <LandingTemplate />
{/if}
