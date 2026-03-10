<script lang="ts">
  import { fade } from 'svelte/transition';
  import Button from "@components/svelte/atoms/Button.svelte";
  import TextField from "@components/svelte/atoms/TextField.svelte";
  import { superuserForm } from '../stores/superuser-form.store';

  interface Props {
    onBack: () => void;
  }

  let { onBack }: Props = $props();

  const { handleInput, submit } = superuserForm;
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

  <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
    <Button variant="ghost" onclick={onBack}>Back</Button>
    <Button 
        variant="primary" 
        size="lg" 
        onclick={submit} 
        disabled={$superuserForm.meta.loading} 
        class="px-8"
    >
      {$superuserForm.meta.loading ? 'Saving...' : 'Finish Setup'}
    </Button>
  </div>
</div>
