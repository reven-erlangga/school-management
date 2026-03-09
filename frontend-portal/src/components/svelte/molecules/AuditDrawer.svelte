<script lang="ts">
  import Icon from '../atoms/Icon.svelte';
  import { fade, fly } from 'svelte/transition';

  interface Props {
    isOpen: boolean;
    onToggle: () => void;
  }

  let { isOpen, onToggle }: Props = $props();

  const auditLogs = [
    { time: '12 Sept, 07.50 WIB', activity: 'Export Student List', session: 'Enrollment Module' },
    { time: '12 Sept, 07.50 WIB', activity: 'Reset Password (Siti N.)', session: 'User Management' },
    { time: '12 Sept, 07.50 WIB', activity: 'Changed Role: Staff→Admin', session: 'Permissions' },
    { time: '12 Sept, 07.50 WIB', activity: 'Export Finance Report', session: 'Finance Module' },
    { time: '12 Sept, 07.50 WIB', activity: 'Deleted User (Guest)', session: 'User Management' },
    { time: '12 Sept, 07.50 WIB', activity: 'Reset Password (Dewi A.)', session: 'User Management' },
    { time: '12 Sept, 07.50 WIB', activity: 'Export Attendance Log', session: 'Attendance Module' },
    { time: '12 Sept, 07.50 WIB', activity: 'Changed Role: Teacher→Head', session: 'Permissions' },
    { time: '12 Sept, 07.50 WIB', activity: 'Export Grades Report', session: 'Academics' },
    { time: '12 Sept, 07.50 WIB', activity: 'Export Document List', session: 'Documents' },
  ];
</script>

<!-- Backdrop (Only when open) -->
{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[300]"
    transition:fade={{ duration: 200 }}
    onclick={onToggle}
  ></div>
{/if}

<!-- Drawer & Trigger Container -->
<div 
  class="fixed inset-y-0 right-0 {isOpen ? 'z-[310]' : 'z-[90]'} flex items-center transition-transform duration-400 ease-out"
  style="transform: translateX({isOpen ? '0' : '100%'}); width: min(56rem, 100vw);"
>
  <!-- Trigger Button (Stuck to the left edge of the drawer) -->
  <button 
    onclick={onToggle}
    class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-indigo-600 text-white px-3 py-6 rounded-l-3xl shadow-2xl hover:bg-indigo-700 transition-all cursor-pointer group flex items-center justify-center"
    title={isOpen ? 'Close Audit Drawer' : 'Open Audit Drawer'}
  >
    <Icon name={isOpen ? 'chevron-right' : 'chevron-left'} size="24" class="group-hover:scale-110 transition-transform" />
  </button>

  <!-- Drawer Panel Content -->
  <div class="w-full h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-700">
    <!-- Header -->
    <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0">
      <div>
        <h3 class="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Audit Drawer</h3>
        <p class="text-[13px] font-medium text-slate-400 dark:text-slate-400 mt-1">Track and monitor all system activities and logs.</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex gap-2">
          <button class="w-10 h-10 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center" title="Export">
            <Icon name="arrow-right" size="18" class="rotate-90" />
          </button>
          <button class="w-10 h-10 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center" title="Role Permission">
            <Icon name="user" size="18" />
          </button>
          <button class="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all flex items-center justify-center" title="Delete">
            <Icon name="close" size="18" />
          </button>
        </div>

        <div class="relative hidden lg:block ml-2">
          <Icon name="community" size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search here" 
            class="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
          />
        </div>

        <div class="w-px h-8 bg-slate-100 dark:bg-slate-800 mx-2"></div>

        <button onclick={onToggle} class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <Icon name="close" size="24" />
        </button>
      </div>
    </div>

    <!-- Content Table -->
    <div class="flex-grow overflow-auto p-0">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 sticky top-0">
            <th class="w-12 px-6 py-4"><input type="checkbox" class="rounded border-slate-300 dark:border-slate-600" /></th>
            <th class="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest">Time log</th>
            <th class="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest">Activity log</th>
            <th class="px-6 py-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest">Session</th>
            <th class="w-16 px-6 py-4 text-right"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
          {#each auditLogs as log}
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/60 transition-colors group">
              <td class="px-6 py-4"><input type="checkbox" class="rounded border-slate-300 dark:border-slate-600" /></td>
              <td class="px-6 py-4 text-[13px] font-medium text-slate-500 dark:text-slate-300">{log.time}</td>
              <td class="px-6 py-4 text-[13px] font-bold text-slate-900 dark:text-slate-100">{log.activity}</td>
              <td class="px-6 py-4 text-[13px] font-medium text-slate-400 dark:text-slate-400">{log.session}</td>
              <td class="px-6 py-4 text-right">
                <button class="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all">
                  <Icon name="close" size="18" />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Footer / Pagination -->
    <div class="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <select class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-200 outline-none">
          <option>20</option>
          <option>50</option>
          <option>100</option>
        </select>
        <span class="text-[13px] font-medium text-slate-500 dark:text-slate-300">Show 20 from 3290 data</span>
      </div>
      <div class="flex items-center gap-1">
        <button class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100">1</button>
        <button class="px-3 py-1.5 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-bold transition-all">2</button>
        <button class="px-3 py-1.5 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-bold transition-all">3</button>
        <span class="px-2 text-slate-300 font-bold">...</span>
        <button class="px-3 py-1.5 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-bold transition-all">329</button>
        <button class="px-3 py-1.5 text-slate-400 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all ml-1">
          <Icon name="arrow-right" size="16" />
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  /* Using global slim scrollbar */
</style>
