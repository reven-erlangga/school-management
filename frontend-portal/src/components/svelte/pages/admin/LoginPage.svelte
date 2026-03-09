<script lang="ts">
  import LoginVisual from "../../organisms/landing/LoginVisual.svelte";
  import LoginForm from "../../../../modules/form/LoginForm.svelte";
</script>

<div class="min-h-screen bg-white flex overflow-hidden font-inter">
  <div class="hidden lg:block lg:w-1/2 relative">
    <LoginVisual />
  </div>
  <div class="w-full lg:w-1/2 flex items-center justify-center">
    <LoginForm />
  </div>
</div>
