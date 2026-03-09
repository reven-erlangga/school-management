<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
    class?: string;
  }

  let { 
    title, 
    subtitle = '', 
    class: className = '' 
  }: Props = $props();
</script>

<div class="space-y-4 {className}">
  <h2 class="text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
  {#if subtitle}
    <p class="text-slate-500 font-medium text-sm">{subtitle}</p>
  {/if}
</div>
