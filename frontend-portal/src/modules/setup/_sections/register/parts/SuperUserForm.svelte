<script lang="ts">
  import { fade } from 'svelte/transition';
  import TextField from "@components/svelte/atoms/TextField.svelte";
  import { superuserForm } from "../stores/superuser-form.store";

  const { handleInput } = superuserForm;
</script>

<div class="p-8 space-y-6" in:fade={{ duration: 300 }}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <TextField 
        id="name"
        label="NAME" 
        placeholder="Super Admin" 
        value={$superuserForm.values.name} 
        error={$superuserForm.errors.name}
        onValueChange={(val) => handleInput('name', val)}
    />
    <TextField 
        id="email"
        label="EMAIL" 
        placeholder="admin@domain.com" 
        value={$superuserForm.values.email} 
        error={$superuserForm.errors.email}
        onValueChange={(val) => handleInput('email', val)}
    />
    <TextField 
        id="password"
        label="PASSWORD" 
        placeholder="Use a strong password" 
        value={$superuserForm.values.password} 
        error={$superuserForm.errors.password}
        onValueChange={(val) => handleInput('password', val)}
    />
  </div>
</div>

