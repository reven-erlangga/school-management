<script lang="ts">
  import Icon from '../atoms/Icon.svelte';
  import FloatingPanel from './FloatingPanel.svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: { name: string; role: string; avatar?: string; email?: string };
    triggerRect?: DOMRect | null;
  }

  let { isOpen, onClose, user, triggerRect = null }: Props = $props();

  const menuItems = [
    { id: 'profile', label: 'Lihat Profil', icon: 'user', path: '/admin/profile' },
    { id: 'settings', label: 'Pengaturan Akun', icon: 'community', path: '/admin/settings' },
    { id: 'password', label: 'Ganti Password', icon: 'check', path: '/admin/profile?tab=security' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    window.location.href = '/admin';
  };
</script>

<FloatingPanel {isOpen} {onClose} {triggerRect} width="w-72">
  <!-- Header Profil -->
  <div class="p-6 bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
    <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-slate-900 shadow-md mb-3">
      {#if user.avatar}
        <img src={user.avatar} alt={user.name} class="w-full h-full object-cover" />
      {:else}
        <img src="https://ui-avatars.com/api/?name={user.name}&background=6366f1&color=fff" alt={user.name} class="w-full h-full object-cover" />
      {/if}
    </div>
    <h4 class="text-[15px] font-black text-slate-900 dark:text-slate-100 leading-tight">{user.name}</h4>
    <p class="text-[12px] font-medium text-slate-400 mt-1 uppercase tracking-widest">{user.role}</p>
    <p class="text-[11px] font-medium text-indigo-500 mt-2">{user.email || 'admin@school.edu'}</p>
  </div>

  <!-- Menu List -->
  <div class="p-2">
    {#each menuItems as item}
      <a 
        href={item.path}
        class="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-all group no-underline"
        onclick={onClose}
      >
        <div class="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-indigo-600 shadow-sm transition-all border border-transparent group-hover:border-indigo-100 dark:group-hover:border-indigo-500/30">
          <Icon name={item.icon as any} size="18" />
        </div>
        <span class="text-[13px] font-bold">{item.label}</span>
      </a>
    {/each}
  </div>

  <!-- Footer Logout -->
  <div class="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900">
    <button 
      onclick={handleLogout}
      class="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-all group cursor-pointer border-none bg-transparent text-left"
    >
      <div class="w-9 h-9 rounded-xl bg-rose-50/50 dark:bg-slate-800 flex items-center justify-center text-rose-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-rose-600 shadow-sm transition-all border border-transparent group-hover:border-rose-100 dark:group-hover:border-rose-500/30">
        <Icon name="play" size="18" class="rotate-180" />
      </div>
      <span class="text-[13px] font-bold">Keluar Sesi</span>
    </button>
  </div>
</FloatingPanel>
