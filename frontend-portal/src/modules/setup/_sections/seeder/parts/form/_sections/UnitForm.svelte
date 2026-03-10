<script lang="ts">
  import { fade } from "svelte/transition";
  import TextField from "@components/svelte/atoms/TextField.svelte";

  let unitName = $state("");
</script>

<div class="p-8 space-y-6" in:fade={{ duration: 300 }}>
  <div class="space-y-1">
    <h2 class="text-xl font-extrabold text-slate-900 dark:text-slate-100">Setup Units</h2>
    <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
      Define the organizational units for your institution.
    </p>
  </div>

  <div class="space-y-4">
    <TextField id="unitName" label="UNIT NAME" placeholder="e.g. Primary School, High School" bind:value={unitName} />
  </div>
</div>
