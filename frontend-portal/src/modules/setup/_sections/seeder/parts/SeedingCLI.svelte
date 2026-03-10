<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Button from '@components/svelte/atoms/Button.svelte';
    import { stage } from '../stores/stage.store';

    let logs = $state<string[]>([]);
    let progress = $state(0);
    let completed = $state(false);
    let isStarting = $state(false);
    let seenOneTimeLogs = new Set<string>();

    const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

    // Helper to scroll to bottom
    const scrollToBottom = () => {
        const container = document.getElementById('cli-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    // Helper to add log
    const addLog = (message: string, type: 'info' | 'success' | 'command' = 'info') => {
        let formattedLog = message;
        if (type === 'command') formattedLog = `> ${message}`;
        if (type === 'success') formattedLog = `  ✔ ${message}`;

        const oneTimeMessages = new Set([
            'seeding translation',
            '- english',
            '- indonesia',
            'seeding country'
        ]);

        if (type === 'info' && oneTimeMessages.has(formattedLog)) {
            if (seenOneTimeLogs.has(formattedLog)) {
                return;
            }
            seenOneTimeLogs.add(formattedLog);
        } else {
            if (logs.length > 0 && logs[logs.length - 1] === formattedLog) {
                return;
            }
        }

        logs = [...logs, formattedLog];
        setTimeout(scrollToBottom, 50);
    };

    onMount(async () => {
        await startSeeding();
    });

    const startSeeding = async () => {
        if (isStarting) return;
        isStarting = true;
        addLog('Initializing seeder process...', 'command');

        try {
            // 1. Trigger Seeder Job
            const runResponse = await fetch(`${API_URL}/seeder/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: 'all' }) // Default to 'all' or based on previous steps
            });

            if (!runResponse.ok) {
                throw new Error(`Failed to start seeder: ${runResponse.statusText}`);
            }

            const runData = await runResponse.json();
            const jobId = runData.data?.job_id;

            if (!jobId) {
                throw new Error('No job ID returned from seeder');
            }

            addLog(`Job started: ${jobId}`, 'info');
            addLog('Connecting to event stream...', 'info');

            // 2. Listen to Event Stream
            const eventSource = new EventSource(`${API_URL}/seeder/stream/${jobId}`);

            eventSource.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    const data = response?.data ?? response;

                    if (response?.errors?.length) {
                        const detail = response.errors[0]?.detail || response.errors[0]?.title || 'Unknown error';
                        addLog(`Error: ${detail}`, 'info');
                        eventSource.close();
                        return;
                    }
                    
                    if (data.progress) {
                        progress = data.progress.percent ?? 0;
                        if (data.progress.message) {
                            addLog(data.progress.message, 'info');
                        }
                    }

                    if (data.state === 'completed') {
                        completed = true;
                        progress = 100;
                        addLog(data.result || 'Seeding completed successfully', 'success');
                        addLog('✨ All seeds executed successfully!', 'info');
                        eventSource.close();
                    } else if (data.state === 'failed') {
                        addLog(`❌ Job failed: ${data.failed_reason || data.error || 'Unknown error'}`, 'info');
                        eventSource.close();
                    }
                } catch (e) {
                    console.error('Error parsing stream data:', e);
                }
            };

            eventSource.onerror = (error) => {
                console.error('EventSource failed:', error);
                // Don't close immediately on error, might be temporary network issue
                // But for this demo, we might want to stop if it persists
                // eventSource.close(); 
            };

        } catch (error: any) {
            console.error('Seeding error:', error);
            addLog(`Error: ${error.message}`, 'info');
        }
    };

    const handleFinish = () => {
        stage.next(); // Go to 'done' or handle redirect
        window.location.href = '/admin/dashboard';
    };
</script>

<div class="p-8 space-y-6">
    <!-- CLI Terminal Window -->
    <div class="bg-slate-950 rounded-xl border border-slate-800 shadow-inner overflow-hidden font-mono text-xs md:text-sm">
        <!-- Terminal Header -->
        <div class="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
            <div class="flex gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
            </div>
            <div class="flex-1 text-center text-slate-500 text-[10px] uppercase tracking-wider">seeder-cli — bash</div>
        </div>
        
        <!-- Terminal Content -->
        <div id="cli-container" class="p-4 h-64 overflow-y-auto space-y-1 text-slate-300 custom-scrollbar">
            {#each logs as log}
                <div class="font-mono break-all whitespace-pre-wrap">
                    {#if log.includes('✔')}
                        <span class="text-emerald-400">{log}</span>
                    {:else if log.startsWith('>')}
                        <span class="text-indigo-400">$</span> {log.substring(2)}
                    {:else if log.includes('successfully')}
                        <span class="text-emerald-400 font-bold">{log}</span>
                    {:else if log.includes('Error') || log.includes('failed')}
                        <span class="text-red-400">{log}</span>
                    {:else}
                        {log}
                    {/if}
                </div>
            {/each}
            
            {#if !completed}
                <div class="animate-pulse">_</div>
            {/if}
        </div>
        
        <!-- Progress Bar -->
        <div class="bg-slate-900 px-4 py-2 border-t border-slate-800">
            <div class="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
            </div>
            <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-indigo-500 transition-all duration-300 ease-out" style="width: {progress}%"></div>
            </div>
        </div>
    </div>

    {#if completed}
        <div class="pt-2 flex justify-center" in:fade>
            <Button variant="primary" onclick={handleFinish}>
                Go to Dashboard
            </Button>
        </div>
    {/if}
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #334155;
        border-radius: 3px;
    }
</style>
