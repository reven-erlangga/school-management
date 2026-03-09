<script lang="ts">
  import Button from '../atoms/Button.svelte';
  import { currentLang, availableLanguages, translationStore } from '@store/tolgee.store';
  import { fade } from 'svelte/transition';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  const toggleLanguage = async () => {
    const langs = get(availableLanguages);
    const current = get(currentLang);
    const currentIndex = langs.indexOf(current);
    const nextIndex = (currentIndex + 1) % langs.length;
    const nextLang = langs[nextIndex];
    
    await translationStore.setLanguage(nextLang);
  };
</script>

<Button 
  onclick={toggleLanguage}
  variant="ghost"
  size="icon"
  class="rounded-2xl border-none flex items-center justify-center relative group w-11 h-11 bg-indigo-50/30 hover:bg-indigo-50 transition-all duration-300 focus:outline-none"
  title="Toggle Language"
>
  <div class="flex items-center justify-center w-full h-full relative">
    {#if mounted}
      <div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }} class="absolute inset-0 flex items-center justify-center">
        <span class="fi fi-{$currentLang === 'en' ? 'gb' : $currentLang} text-[20px] shadow-sm rounded-sm"></span>
      </div>
    {/if}
  </div>
  
  {#if mounted}
    <span class="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase shadow-md border border-white/40 z-10">
      {$currentLang}
    </span>
  {/if}
</Button>

<style>
  :global(.fi) {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    display: inline-block;
    width: 1.33em;
    line-height: 1em;
  }
</style>
