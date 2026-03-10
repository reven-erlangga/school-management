<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    rounded?: string;
    bordered?: boolean;
    shadow?: boolean;
    header?: Snippet;
    footer?: Snippet;
    children: Snippet;
    title?: string;
    subtitle?: string;
    headerPadding?: string;
    contentPadding?: string;
    footerPadding?: string;
  }

  let {
    class: className = '',
    rounded = 'rounded-[32px]',
    bordered = true,
    shadow = true,
    header,
    footer,
    children,
    title = '',
    subtitle = '',
    headerPadding = 'px-8 py-6',
    contentPadding = 'px-8 py-6',
    footerPadding = 'px-8 py-6',
  }: Props = $props();
</script>

<div
  class="w-full bg-white dark:bg-slate-900/95 {rounded} {bordered ? 'border border-slate-200 dark:border-slate-800' : ''} {shadow ? 'shadow-2xl' : ''} overflow-hidden {className}"
>
  {#if header}
    <div class="{headerPadding}">
      {@render header()}
    </div>
  {:else if title || subtitle}
    <div class="{headerPadding} border-b border-slate-200 dark:border-slate-800">
      <div class="space-y-1">
        {#if title}
          <h3 class="text-lg font-extrabold text-slate-900 dark:text-slate-100">{title}</h3>
        {/if}
        {#if subtitle}
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">{subtitle}</p>
        {/if}
      </div>
    </div>
  {/if}

  <div class="{contentPadding}">
    {@render children()}
  </div>

  {#if footer}
    <div class="{footerPadding} border-t border-slate-100 dark:border-slate-800">
      {@render footer()}
    </div>
  {/if}
</div>
