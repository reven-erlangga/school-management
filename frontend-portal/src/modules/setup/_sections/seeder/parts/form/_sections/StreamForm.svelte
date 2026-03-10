<script lang="ts">
  import { fade } from "svelte/transition";
  import TextField from "@components/svelte/atoms/TextField.svelte";

  let streamName = $state("");
</script>

<div class="p-8 space-y-6" in:fade={{ duration: 300 }}>
  <div class="space-y-1">
    <h2 class="text-xl font-extrabold text-slate-900 dark:text-slate-100">Setup Streams</h2>
    <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
      Define the academic streams or programs.
    </p>
  </div>

  <div class="space-y-4">
    <TextField id="streamName" label="STREAM NAME" placeholder="e.g. Science, Arts, General" bind:value={streamName} />
  </div>
</div>
