<script lang="ts">
  import { fade } from "svelte/transition";
  import TextField from "@components/svelte/atoms/TextField.svelte";
  import { onMount } from "svelte";
  import { serverForm } from "../../../stores/server-form.store";

  const { handleInput, loadData } = serverForm;

  onMount(() => {
    loadData();
  });
</script>

<div class="p-8 space-y-6" in:fade={{ duration: 300 }}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <TextField
      id="host"
      label="HOST"
      placeholder="e.g. smtp.gmail.com"
      value={$serverForm.values.host}
      error={$serverForm.errors["host"]}
      required
      onValueChange={(val) => handleInput("host", val)}
    />
    <TextField
      id="port"
      label="PORT"
      placeholder="e.g. 587"
      value={$serverForm.values.port}
      error={$serverForm.errors["port"]}
      required
      onValueChange={(val) => handleInput("port", val)}
    />
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <TextField
      id="username"
      label="USERNAME"
      placeholder="Enter SMTP username"
      value={$serverForm.values.username}
      error={$serverForm.errors["username"]}
      required
      onValueChange={(val) => handleInput("username", val)}
    />
    <TextField
      id="password"
      label="PASSWORD"
      placeholder="Enter SMTP password"
      type="password"
      value={$serverForm.values.password}
      error={$serverForm.errors["password"]}
      onValueChange={(val) => handleInput("password", val)}
    />
  </div>
  <TextField
    id="fromEmail"
    label="FROM EMAIL"
    placeholder="e.g. noreply@school.com"
    type="email"
    value={$serverForm.values.fromEmail}
    error={$serverForm.errors["fromEmail"]}
    required
    onValueChange={(val) => handleInput("fromEmail", val)}
  />
</div>
