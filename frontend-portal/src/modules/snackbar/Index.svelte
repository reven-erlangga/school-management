<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { snackbar } from './stores/control.store';
    import Icon from '@components/svelte/atoms/Icon.svelte';
    import { POSITION_CLASS } from './const/position.const';
    import { STYLE_CLASS, ICON_BG_CLASS, ICON_BY_STYLE } from './const/style.const';
    import { Style } from './enums/style.enum';
</script>

{#if $snackbar.show}
    <div
        class="fixed z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-lg {POSITION_CLASS[$snackbar.position]} {STYLE_CLASS[$snackbar.type as Style]}"
        transition:fly={{ y: 20, duration: 300 }}
    >
        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 {ICON_BG_CLASS[$snackbar.type as Style]}">
            <Icon name={ICON_BY_STYLE[$snackbar.type as Style] as any} size="16" />
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
