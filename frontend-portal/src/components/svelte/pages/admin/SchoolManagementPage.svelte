<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { logout } from '../../../../store/auth';
  import { schoolsData } from '../../../../consts';
  import Button from '../../atoms/Button.svelte';
  import Icon from '../../atoms/Icon.svelte';
  import type { School } from '../../../../types';

  let schools = $state<School[]>([...schoolsData]);
  let visible = $state(false);

  onMount(() => {
    const savedUser = localStorage.getItem('admin_user');
    if (!savedUser) {
      window.location.href = '/admin';
    } else {
      visible = true;
    }
  });

  const handleLogout = () => {
    logout();
    window.location.href = '/admin';
  };
</script>

{#if visible}
<div class="min-h-screen bg-[#F8FAFC] flex">
  <!-- Sidebar (Same as Dashboard) -->
  <aside class="w-72 bg-[#1E1B4B] text-white flex flex-col fixed h-full z-20 shadow-2xl">
    <div class="p-8 flex items-center gap-3 border-b border-white/5">
      <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
        <Icon name="grad" size="24" />
      </div>
      <span class="font-black text-xl tracking-tight">Lumina<span class="text-indigo-400">.edu</span></span>
    </div>

    <nav class="flex-grow p-6 space-y-2">
      <a href="/admin/dashboard" class="flex items-center gap-4 px-5 py-4 text-indigo-200/60 hover:bg-white/5 hover:text-white rounded-2xl font-bold transition-all">
        <Icon name="community" size="20" />
        Dashboard
      </a>
      <a href="/admin/schools" class="flex items-center gap-4 px-5 py-4 bg-white/10 rounded-2xl text-white font-bold transition-all">
        <Icon name="grad" size="20" />
        Manage Schools
      </a>
    </nav>

    <div class="p-6 border-t border-white/5">
      <button onclick={handleLogout} class="flex items-center gap-4 px-5 py-4 w-full text-red-400 hover:bg-red-500/10 rounded-2xl font-bold transition-all">
        <Icon name="play" size="20" class="rotate-180" />
        Sign Out
      </button>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-grow ml-72 p-12">
    <header class="flex justify-between items-center mb-12">
      <div>
        <h1 class="text-2xl font-black text-[#1E1B4B] tracking-tight">Manage Schools</h1>
        <p class="text-[#64748B] font-medium mt-1">Add, edit or remove schools from the Lumina network.</p>
      </div>
      <Button variant="dark" size="md" class="gap-2 shadow-xl shadow-indigo-900/10">
        <Icon name="excellence" size="20" />
        Add New School
      </Button>
    </header>

    <div class="bg-white rounded-[40px] shadow-sm border border-[#F1F5F9] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-[#F8FAFC] text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest border-b border-[#F1F5F9]">
              <th class="px-8 py-6">School Information</th>
              <th class="px-8 py-6">Location</th>
              <th class="px-8 py-6">Students</th>
              <th class="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#F1F5F9]">
            {#each schools as school, i}
              <tr 
                class="hover:bg-[#F8FAFC] transition-colors group"
                in:fly={{ y: 20, duration: 800, delay: i * 100 }}
              >
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-[#EEF2FF] overflow-hidden shadow-sm">
                      <img src={school.image} alt="" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p class="font-bold text-[#1E293B]">{school.name}</p>
                      <p class="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">ID: {school.id}</p>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <p class="text-sm font-medium text-[#64748B]">{school.address}</p>
                </td>
                <td class="px-8 py-6">
                  <span class="px-3 py-1.5 bg-indigo-50 text-[#4338CA] text-xs font-bold rounded-full border border-indigo-100">
                    {school.studentCount} Students
                  </span>
                </td>
                <td class="px-8 py-6 text-right">
                  <div class="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="p-2 text-[#4338CA] hover:bg-indigo-50 rounded-xl transition-colors" title="Edit">
                      <Icon name="community" size="20" />
                    </button>
                    <button class="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Delete">
                      <Icon name="play" size="20" class="rotate-90" />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>
{/if}
