<script lang="ts">
  import Icon from '../../atoms/Icon.svelte';

  interface Props {
    icon: 'community' | 'excellence' | 'grad' | 'check';
    title: string;
    subtitle: string;
    class?: string;
  }

  let { icon, title, subtitle, class: className = '' }: Props = $props();
</script>

<div class="inline-flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl shadow-indigo-500/10 border border-white/50 transition-all duration-500 hover:scale-105 {className}">
  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4338CA]">
    <Icon name={icon} size="28" />
  </div>
  <div>
    <p class="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] leading-tight mb-0.5">{title}</p>
    <p class="text-sm font-bold text-[#1E293B] leading-tight">{subtitle}</p>
  </div>
</div>
