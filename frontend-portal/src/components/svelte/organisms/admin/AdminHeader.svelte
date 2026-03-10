<script lang="ts">
  import Icon from '../../atoms/Icon.svelte';
  import Button from '../../atoms/Button.svelte';
  import NotificationDrawer from '../../molecules/NotificationDrawer.svelte';
  import GlobalSearchModal from '../../molecules/common/GlobalSearchModal.svelte';
  import QuickActionModal from '../../molecules/modal/QuickActionModal.svelte';
  import QuickActionPanel from '../../molecules/QuickActionPanel.svelte';
  import UserProfilePanel from '../../molecules/UserProfilePanel.svelte';
  import LanguageSwitch from '../../molecules/LanguageSwitch.svelte';
  import Theme from '@modules/theme/Index.svelte';
  import { onMount } from 'svelte';

  interface User {
    name: string;
    role: string;
    avatar?: string;
    email?: string;
  }

  interface Props {
    title?: string;
    user?: User;
    isCollapsed?: boolean;
    onToggleAudit?: () => void;
    showAuditTrigger?: boolean;
    theme?: 'light' | 'dark';
    onThemeChange?: (theme: 'light' | 'dark') => void;
  }

  let { 
    title = 'Admin Panel', 
    user = { name: 'Super Admin', role: 'Administrator' },
    isCollapsed = false,
    onToggleAudit = () => {},
    showAuditTrigger = false,
    theme = 'light',
    onThemeChange = () => {}
  }: Props = $props();

  let isNotificationDrawerOpen = $state(false);
  let isSearchModalOpen = $state(false);
  let isQuickActionPanelOpen = $state(false);
  let isQuickActionModalOpen = $state(false);
  let selectedAction = $state<string | null>(null);
  let isUserProfilePanelOpen = $state(false);
  let isMac = $state(false);

  let quickActionBtn = $state<HTMLButtonElement | null>(null);
  let userProfileBtn = $state<HTMLButtonElement | null>(null);

  let quickActionRect = $state<DOMRect | null>(null);
  let userProfileRect = $state<DOMRect | null>(null);

  const toggleNotifications = () => {
    isNotificationDrawerOpen = !isNotificationDrawerOpen;
  };

  const toggleSearch = () => {
    isSearchModalOpen = !isSearchModalOpen;
  };

  const toggleQuickAction = (e: MouseEvent) => {
    e.preventDefault();
    if (quickActionBtn) {
      quickActionRect = quickActionBtn.getBoundingClientRect();
    }
    isQuickActionPanelOpen = !isQuickActionPanelOpen;
  };

  const handleActionSelect = (id: string) => {
    selectedAction = id;
    isQuickActionModalOpen = true;
  };

  const toggleUserProfile = (e: MouseEvent) => {
    e.preventDefault();
    if (userProfileBtn) {
      userProfileRect = userProfileBtn.getBoundingClientRect();
    }
    isUserProfilePanelOpen = !isUserProfilePanelOpen;
  };

  $effect(() => {
    // Recalculate rects when collapsed state changes
    if (isCollapsed) {} // track dependency
    
    // We need a small timeout for the CSS transition
    setTimeout(() => {
      if (isQuickActionPanelOpen && quickActionBtn) {
        quickActionRect = quickActionBtn.getBoundingClientRect();
      }
      if (isUserProfilePanelOpen && userProfileBtn) {
        userProfileRect = userProfileBtn.getBoundingClientRect();
      }
    }, 300); // 300ms matches the transition duration
  });

  onMount(() => {
    isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    const updateRects = () => {
      if (isQuickActionPanelOpen && quickActionBtn) {
        quickActionRect = quickActionBtn.getBoundingClientRect();
      }
      if (isUserProfilePanelOpen && userProfileBtn) {
        userProfileRect = userProfileBtn.getBoundingClientRect();
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('resize', updateRects);
    
    // Also update when sidebar toggles (since header moves)
    const sidebarObserver = new MutationObserver(updateRects);
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      sidebarObserver.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('resize', updateRects);
      sidebarObserver.disconnect();
    };
  });
</script>

<header class="h-24 bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/40 flex items-center justify-between px-8 fixed top-0 right-0 {isCollapsed ? 'left-24' : 'left-72'} z-20 backdrop-blur-xl gap-8 transition-all duration-300">
  <!-- Left: Title & Breadcrumb Stacked -->
  <div class="flex flex-col justify-center shrink-0">
    <h1 class="text-[18px] font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-1">{title}</h1>
    <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 leading-none uppercase tracking-widest">{title}</p>
  </div>

  <!-- Center: Search -->
  <div class="flex-grow max-w-xl flex justify-center">
    <Button 
      onclick={toggleSearch}
      variant="outline"
      class="flex items-center gap-3 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-all group cursor-pointer w-full max-w-md h-11 shadow-sm"
    >
      <Icon name="community" size="18" class="text-slate-400 group-hover:text-indigo-600 transition-colors" />
      <span class="text-[13px] font-bold text-slate-500 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors flex-grow text-left">Quick Search...</span>
      <div class="flex items-center gap-1.5 ml-4 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-[10px] font-black text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/30 transition-all shadow-sm">
        <span>{isMac ? '⌘' : 'Ctrl'}</span>
        <span>K</span>
      </div>
    </Button>
  </div>

  <!-- Right: Quick Actions, Notifications, Profile -->
  <div class="flex items-center gap-4 shrink-0">
    <div class="flex items-center gap-2 pr-4 border-r border-slate-200/60 dark:border-slate-700/60">
      <!-- Quick Action Button -->
      <Button 
        bind:ref={quickActionBtn}
        onclick={toggleQuickAction}
        variant="secondary"
        size="icon"
        class="rounded-2xl shadow-lg shadow-indigo-600/20 dark:shadow-none group"
        title="Quick Action"
      >
        <Icon name="settings" size="20" class="transition-transform group-hover:rotate-45" />
      </Button>

      <!-- Language Switch -->
      <LanguageSwitch />

      <!-- Theme Switch -->
      <Theme />

      <!-- Notifications -->
      <Button 
        onclick={toggleNotifications}
        variant="ghost"
        size="icon"
        class="rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
      >
        <Icon name="bell" size="20" class="text-slate-600 dark:text-slate-200" />
      </Button>
    </div>

    <!-- User Profile -->
    <Button 
      bind:ref={userProfileBtn}
      onclick={toggleUserProfile}
      variant="ghost"
      class="flex items-center gap-3 group cursor-pointer no-underline bg-transparent border-none outline-none h-auto p-0"
    >
      <div class="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-900 shadow-md transition-transform group-hover:scale-105">
        {#if user.avatar}
          <img src={user.avatar} alt={user.name} class="w-full h-full object-cover" />
        {:else}
          <img src="https://ui-avatars.com/api/?name={user.name}&background=6366f1&color=fff" alt={user.name} class="w-full h-full object-cover" />
        {/if}
      </div>
      <div class="flex items-center gap-4">
        <div class="flex flex-col items-start">
          <p class="text-[14px] font-black text-slate-900 dark:text-slate-100 leading-tight group-hover:text-indigo-600 transition-colors">{user.name.split(' ')[0]}</p>
          <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 leading-tight uppercase tracking-widest">{user.role}</p>
        </div>
        <Icon name="chevron-right" size="14" class="rotate-90 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors {isUserProfilePanelOpen ? 'rotate-[-90deg]' : ''}" />
      </div>
    </Button>
  </div>
</header>

<NotificationDrawer 
  isOpen={isNotificationDrawerOpen} 
  onClose={() => isNotificationDrawerOpen = false} 
/>

<GlobalSearchModal 
  isOpen={isSearchModalOpen} 
  onClose={() => isSearchModalOpen = false} 
/>

<QuickActionPanel 
  isOpen={isQuickActionPanelOpen}
  onClose={() => isQuickActionPanelOpen = false}
  onActionSelect={handleActionSelect}
  triggerRect={quickActionRect}
/>

<QuickActionModal 
  isOpen={isQuickActionModalOpen}
  onClose={() => isQuickActionModalOpen = false}
  selectedAction={selectedAction}
/>

<UserProfilePanel 
  isOpen={isUserProfilePanelOpen}
  onClose={() => isUserProfilePanelOpen = false}
  {user}
  triggerRect={userProfileRect}
/>
