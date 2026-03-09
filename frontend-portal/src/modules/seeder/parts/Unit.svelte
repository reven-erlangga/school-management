<script lang="ts">
    import Button from '@components/svelte/atoms/Button.svelte';
    import TextField from '@components/svelte/atoms/TextField.svelte';
    import { seederStep } from '../stores/step.store';

    let unitName = $state('');

    const handleSubmit = () => {
        // Here you would typically validate and save the data
        console.log('Unit Name:', unitName);
        seederStep.next();
    };
</script>

<div class="p-8 space-y-6">
    <div class="space-y-2">
        <h2 class="text-xl font-bold text-white">Setup Units</h2>
        <p class="text-sm text-slate-400">Define the organizational units for your institution.</p>
    </div>

    <div class="space-y-4">
        <TextField
            id="unitName"
            label="Unit Name"
            placeholder="e.g. Primary School, High School"
            bind:value={unitName}
        />
    </div>

    <div class="pt-4 flex justify-end">
        <Button variant="primary" onclick={handleSubmit}>
            Next Step
        </Button>
    </div>
</div>
