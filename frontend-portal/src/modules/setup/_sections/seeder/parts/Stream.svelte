<script lang="ts">
    import Button from '@components/svelte/atoms/Button.svelte';
    import TextField from '@components/svelte/atoms/TextField.svelte';
    import { stage } from '../stores/stage.store';

    let streamName = $state('');

    const handleSubmit = () => {
        // Here you would typically validate and save the data
        console.log('Stream Name:', streamName);
        stage.next();
    };

    const handleBack = () => {
        stage.back();
    };
</script>

<div class="p-8 space-y-6">
    <div class="space-y-2">
        <h2 class="text-xl font-bold text-white">Setup Streams</h2>
        <p class="text-sm text-slate-400">Define the academic streams or programs.</p>
    </div>

    <div class="space-y-4">
        <TextField
            id="streamName"
            label="Stream Name"
            placeholder="e.g. Science, Arts, General"
            bind:value={streamName}
        />
    </div>

    <div class="pt-4 flex justify-between">
        <Button variant="ghost" onclick={handleBack}>
            Back
        </Button>
        <Button variant="primary" onclick={handleSubmit}>
            Start Seeding
        </Button>
    </div>
</div>
