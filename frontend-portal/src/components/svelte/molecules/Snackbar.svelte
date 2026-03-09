<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { snackbar } from '../../../store/snackbar.store';
    import Icon from '../atoms/Icon.svelte';

    // Position mapping
    const positions = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-center': 'top-4 left-1/2 -translate-x-1/2',
        'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
    };

    // Style mapping matching LoginForm error style with opacity
    const styles = {
        success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        error: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
        warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        info: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    };
    
    // Icon background mapping
    const iconBgStyles = {
        success: 'bg-emerald-500/20 text-emerald-300',
        error: 'bg-rose-500/20 text-rose-300',
        warning: 'bg-amber-500/20 text-amber-300',
        info: 'bg-indigo-500/20 text-indigo-300',
    };

    // Icon mapping
    const icons = {
        success: 'check',
        error: 'close', 
        warning: 'info',
        info: 'info',
    };
</script>

{#if $snackbar.show}
    <div
        class="fixed z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-lg {positions[$snackbar.position]} {styles[$snackbar.type]}"
        transition:fly={{ y: 20, duration: 300 }}
    >
        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 {iconBgStyles[$snackbar.type]}">
            <Icon name={icons[$snackbar.type] as any} size="16" />
        </div>
        
        <span class="text-[13px] font-bold">{$snackbar.message}</span>
        
        <button
            class="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
            onclick={() => snackbar.hide()}
        >
            <Icon name="close" size="14" />
        </button>
    </div>
{/if}
