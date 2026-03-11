<script lang="ts">
  import Button from '../atoms/Button.svelte';
  import Icon from '../atoms/Icon.svelte';
  import LanguageSwitch from '../molecules/LanguageSwitch.svelte';
  import Theme from '@modules/theme/Index.svelte';
</script>

<nav class="fixed top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none">
  <Button
    href="/"
    variant="ghost"
    size="md"
    class="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-200 dark:hover:border-slate-700 transition-all hover:scale-105 shadow-lg shadow-slate-200/50 dark:shadow-black/20"
  >
    <Icon name="chevron-left" size="16" />
    <span class="text-xs font-bold uppercase tracking-wider">Back</span>
  </Button>

  <div class="pointer-events-auto flex items-center gap-3">
    <LanguageSwitch />
    <Theme />
  </div>
</nav>
