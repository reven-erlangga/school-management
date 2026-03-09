<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href: string;
    active?: boolean;
    children: Snippet;
    class?: string;
  }

  let { href, active = false, children, class: className = '' }: Props = $props();
</script>

<a 
  {href} 
  class="relative px-2 py-1 text-sm font-bold tracking-tight transition-colors duration-300 group
         {active ? 'text-[#1E293B]' : 'text-[#64748B] hover:text-[#1E293B]'} {className}"
>
  {@render children()}
  <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4338CA] transition-all duration-300 
               {active ? 'w-full' : 'group-hover:w-full'}"></span>
</a>
