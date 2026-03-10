<script lang="ts">
  import TextField from '@components/svelte/atoms/TextField.svelte';
  import { serverForm } from '../../../stores/server-form.store';

  const { handleInput } = serverForm;
</script>

<div class="space-y-4">
  <TextField 
    id="tolgee.apiUrl"
    label="API URL" 
    placeholder="e.g. https://app.tolgee.io" 
    value={$serverForm.values.tolgee.apiUrl} 
    error={$serverForm.errors['tolgee.apiUrl']}
    required
    onValueChange={(val) => handleInput('tolgee.apiUrl', val)}
  />
  <TextField 
    id="tolgee.apiKey"
    label="API KEY" 
    placeholder="Enter your Tolgee API Key" 
    value={$serverForm.values.tolgee.apiKey} 
    error={$serverForm.errors['tolgee.apiKey']}
    required
    onValueChange={(val) => handleInput('tolgee.apiKey', val)}
  />
</div>
