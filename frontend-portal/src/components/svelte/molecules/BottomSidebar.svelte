<script lang="ts">
  import Icon from '../atoms/Icon.svelte';
  import Button from '../atoms/Button.svelte';
  import { fade } from 'svelte/transition';
  import { t } from '@utils/translation.util';
  import type { Module } from '../../../types/rbac';

  interface Props {
    bottomMenu: Module[];
    activePath: string;
    isCollapsed: boolean;
    onLogout: () => void;
  }

  let { 
    bottomMenu = [], 
    activePath = '', 
    isCollapsed = false, 
    onLogout 
  }: Props = $props();
</script>

<!-- Bottom Menu -->
<div class="px-4 pb-4 pt-6 flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
  {#if bottomMenu.length > 0}
    <div class="space-y-0.5 mb-2">
      {#each bottomMenu as module}
        {@const path = `/admin/${module.slug}`}
        <a 
          href={path} 
          class="flex items-center {isCollapsed ? 'justify-center' : 'gap-3.5'} px-4 py-2.5 rounded-xl font-medium text-[14px] transition-all group
                 {activePath === path ? 'bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 shadow-sm shadow-indigo-100/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}"
          title={isCollapsed ? t(`sidebar.modules.${module.slug}`, module.name) : ''}
        >
          <Icon name={module.icon as any || 'grad'} size="18" class={activePath === path ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-200'} />
          {#if !isCollapsed}
            <span transition:fade>{t(`sidebar.modules.${module.slug}`, module.name)}</span>
          {/if}
        </a>
      {/each}
    </div>
  {/if}

  <!-- Logout Area -->
  <div class="pt-0">
    <Button 
      onclick={onLogout}
      variant="danger"
      class="w-full gap-3 py-3 !rounded-xl"
      title={isCollapsed ? t('common.logout', 'Logout') : ''}
    >
      <Icon name="logout" size="18" rotate={180} class="transition-colors" />
      {#if !isCollapsed}
        <span transition:fade>{t('common.logout', 'Logout')}</span>
      {/if}
    </Button>
  </div>
</div>
