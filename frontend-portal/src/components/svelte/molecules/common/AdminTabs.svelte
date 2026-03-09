<script lang="ts">
  interface Tab {
    id: string;
    label: string;
    icon?: string;
  }

  let { tabs = [], activeTab = '', onTabChange = (id: string) => {} } = $props();
</script>

<!-- Sticky Container with Glassmorphism -->
<div class="sticky top-16 z-20 w-full bg-[#F8FAFC]/80 backdrop-blur-xl border-b border-slate-200/40 shadow-sm shadow-slate-100/20 mt-4">
  <div class="px-12 h-16 flex items-center">
    <!-- Segmented Control Design -->
    <div class="flex items-center p-1.5 bg-slate-200/40 rounded-2xl w-fit border border-slate-200/20">
      {#each tabs as tab}
        <button 
          onclick={() => onTabChange(tab.id)}
          class="relative px-6 py-2 rounded-[14px] text-[13px] font-bold transition-all duration-300 active:scale-95 whitespace-nowrap cursor-pointer
                 {activeTab === tab.id 
                   ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100/30' 
                   : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'}"
        >
          {tab.label}
        </button>
      {/each}
    </div>
  </div>
</div>
