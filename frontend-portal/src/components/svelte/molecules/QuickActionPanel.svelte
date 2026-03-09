<script lang="ts">
  import Icon from '../atoms/Icon.svelte';
  import FloatingPanel from './FloatingPanel.svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    onActionSelect: (id: string) => void;
    triggerRect?: DOMRect | null;
  }

  let { isOpen, onClose, onActionSelect, triggerRect = null }: Props = $props();

  const actions = [
    {
      id: 'invoice',
      title: 'Generate Invoice',
      icon: 'excellence',
      color: 'text-amber-600 bg-amber-50',
      borderColor: 'group-hover:border-amber-100'
    },
    {
      id: 'student',
      title: 'Create Student',
      icon: 'user',
      color: 'text-indigo-600 bg-indigo-50',
      borderColor: 'group-hover:border-indigo-100'
    },
    {
      id: 'announcement',
      title: 'Create Announcement',
      icon: 'megaphone',
      color: 'text-rose-600 bg-rose-50',
      borderColor: 'group-hover:border-rose-100'
    }
  ];

  function handleSelect(id: string) {
    onActionSelect(id);
    onClose();
  }
</script>

<FloatingPanel {isOpen} {onClose} {triggerRect} width="w-64">
  <div class="p-5 border-b border-slate-50 bg-slate-50/30">
    <h3 class="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Quick Actions</h3>
  </div>

  <div class="p-2 space-y-1">
    {#each actions as action}
      <button 
        onclick={() => handleSelect(action.id)}
        class="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group text-left cursor-pointer"
      >
        <div class="w-9 h-9 rounded-xl {action.color} flex items-center justify-center shadow-sm transition-all border border-transparent {action.borderColor} group-hover:scale-110">
          <Icon name={action.icon as any} size="18" />
        </div>
        <span class="text-[13px] font-bold">{action.title}</span>
      </button>
    {/each}
  </div>

  <div class="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
    <p class="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Lumina Instant Access</p>
  </div>
</FloatingPanel>
