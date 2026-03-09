<script lang="ts">
  import Icon from '../atoms/Icon.svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { cubicOut, quintOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  let isOpen = $state(false);
  let isExpanded = $state(false);
  let container = $state<HTMLDivElement | null>(null);

  // Form states
  let audience = $state('');
  let channel = $state('');
  let subject = $state('');
  let message = $state('');

  const audiences = ['All Students', 'Teachers Only', 'Parents Only', 'Staff Only'];
  const channels = ['Email', 'Push Notification', 'SMS', 'WhatsApp'];

  function toggle() {
    isOpen = !isOpen;
    if (!isOpen) {
      isExpanded = false;
      document.body.style.overflow = '';
    }
  }

  function toggleExpand() {
    isExpanded = !isExpanded;
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function handleSend() {
    // Implement send logic
    console.log('Sending announcement:', { audience, channel, subject, message });
    // Reset and close
    audience = '';
    channel = '';
    subject = '';
    message = '';
    isOpen = false;
    isExpanded = false;
    document.body.style.overflow = '';
  }

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if expanded (modal mode usually needs explicit close)
      if (isOpen && !isExpanded && container && !container.contains(event.target as Node)) {
        isOpen = false;
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isExpanded) {
          isExpanded = false;
          document.body.style.overflow = '';
        } else if (isOpen) {
          isOpen = false;
        }
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none">
  <!-- Backdrop for Expanded State -->
  {#if isExpanded}
    <div 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] pointer-events-auto cursor-pointer"
      transition:fade={{ duration: 300 }}
      onclick={() => {
        isExpanded = false;
        document.body.style.overflow = '';
      }}
    ></div>
  {/if}

  <!-- Announcement Panel Container -->
  <div bind:this={container} class="relative flex flex-col items-end pointer-events-auto">
    {#if isOpen}
      <!-- 
        Panel Positioning:
        - We use 'fixed' at all times when open to ensure smooth transition between positions.
        - Using 'backOut' easing for a more natural motion.
      -->
      <div 
        class="bg-white dark:bg-slate-900 shadow-[0_32px_64px_-12px_rgba(30,27,75,0.3)] border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden fixed rounded-[32px]
          transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275)
          {isExpanded 
            ? 'bottom-[50vh] right-[50vw] translate-x-1/2 translate-y-1/2 z-[200]' 
            : 'bottom-[112px] right-[32px] translate-x-0 translate-y-0 z-[160]'}"
        style="width: {isExpanded ? '600px' : '380px'}; height: {isExpanded ? '700px' : '550px'}; max-width: 90vw; max-height: 80vh;"
        transition:scale={{ duration: 400, start: 0.8, opacity: 0, easing: quintOut }}
      >
        <!-- Panel Header -->
        <div class="bg-indigo-600 p-5 flex items-center justify-between shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
              <Icon name="megaphone" size="18" />
            </div>
            <h3 class="text-white font-black text-sm tracking-wide">Quick Announcement</h3>
          </div>
          <div class="flex items-center gap-1">
            <button 
              onclick={toggleExpand}
              class="w-8 h-8 hover:bg-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-90"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              <Icon name={isExpanded ? "minimize" : "expand"} size="16" />
            </button>
            <button 
              onclick={toggle}
              class="w-8 h-8 hover:bg-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-90"
            >
              <Icon name="close" size="18" />
            </button>
          </div>
        </div>

        <!-- Panel Body (Form) -->
        <div class="flex-grow p-6 space-y-4 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Audience</label>
              <div class="relative group">
                <select 
                  bind:value={audience}
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/10 appearance-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select Audience</option>
                  {#each audiences as a}
                    <option value={a}>{a}</option>
                  {/each}
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Icon name="chevron-right" size="14" class="rotate-90" />
                </div>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Channel</label>
              <div class="relative group">
                <select 
                  bind:value={channel}
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/10 appearance-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select Channel</option>
                  {#each channels as c}
                    <option value={c}>{c}</option>
                  {/each}
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Icon name="chevron-right" size="14" class="rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Subject</label>
            <input 
              type="text" 
              bind:value={subject}
              placeholder="Announcement Subject" 
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Message</label>
            <textarea 
              bind:value={message}
              placeholder="Type your message here..." 
              rows={isExpanded ? 10 : 6}
              class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/10 resize-none transition-all h-full"
            ></textarea>
          </div>
        </div>

        <!-- Panel Footer (Sticky Button) -->
        <div class="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <button 
            onclick={handleSend}
            disabled={!audience || !channel || !subject || !message}
            class="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            Send Announcement
          </button>
        </div>
      </div>
    {/if}

    <!-- Floating Action Button -->
    <button 
      onclick={toggle}
      aria-label={isOpen ? "Close announcement" : "Open quick announcement"}
      class="w-12 h-12 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-600/30 flex items-center justify-center hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all relative group z-[110] cursor-pointer"
    >
      <Icon name={isOpen ? 'close' : 'megaphone'} size="20" class="transition-transform duration-300" />
      
      <!-- Tooltip -->
      {#if !isOpen}
        <span class="absolute right-14 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
          Quick Announcement
        </span>
      {/if}
    </button>
  </div>
</div>
