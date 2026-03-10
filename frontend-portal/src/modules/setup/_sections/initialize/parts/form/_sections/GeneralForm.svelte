<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import TextField from "@components/svelte/atoms/TextField.svelte";
  import FileUpload from "@components/svelte/atoms/FileUpload.svelte";
  import { generalForm } from '../../../stores/general-form.store';

  const { handleInput, loadData } = generalForm;

  onMount(() => {
    loadData();
  });
</script>

<div class="p-8 space-y-6" in:fade={{ duration: 300 }}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <TextField 
        id="foundationName"
        label="FOUNDATION NAME" 
        placeholder="e.g. ICANN Foundation" 
        value={$generalForm.values.foundationName} 
        error={$generalForm.errors.foundationName}
        required
        onValueChange={(val) => handleInput('foundationName', val)}
    />
    <TextField 
        id="appName"
        label="APPLICATION NAME" 
        placeholder="e.g. School Management System" 
        value={$generalForm.values.appName} 
        error={$generalForm.errors.appName}
        required
        onValueChange={(val) => handleInput('appName', val)}
    />
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <TextField 
        id="shortName"
        label="SHORT NAME" 
        placeholder="e.g. SMS" 
        value={$generalForm.values.shortName} 
        error={$generalForm.errors.shortName}
        required
        onValueChange={(val) => handleInput('shortName', val)}
    />
    <TextField 
        id="description"
        label="DESCRIPTION" 
        placeholder="Optional description" 
        value={$generalForm.values.description} 
        error={$generalForm.errors.description}
        onValueChange={(val) => handleInput('description', val)}
    />
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
     <div class="space-y-2">
         <FileUpload 
            files={$generalForm.values.logo} 
            previewUrl={$generalForm.values.logoUrl}
            onChange={(files) => handleInput('logo', files)}
            placeholder="Click to Upload Logo"
            accept="image/*" 
         />
     </div>
     <div class="space-y-2">
         <FileUpload 
            files={$generalForm.values.favicon} 
            previewUrl={$generalForm.values.faviconUrl}
            onChange={(files) => handleInput('favicon', files)}
            placeholder="Click to Upload Favicon"
            accept="image/*" 
         />
     </div>
  </div>
</div>
