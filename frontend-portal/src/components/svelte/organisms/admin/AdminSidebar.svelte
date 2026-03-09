<script lang="ts">
  import { sidebarMenu, rbacUser } from '@store/rbac';
  import { branding, updateBranding } from '@store/branding';
  import { t } from '@utils/translation.util';
  import Icon from '../../atoms/Icon.svelte';
  import Button from '../../atoms/Button.svelte';
  import BottomSidebar from '../../molecules/BottomSidebar.svelte';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  interface Props {
    activePath?: string;
    isCollapsed?: boolean;
    onToggle?: (e: MouseEvent) => void;
  }

  let { 
    activePath = '/admin/dashboard', 
    isCollapsed = false, 
    onToggle = () => {} 
  }: Props = $props();

  onMount(async () => {
    await updateBranding();
  });

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    window.location.href = '/admin';
  };

  const bottomMenu = $derived($sidebarMenu.flatMap(group => {
    return group.modules.filter(module => {
      const isBottom = module.config?.sidebar?.position === 'bottom';
      return isBottom;
    });
  }));

  const mainMenu = $derived(
    $sidebarMenu
      .map(group => {
        const filteredModules = group.modules.filter(module => {
          const isBottom = module.config?.sidebar?.position === 'bottom';
          return !isBottom;
        });
        return { ...group, modules: filteredModules };
      })
      .filter(group => {
        const hasModules = group.modules.length > 0;
        return hasModules;
      })
  );
</script>

<aside class="{isCollapsed ? 'w-24' : 'w-72'} bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 flex flex-col fixed h-full z-50 transition-all duration-300">
  <!-- Logo Area -->
  <div class="p-8 pb-4 flex items-center justify-between gap-3 relative overflow-visible">
    <div class="flex items-center gap-3 min-w-0">
      {#if $branding.appIcon}
        <img src={$branding.appIcon} alt="Logo" class="w-9 h-9 rounded-lg shadow-sm object-cover shrink-0" />
      {:else}
        <div class="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
          <Icon name="grad" size="20" />
        </div>
      {/if}
      
      {#if !isCollapsed}
        <span class="font-bold text-lg tracking-tight text-slate-900 dark:text-white truncate" transition:fade>
          {#if ($branding.foundationName || '').trim().includes(' ')}
            {@const parts = ($branding.foundationName || '').trim().split(' ')}
            {parts[0]} <span class="text-indigo-500">{parts.slice(1).join(' ')}</span>
          {:else}
            {$branding.foundationName || 'AdminPanel'}
          {/if}
        </span>
      {/if}
    </div>

    <!-- Toggle Button (Moved slightly to be more visible and using higher z-index) -->
    <Button 
      onclick={onToggle}
      variant="outline"
      size="icon"
      class="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all absolute -right-4 top-10 z-[100] cursor-pointer"
    >
      <Icon name="chevron-right" size="14" class="transition-transform duration-300 {isCollapsed ? '' : 'rotate-180'}" />
    </Button>
  </div>

  <!-- Navigation -->
  <nav class="flex-grow px-4 py-6 space-y-7 overflow-y-auto custom-scrollbar">
    {#each mainMenu as group}
      <div in:fade={{ duration: 300 }} class="space-y-1">
        {#if !isCollapsed && group.name.toLowerCase() !== 'main'}
          <p class="text-[11px] font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-3 ml-4" transition:fade>
            {t(`sidebar.groups.${group.name.toLowerCase()}`, group.name)}
          </p>
        {/if}
        <div class="space-y-0.5">
          {#each group.modules as module}
            {@const path = `/admin/${module.slug}`}
            <a 
              href={path} 
              class="flex items-center {isCollapsed ? 'justify-center' : 'gap-3.5'} px-4 py-2.5 rounded-xl font-medium text-[14px] transition-all group
                     {activePath === path ? 'bg-indigo-50/60 dark:bg-indigo-500/20 text-indigo-600 border border-indigo-200 dark:border-indigo-500/30' : 'text-slate-600 dark:text-white/90 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-transparent'}"
              title={isCollapsed ? t(`sidebar.modules.${module.slug}`, module.name) : ''}
            >
              <Icon name={module.icon as any || 'grad'} size="18" class={activePath === path ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-300 group-hover:text-slate-600 dark:group-hover:text-white'} />
              {#if !isCollapsed}
                <span transition:fade>{t(`sidebar.modules.${module.slug}`, module.name)}</span>
              {/if}
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </nav>

  <!-- Bottom Section -->
  <BottomSidebar 
    {bottomMenu} 
    {activePath} 
    {isCollapsed} 
    onLogout={handleLogout} 
  />
</aside>

<style>
  /* Local styles for sidebar if needed, but using global slim scrollbar */
</style>
