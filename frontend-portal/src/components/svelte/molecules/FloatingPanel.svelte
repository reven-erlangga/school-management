<script lang="ts">
  import { fly } from 'svelte/transition';
  import { onMount, type Snippet } from 'svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    triggerRect: DOMRect | null;
    width?: string;
    children: Snippet;
    class?: string;
  }

  let { 
    isOpen, 
    onClose, 
    triggerRect, 
    width = 'w-64', 
    children,
    class: className = '' 
  }: Props = $props();

  let container = $state<HTMLDivElement | null>(null);

  // Calculate dynamic position (centered to trigger)
  let panelStyle = $derived.by(() => {
    if (!triggerRect) return 'display: none;';
    
    const gap = 12;
    const top = triggerRect.bottom + gap;
    
    // Calculate horizontal center
    // We need to wait for container to be rendered to get its width, 
    // but we can estimate or use CSS transform for centering.
    // Better approach: calculate left based on trigger center
    const triggerCenter = triggerRect.left + (triggerRect.width / 2);
    
    // We'll use transform: translateX(-50%) in CSS for perfect centering,
    // so we just need to provide the center point as 'left'.
    return `top: ${top}px; left: ${triggerCenter}px; transform: translateX(-50%);`;
  });

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && container && !container.contains(event.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  });
</script>

{#if isOpen}
  <div 
    bind:this={container}
    style={panelStyle}
    class="fixed {width} bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 z-[100] overflow-hidden {className}"
    transition:fly={{ y: 10, duration: 300 }}
  >
    {@render children()}
  </div>
{/if}
