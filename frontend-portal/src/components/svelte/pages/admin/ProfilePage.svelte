<script lang="ts">
  import AdminTemplate from '../../templates/AdminTemplate.svelte';
  import Icon from '../../atoms/Icon.svelte';
  import { fade, fly } from 'svelte/transition';

  let user = {
    name: 'Super Admin',
    role: 'Administrator',
    email: 'admin@school.edu',
    phone: '+62 812 3456 7890',
    address: 'Jl. Pendidikan No. 123, Jakarta',
    joinDate: 'Jan 2024'
  };

  let activeTab = $state('personal');
</script>

<AdminTemplate title="My Profile" activePath="/admin/profile">
  <div class="py-8 space-y-10" in:fade={{ duration: 400 }}>
    <!-- Profile Header -->
    <div class="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
      <div class="h-32 bg-gradient-to-r from-indigo-500 to-violet-600 relative">
        <div class="absolute -bottom-12 left-10 flex items-end gap-6">
          <div class="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl">
            <div class="w-full h-full rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl font-black">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div class="pb-2">
            <h2 class="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{user.name}</h2>
            <p class="text-[13px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
          </div>
        </div>
      </div>
      <div class="h-16"></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Sidebar Info -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm space-y-8">
          <div class="space-y-6">
            <div class="flex flex-col gap-1.5">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
              <p class="text-[14px] font-bold text-slate-900">{user.email}</p>
            </div>
            <div class="flex flex-col gap-1.5">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</span>
              <p class="text-[14px] font-bold text-slate-900">{user.phone}</p>
            </div>
            <div class="flex flex-col gap-1.5">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Member Since</span>
              <p class="text-[14px] font-bold text-slate-900">{user.joinDate}</p>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-100 flex flex-col gap-3">
            <button class="w-full py-3.5 bg-indigo-600 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Icon name="check" size="16" />
              Edit Profile
            </button>
            <button class="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[13px] font-bold hover:bg-slate-50 transition-all active:scale-95">
              Change Password
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-8 space-y-8">
        <div class="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
          <div class="flex items-center gap-8 px-8 border-b border-slate-100">
            <button 
              onclick={() => activeTab = 'personal'}
              class="relative py-6 text-[14px] font-bold transition-all
                     {activeTab === 'personal' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}"
            >
              Personal Info
              {#if activeTab === 'personal'}
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" in:fade></div>
              {/if}
            </button>
            <button 
              onclick={() => activeTab = 'settings'}
              class="relative py-6 text-[14px] font-bold transition-all
                     {activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}"
            >
              Account Settings
              {#if activeTab === 'settings'}
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" in:fade></div>
              {/if}
            </button>
          </div>

          <div class="p-10">
            {#if activeTab === 'personal'}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-10" transition:fly={{ y: 10, duration: 400 }}>
                <div class="space-y-2">
                  <label class="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" value={user.name} readonly class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold text-slate-900 focus:outline-none" />
                </div>
                <div class="space-y-2">
                  <label class="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
                  <input type="text" value={user.role} readonly class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold text-slate-900 focus:outline-none" />
                </div>
                <div class="md:col-span-2 space-y-2">
                  <label class="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-1">Address</label>
                  <textarea readonly class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold text-slate-900 focus:outline-none h-32 resize-none">{user.address}</textarea>
                </div>
              </div>
            {:else}
              <div class="flex flex-col items-center justify-center py-20 text-center">
                <div class="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
                  <Icon name="grad" size="32" />
                </div>
                <h3 class="text-base font-bold text-slate-900">Settings Section</h3>
                <p class="text-[13px] text-slate-400 max-w-xs mt-1">Configure your account preferences and security settings here.</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</AdminTemplate>
