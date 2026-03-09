<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Icon from '../atoms/Icon.svelte';
  import { notifications } from '../../../store/notification.store';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
  }

  let { isOpen, onClose }: Props = $props();

  let activeTab = $state('semua');
  let scrollContainer = $state<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (!scrollContainer || $notifications.loading || !$notifications.hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      notifications.fetchNotifications();
    }
  };

  $effect(() => {
    if (isOpen) {
      notifications.fetchNotifications(true);
      notifications.fetchUnreadCount();
    }
  });

  const handleTabChange = (tab: string) => {
    activeTab = tab;
    // Currently backend doesn't support filtering by type in the same endpoint easily without adjusting query builder
    // Assuming 'semua' fetches all. 
    // If backend supports type filtering, pass it to fetchNotifications.
    // For now, let's just reload.
    notifications.fetchNotifications(true);
  };

  const handleMarkAsRead = (id: string, event: Event) => {
      event.stopPropagation();
      notifications.markAsRead(id);
  }

  const handleMarkAllAsRead = () => {
      notifications.markAllAsRead();
  }

  const getFilteredNotifications = () => {
      if (activeTab === 'semua') return $notifications.data;
      return $notifications.data.filter(n => n.type === activeTab || (activeTab === 'primary' && n.type === 'info') || (activeTab === 'newsletter' && n.type !== 'info')); 
      // Adjust filter logic based on actual types used in backend 'info', 'success', 'warning', 'error'
  };

  const getTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return dateString;

      const diffMs = date.getTime() - Date.now();
      const diffSeconds = Math.round(diffMs / 1000);

      const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
      const divisions: Array<[number, Intl.RelativeTimeFormatUnit]> = [
        [60, 'second'],
        [60, 'minute'],
        [24, 'hour'],
        [7, 'day'],
        [4.34524, 'week'],
        [12, 'month'],
        [Number.POSITIVE_INFINITY, 'year'],
      ];

      let duration = diffSeconds;
      let unit: Intl.RelativeTimeFormatUnit = 'second';
      for (const [amount, nextUnit] of divisions) {
        if (Math.abs(duration) < amount) {
          unit = nextUnit;
          break;
        }
        duration = Math.round(duration / amount);
        unit = nextUnit;
      }

      return rtf.format(duration, unit);
  }

  // Derived state for filtered notifications
  let filteredNotifications = $derived(getFilteredNotifications());

</script>

{#if isOpen}
  <!-- Backdrop -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]" 
    transition:fade={{ duration: 200 }}
    onclick={onClose}
  ></div>

  <!-- Drawer -->
  <div 
    class="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white dark:bg-slate-900 shadow-2xl z-[101] flex flex-col"
    transition:fly={{ x: 400, duration: 300, opacity: 1 }}
  >
    <!-- Header -->
    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Notifications</h2>
        {#if $notifications.unreadCount > 0}
            <span class="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{$notifications.unreadCount}</span>
        {/if}
      </div>
      <button 
        onclick={onClose}
        class="w-8 h-8 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
      >
        <Icon name="close" size="18" />
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-2 px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900">
      {#each ['semua', 'primary', 'newsletter'] as tab}
        <button 
          onclick={() => handleTabChange(tab)}
          class="px-5 py-2.5 text-[13px] font-bold capitalize transition-all rounded-2xl
                 {activeTab === tab 
                   ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm border border-slate-100 dark:border-slate-700' 
                   : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800'}"
        >
          {tab}
        </button>
      {/each}
    </div>

    <!-- Content -->
    <div 
      bind:this={scrollContainer}
      onscroll={handleScroll}
      class="flex-grow overflow-y-auto custom-scrollbar p-2"
    >
      {#if filteredNotifications.length > 0}
        <div class="space-y-1">
          {#each filteredNotifications as item (item.id)}
            <div class="p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group relative">
              <div class="flex gap-4">
                <div class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center 
                            {item.type === 'info' ? 'bg-indigo-50 text-indigo-600' : 
                             item.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                             item.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                             'bg-rose-50 text-rose-600'} dark:bg-slate-800">
                  <Icon name={item.type === 'info' ? 'community' : 'grad'} size="18" />
                </div>
                <div class="flex flex-col gap-1 w-full">
                  <div class="flex items-center justify-between">
                    <span class="text-[14px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{item.title || 'Notification'}</span>
                    {#if !item.is_read}
                      <button 
                        class="w-2 h-2 rounded-full bg-indigo-600 hover:scale-150 transition-transform" 
                        title="Mark as read"
                        onclick={(e) => handleMarkAsRead(item.id, e)}
                      ></button>
                    {/if}
                  </div>
                  <p class="text-[12px] text-slate-500 dark:text-slate-300 leading-relaxed line-clamp-2">{item.message}</p>
                  <span class="text-[11px] font-medium text-slate-400 dark:text-slate-400 mt-1">{getTimeAgo(item.created_at)}</span>
                </div>
              </div>
            </div>
          {/each}
          
          {#if $notifications.loading}
            <div class="p-8 flex flex-col items-center justify-center gap-3">
              <div class="w-6 h-6 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
              <p class="text-[12px] font-medium text-slate-400">Loading more...</p>
            </div>
          {/if}

          {#if !$notifications.hasMore && filteredNotifications.length > 0}
            <div class="p-8 text-center">
              <p class="text-[12px] font-medium text-slate-300 italic">No more notifications</p>
            </div>
          {/if}
        </div>
      {:else if !$notifications.loading}
        <div class="h-full flex flex-col items-center justify-center p-12 text-center">
          <div class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-600 mb-6 border border-slate-100 dark:border-slate-700">
            <Icon name="community" size="32" />
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">No notifications</h3>
          <p class="text-[13px] text-slate-400 dark:text-slate-400">You're all caught up! Check back later for updates.</p>
        </div>
      {/if}
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-slate-100 dark:border-slate-800">
      <button 
        onclick={handleMarkAllAsRead}
        class="w-full py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-[13px] font-bold text-slate-600 dark:text-slate-200 transition-colors"
      >
        Mark all as read
      </button>
    </div>
  </div>
{/if}

<style>
  /* Local styles if needed, but using global slim scrollbar */
</style>
