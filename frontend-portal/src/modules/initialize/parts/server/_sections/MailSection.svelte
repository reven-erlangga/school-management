<script lang="ts">
  import TextField from '../../../../../components/svelte/atoms/TextField.svelte';
  import { serverForm } from '../../../stores/server-form.store';

  const { handleInput } = serverForm;
</script>

<div class="space-y-4">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <TextField 
        id="mailServer.host"
        label="HOST" 
        placeholder="e.g. smtp.gmail.com" 
        value={$serverForm.values.mailServer.host} 
        error={$serverForm.errors['mailServer.host']}
        required
        onValueChange={(val) => handleInput('mailServer.host', val)}
    />
    <TextField 
        id="mailServer.port"
        label="PORT" 
        placeholder="e.g. 587" 
        value={$serverForm.values.mailServer.port} 
        error={$serverForm.errors['mailServer.port']}
        required
        onValueChange={(val) => handleInput('mailServer.port', val)}
    />
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <TextField 
        id="mailServer.username"
        label="USERNAME" 
        placeholder="Enter SMTP username" 
        value={$serverForm.values.mailServer.username} 
        error={$serverForm.errors['mailServer.username']}
        required
        onValueChange={(val) => handleInput('mailServer.username', val)}
    />
    <TextField 
        id="mailServer.password"
        label="PASSWORD" 
        placeholder="Enter SMTP password" 
        value={$serverForm.values.mailServer.password} 
        error={$serverForm.errors['mailServer.password']}
        onValueChange={(val) => handleInput('mailServer.password', val)}
    />
  </div>
  <TextField 
    id="mailServer.fromEmail"
    label="FROM EMAIL" 
    placeholder="e.g. noreply@school.com" 
    value={$serverForm.values.mailServer.fromEmail} 
    error={$serverForm.errors['mailServer.fromEmail']}
    required
    onValueChange={(val) => handleInput('mailServer.fromEmail', val)}
  />
</div>
