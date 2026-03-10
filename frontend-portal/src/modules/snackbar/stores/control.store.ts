import { writable } from 'svelte/store';

// Snackbar Types
export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

// Snackbar Positions
export type SnackbarPosition =
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';

// Snackbar State Interface
export interface SnackbarState {
    show: boolean;
    message: string;
    type: SnackbarType;
    position: SnackbarPosition;
    duration: number;
}

// Default State
const initialState: SnackbarState = {
    show: false,
    message: '',
    type: 'info',
    position: 'bottom-right',
    duration: 5000,
};

// Create the store
const createSnackbarStore = () => {
    const { subscribe, update, set } = writable<SnackbarState>(initialState);
    let timer: any;

    return {
        subscribe,
        /**
         * Show a snackbar notification
         * @param message Message to display
         * @param type Type of notification (success, error, warning, info)
         * @param position Position on screen (default: bottom-right)
         * @param duration Duration in ms (default: 5000)
         */
        show: (
            message: string,
            type: SnackbarType = 'info',
            position: SnackbarPosition = 'bottom-right',
            duration: number = 5000
        ) => {
            // Clear existing timer if any
            if (timer) clearTimeout(timer);

            // Update state
            update(() => ({
                show: true,
                message,
                type,
                position,
                duration,
            }));

            // Set auto-hide timer
            if (duration > 0) {
                timer = setTimeout(() => {
                    update((s) => ({ ...s, show: false }));
                }, duration);
            }
        },
        /**
         * Hide the snackbar immediately
         */
        hide: () => {
            if (timer) clearTimeout(timer);
            update((s) => ({ ...s, show: false }));
        },
    };
};

export const snackbar = createSnackbarStore();
