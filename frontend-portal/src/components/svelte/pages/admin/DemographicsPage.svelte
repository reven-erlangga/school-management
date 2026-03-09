<script lang="ts">
  import AdminTemplate from '../../templates/AdminTemplate.svelte';
  import Icon from '../../atoms/Icon.svelte';
  import { fade, fly } from 'svelte/transition';

  const tabs = [
    { id: 'gender', label: 'Gender' },
    { id: 'ethnicity', label: 'Ethnicity' },
    { id: 'religion', label: 'Religion' }
  ];

  let activeTab = $state('gender');
  let searchQuery = $state('');

  const handleTabChange = (id: string) => {
    activeTab = id;
  };
</script>

<AdminTemplate 
  title="Demographics" 
  activePath="/admin/demographics"
  {tabs}
  {activeTab}
  onTabChange={handleTabChange}
>
  <div class="py-12 space-y-8" in:fade={{ duration: 400 }}>
    <div class="flex flex-col gap-2">
      <h2 class="text-2xl font-black text-slate-800 tracking-tight">Demographics</h2>
      <p class="text-sm font-medium text-slate-500">Manage demographic categories and classifications.</p>
    </div>

    <div class="flex justify-between items-center gap-4">
      <!-- Search -->
      <div class="relative flex-grow max-w-md group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Icon name="community" size="18" />
        </div>
        <input 
          type="text" 
          bind:value={searchQuery}
          placeholder="Search {activeTab}..." 
          class="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
        />
      </div>

      <!-- Add New Button -->
      <button class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:scale-95">
        <Icon name="excellence" size="18" />
        Add New
      </button>
    </div>

    <!-- Data Table Container -->
    <div class="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
            <th class="px-8 py-6">Name</th>
            <th class="px-8 py-6">Code</th>
            <th class="px-8 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Empty State Placeholder -->
          <tr>
            <td colspan="3" class="px-8 py-24 text-center">
              <div class="flex flex-col items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                  <Icon name="community" size="32" />
                </div>
                <p class="text-slate-400 font-bold tracking-tight">No records found for {activeTab}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</AdminTemplate>
