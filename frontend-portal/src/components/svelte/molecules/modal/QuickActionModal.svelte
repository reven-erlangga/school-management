<script lang="ts">
  import Icon from '../../atoms/Icon.svelte';
  import { fade, fly, scale } from 'svelte/transition';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedAction?: string | null;
  }

  let { isOpen, onClose, selectedAction = null }: Props = $props();

  const actionConfigs = {
    student: {
      title: 'Create a Student',
      subtitle: 'Register a new student into the Lumina system.',
      icon: 'user',
      color: 'bg-indigo-50 text-indigo-600',
      fields: [
        { label: 'Full Name', placeholder: 'e.g. John Doe', type: 'text' },
        { label: 'Date of Birth', type: 'date' },
        { label: 'Class', placeholder: 'Select Class', type: 'select' }
      ]
    },
    invoice: {
      title: 'Generate Invoice',
      subtitle: 'Create a new billing statement for student fees.',
      icon: 'excellence',
      color: 'bg-amber-50 text-amber-600',
      fields: [
        { label: 'Student Name', placeholder: 'Search student...', type: 'text' },
        { label: 'Amount', placeholder: 'e.g. 5.000.000', type: 'number' },
        { label: 'Due Date', type: 'date' }
      ]
    },
    announcement: {
      title: 'Create Announcement',
      subtitle: 'Broadcast important information to school members.',
      icon: 'megaphone',
      color: 'bg-rose-50 text-rose-600',
      fields: [
        { label: 'Audience', placeholder: 'All Students', type: 'select' },
        { label: 'Subject', placeholder: 'Important: School Event', type: 'text' },
        { label: 'Message', type: 'textarea' }
      ]
    }
  };

  const currentAction = $derived(selectedAction ? (actionConfigs as any)[selectedAction] : null);

  function handleSubmit() {
    console.log(`Submitting Quick Action: ${selectedAction}`);
    onClose();
  }
</script>

{#if isOpen && currentAction}
  <!-- Backdrop -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
    transition:fade={{ duration: 200 }}
    onclick={onClose}
  >
    <!-- Modal Panel -->
    <div 
      class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
      transition:scale={{ duration: 300, start: 0.95 }}
      onclick={(e) => e.stopPropagation()}
    >
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 {currentAction.color} rounded-2xl flex items-center justify-center">
              <Icon name={currentAction.icon as any} size="22" />
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{currentAction.title}</h3>
              <p class="text-[13px] font-medium text-slate-400 dark:text-slate-400 mt-0.5">{currentAction.subtitle}</p>
            </div>
          </div>
          <button onclick={onClose} class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all">
            <Icon name="close" size="20" />
          </button>
        </div>

        <div class="space-y-5">
          {#each currentAction.fields as field}
            <div class="space-y-2">
              <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
              {#if field.type === 'textarea'}
                <textarea 
                  class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[14px] font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500 min-h-[120px]"
                ></textarea>
              {:else}
                <input 
                  type={field.type} 
                  placeholder={field.placeholder}
                  class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[14px] font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500"
                />
              {/if}
            </div>
          {/each}
        </div>

        <button 
          onclick={handleSubmit}
          class="w-full mt-8 py-4.5 bg-slate-900 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          Confirm & Proceed
        </button>
      </div>
    </div>
  </div>
{/if}
