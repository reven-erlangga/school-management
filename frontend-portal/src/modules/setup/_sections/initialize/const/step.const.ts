import type { StepIndicatorItem } from "@components/svelte/atoms/StepIndicator.svelte";
import { Stage } from "../stores/stage.store";

export const steps: StepIndicatorItem[] = [
    { id: Stage.General, label: 'General', icon: 'community' },
    { id: Stage.MailServer, label: 'Mail', icon: 'settings' },
    { id: Stage.Xendit, label: 'Xendit', icon: 'shield' },
    { id: Stage.Seeding, label: 'Seeding CLI', icon: 'server' },
];
