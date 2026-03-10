import type { StepIndicatorItem } from "@components/svelte/atoms/StepIndicator.svelte";
import { Stage } from "../stores/stage.store";

export const steps: StepIndicatorItem[] = [
    { id: Stage.General, label: 'General', icon: 'community' },
    { id: Stage.MailServer, label: 'Mail', icon: 'settings' },
    { id: Stage.SuperUser, label: 'Super User', icon: 'user' },
];