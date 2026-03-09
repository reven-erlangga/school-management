<script lang="ts">
  import { fade } from 'svelte/transition';
  import Icon from "./Icon.svelte";

  interface Props {
    id?: string;
    label?: string;
    value?: string;
    placeholder?: string;
    type?: string;
    icon?: string;
    class?: string;
    name?: string;
    error?: string;
    required?: boolean;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
    onValueChange?: (value: string, name?: string) => void;
  }

  let {
    id = "",
    label = "",
    value = $bindable(""),
    placeholder = "",
    type = "text",
    icon = "",
    class: className = "",
    name = "",
    error = "",
    required = false,
    oninput,
    onchange,
    onValueChange,
  }: Props = $props();

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    value = target.value;
    if (oninput) oninput(e);
    if (onValueChange) onValueChange(target.value, name);
  };
</script>

<div class="flex flex-col w-full {className}">
  {#if label}
    <label
      for={id}
      class="text-xs text-slate-400 dark:text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2.5"
    >
      {label} {#if required}<span class="text-rose-500">*</span>{/if}
    </label>
  {/if}
  <div class="relative flex-grow w-full group">
    {#if icon}
      <div
        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-400 group-focus-within:text-indigo-600 transition-colors"
      >
        <Icon name={icon as any} size="18" />
      </div>
    {/if}
    <input
      {id}
      {type}
      {placeholder}
      bind:value
      oninput={handleInput}
      {onchange}
      class="block w-full {icon
        ? 'pl-12'
        : 'px-4'} pr-4 py-3.5 bg-white dark:bg-slate-900 border {error ? 'border-rose-500/50' : 'border-slate-200/60 dark:border-slate-700/60'} text-slate-700 dark:text-slate-200 text-[14px] font-medium rounded-2xl focus:outline-none focus:ring-4 {error ? 'focus:ring-rose-500/5 focus:border-rose-500/50' : 'focus:ring-indigo-500/5 focus:border-indigo-500/50'} transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500"
    />
  </div>
  {#if error}
    <p class="text-[11px] font-bold text-rose-500 pl-1 mt-1" in:fade>{error}</p>
  {/if}
</div>
