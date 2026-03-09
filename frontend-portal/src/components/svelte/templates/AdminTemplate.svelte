<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import AdminSidebar from '../organisms/admin/AdminSidebar.svelte';
  import AdminHeader from '../organisms/admin/AdminHeader.svelte';
  import AdminTabs from '../molecules/common/AdminTabs.svelte';
  import QuickAnnouncement from '../molecules/QuickAnnouncement.svelte';
  import AuditDrawer from '../molecules/AuditDrawer.svelte';
  import { rbacUser, availableModules } from '@store/rbac';
  import { refreshAccessToken, logout } from '@store/auth';
  import { initTranslations } from '@utils/translation.util';
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    activePath?: string;
    tabs?: any[];
    activeTab?: string;
    onTabChange?: (id: string) => void;
    children: Snippet;
  }

  let { 
    title, 
    activePath,
    tabs = [],
    activeTab = '',
    onTabChange = () => {},
    children 
  }: Props = $props();

  let visible = $state(false);
  let isCollapsed = $state(false);
  let isAuditDrawerOpen = $state(false);
  let adminTheme = $state<'light' | 'dark'>('light');

  const setAdminTheme = (theme: 'light' | 'dark') => {
    adminTheme = theme;
    localStorage.setItem('admin_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Computed properties based on accessible modules
  const fabModules = $derived($availableModules.filter(m => m.page === 'fab'));
  const sideModules = $derived($availableModules.filter(m => m.page === 'side'));

  const hasFabAccess = $derived(fabModules.some(m => m.slug === 'quick-announcement'));
  const hasAuditAccess = $derived(sideModules.some(m => m.slug === 'audit-logs'));

  const toggleSidebar = () => {
    isCollapsed = !isCollapsed;
  };

  const toggleAuditDrawer = () => {
    isAuditDrawerOpen = !isAuditDrawerOpen;
  };

  import { get } from 'svelte/store';

  /**
   * Initialize RBAC and Auth
   */
  const initializeAuth = async () => {
    const currentModules = get(availableModules);
    const currentUser = get(rbacUser);

    // If already initialized, don't re-fetch everything unless explicitly needed
    if (currentModules.length > 0 && currentUser) {
      console.log('[Auth] Already initialized, skipping full fetch');
      // Still ensure translations are initialized (it will skip if already loaded)
      await initTranslations('id');
      visible = true;
      return;
    }
    const savedUser = localStorage.getItem('admin_user');
    const accessToken = localStorage.getItem('access_token');

    console.log('[Auth] Initializing...', { hasUser: !!savedUser, hasToken: !!accessToken });

    if (!savedUser || !accessToken) {
      console.warn('[Auth] No session found, redirecting to login');
      if (window.location.pathname !== '/admin') {
        window.location.href = '/admin';
      }
      return;
    }

    const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

    try {
      // 1. Verify and potentially refresh token
      console.log('[Auth] Verifying token with backend...');
      const verifyRes = await fetch(`${apiUrl}/auth/verify`, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!verifyRes.ok) {
        console.warn(`[Auth] Access token verify failed (status: ${verifyRes.status})`);
        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
          console.error('[Auth] Refresh failed or returned no token, logging out');
          logout();
          if (window.location.pathname !== '/admin') {
            window.location.href = '/admin';
          }
          return;
        }
        console.log('[Auth] Token refreshed successfully');
      } else {
        const payload = await verifyRes.json();
        console.log('[Auth] Token verified successfully', payload);
      }

      // 2. Fetch available modules
      console.log('[Auth] Fetching modules...');
      const modulesRes = await fetch(`${apiUrl}/rbac/modules`);
      if (!modulesRes.ok) {
        const errorText = await modulesRes.text();
        throw new Error(`Failed to fetch modules: ${modulesRes.status} ${errorText}`);
      }
      
      const modulesData = await modulesRes.json();
      console.log('[Auth] Modules fetched:', modulesData.length);
      
      if (modulesData && modulesData.length > 0) {
        availableModules.set(modulesData.map((m: any) => ({
          id: m.id,
          name: m.name,
          slug: m.slug,
          group: m.group,
          path: `/admin/${m.slug}`,
          icon: m.icon,
          page: m.page || 'default',
          permissions: m.permissions.map((p: any) => p.slug),
          meta: m.meta,
          config: m.config,
          forms: m.forms,
          endpoints: m.endpoints,
          subModules: m.subModules ? m.subModules.map((sm: any) => ({
            id: sm.id,
            name: sm.name,
            slug: sm.slug,
            icon: sm.icon,
            page: sm.page || 'default',
            meta: sm.meta,
            forms: sm.forms,
            endpoints: sm.endpoints,
            permissions: sm.permissions.map((p: any) => p.slug)
          })) : []
        })));
      }

      // 3. Set RBAC User
      const userData = JSON.parse(savedUser);
      rbacUser.set({
        ...userData,
        permissions: userData.permissions || [],
        roles: userData.roles || []
      });

      // 4. Initialize Translations (default to 'id' or user preference)
      await initTranslations('id');

      try {
        const [ovRes, tolRes, mailRes] = await Promise.all([
          fetch(`${apiUrl}/settings/overview`),
          fetch(`${apiUrl}/settings/tolgee`),
          fetch(`${apiUrl}/settings/mail-server`),
        ]);

        const ov = ovRes.ok ? await ovRes.json() : {};
        const tol = tolRes.ok ? await tolRes.json() : {};
        const mail = mailRes.ok ? await mailRes.json() : {};

        const missingOverview = !ov.foundation_name || !ov.app_name || !ov.short_name;
        const missingTolgee = !tol.api_url || !tol.api_key || tol.api_key === '****';
        const missingMail = !mail.host || !mail.port || !mail.username || !mail.from_email;

        if ((missingOverview || missingTolgee || missingMail) && !location.pathname.includes('/setup')) {
          location.href = '/setup';
          return;
        }
      } catch {}

      visible = true;
      console.log('[Auth] Initialization complete');
    } catch (error) {
      console.error('[Auth] Critical error during initialization:', error);
      // Don't logout/redirect immediately on connection errors to avoid loop
      // but if it's a 401/403, we should
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
        logout();
        if (window.location.pathname !== '/admin') {
          window.location.href = '/admin';
        }
      }
    }
  };

  onMount(() => {
    const storedTheme = localStorage.getItem('admin_theme') as 'light' | 'dark' | null;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      adminTheme = storedTheme;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      adminTheme = 'dark';
    }
    localStorage.setItem('admin_theme', adminTheme);
    if (adminTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    initializeAuth();
    
    // Set up periodic token refresh (every 45 minutes for a 1h token)
    const refreshInterval = setInterval(refreshAccessToken, 45 * 60 * 1000);
    return () => {
      clearInterval(refreshInterval);
      // Clean up class on unmount to avoid leaking dark mode to public pages
      document.documentElement.classList.remove('dark');
    };
  });
</script>

{#if visible}
<div class="h-screen overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-500/30 dark:selection:text-indigo-100 font-inter flex" class:dark={adminTheme === 'dark'}>
  <AdminSidebar {activePath} {isCollapsed} onToggle={toggleSidebar} />
  
  <div class="flex-grow flex flex-col h-screen transition-all duration-300 {isCollapsed ? 'ml-24' : 'ml-72'} overflow-hidden relative">
    <AdminHeader {title} {isCollapsed} onToggleAudit={toggleAuditDrawer} showAuditTrigger={hasAuditAccess} theme={adminTheme} onThemeChange={setAdminTheme} />
    
    <!-- Main Content Area with Scroll -->
    <div class="flex-grow overflow-y-auto pt-24 custom-scrollbar flex flex-col">
      {#if tabs.length > 0}
        <AdminTabs {tabs} {activeTab} {onTabChange} />
        <main class="px-12 pb-12 flex-grow pt-4" in:fade={{ duration: 400 }}>
          {@render children()}
        </main>
      {:else}
        <main class="px-12 pb-12 flex-grow pt-8" in:fade={{ duration: 400 }}>
          {@render children()}
        </main>
      {/if}

      <QuickAnnouncement />
    </div>

    <AuditDrawer 
      isOpen={isAuditDrawerOpen}
      onToggle={toggleAuditDrawer}
    />
  </div>
</div>
{/if}

<style global>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  :root {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  body {
    background-color: #F8FAFC;
    color: #1E293B;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden; /* Prevent global browser scroll */
  }
</style>
