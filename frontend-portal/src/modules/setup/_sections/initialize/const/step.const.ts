import type { StepIndicatorItem } from "@components/svelte/atoms/StepIndicator.svelte";

export const steps: StepIndicatorItem[] = [
    { id: 'general', label: 'General', icon: 'community' },
    { id: 'server', label: 'Server', icon: 'settings' },
    { id: 'superuser', label: 'Super User', icon: 'user' },
];