<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Icon from '../../atoms/Icon.svelte';
  
  interface Props {
    step: 'general' | 'server' | 'superuser' | 'done';
  }

  let { step }: Props = $props();
  
  let mounted = $state(false);
  
  onMount(() => {
    mounted = true;
  });

  const content = {
    general: {
      tag: 'Foundation Setup',
      title: 'Define Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Identity</span>',
      desc: 'Set up your organization profile. This information will be displayed across the portal and official documents.',
      icon: 'community',
      color: 'emerald'
    },
    server: {
      tag: 'System Configuration',
      title: 'Connect Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Services</span>',
      desc: 'Configure API endpoints, translation services, and mail server settings for seamless communication.',
      icon: 'server',
      color: 'blue'
    },
    superuser: {
      tag: 'Access Control',
      title: 'Create <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Super Admin</span>',
      desc: 'Establish the primary administrator account with full system privileges and security controls.',
      icon: 'shield',
      color: 'violet'
    },
    done: {
      tag: 'Ready to Launch',
      title: 'System <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Initialized</span>',
      desc: 'Your school management portal is ready. You can now access the dashboard and start managing your institution.',
      icon: 'check',
      color: 'amber'
    }
  };

  const current = $derived(content[step]);
</script>

<!-- <button class="px-4 py-2 bg-emerald-500 text-white rounded" on:click={() => step = 'done'}>Next</button> -->
<div class="flex w-full h-full relative bg-slate-900 items-center justify-center p-12 overflow-hidden rounded-none">
    <!-- Abstract Background Shapes -->
    <div class="absolute top-0 left-0 w-full h-full opacity-20 transition-colors duration-1000">
        <div class="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-all duration-1000"
             class:bg-emerald-500={step === 'general'}
             class:bg-blue-500={step === 'server'}
             class:bg-violet-500={step === 'superuser'}
             class:bg-amber-500={step === 'done'}
        ></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-all duration-1000"
             class:bg-teal-600={step === 'general'}
             class:bg-indigo-600={step === 'server'}
             class:bg-fuchsia-600={step === 'superuser'}
             class:bg-orange-600={step === 'done'}
        ></div>
    </div>
    
    <!-- Pattern Overlay -->
    <div class="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

    <div class="relative z-10 w-full max-w-lg transition-all duration-1000 ease-out transform {mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}">
        <div class="space-y-8">
            {#key step}
            <div class="space-y-8" in:fade={{ duration: 400 }}>
                <div class="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                    <div class="w-2 h-2 rounded-full animate-ping transition-colors duration-500"
                         class:bg-emerald-400={step === 'general'}
                         class:bg-blue-400={step === 'server'}
                         class:bg-violet-400={step === 'superuser'}
                         class:bg-amber-400={step === 'done'}
                    ></div>
                    <span class="text-xs font-bold text-white tracking-widest uppercase">{current.tag}</span>
                </div>
                
                <h1 class="text-6xl font-black text-white leading-[1.1] tracking-tight">
                    {@html current.title}
                </h1>
                
                <p class="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                    {current.desc}
                </p>
            </div>
            {/key}
        </div>
    </div>


    <!-- Floating Image/Card Mockup -->
    <div class="absolute bottom-[-10%] right-[-5%] w-[70%] aspect-video bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 shadow-2xl transform rotate-[-6deg] group hover:rotate-0 transition-all duration-1000 delay-200 ease-out {mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}">
        <div class="p-8 space-y-6">
            <div class="flex items-center justify-between">
                <div class="flex gap-2">
                    <div class="w-3 h-3 rounded-full bg-rose-500/50"></div>
                    <div class="w-3 h-3 rounded-full bg-amber-500/50"></div>
                    <div class="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                </div>
                <div class="w-24 h-2 bg-white/10 rounded-full"></div>
            </div>
            
            {#key step}
            <div in:fade={{ duration: 300 }}>
                {#if step === 'general'}
                    <div class="space-y-4">
                        <div class="h-8 w-1/2 bg-white/10 rounded-xl"></div>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
                            <div class="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
                            <div class="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
                        </div>
                    </div>
                {:else if step === 'server'}
                    <div class="space-y-4">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Icon name="server" size="24" class="text-blue-400" />
                            </div>
                            <div class="space-y-2 flex-1">
                                <div class="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div class="h-full w-2/3 bg-blue-500 animate-[pulse_2s_infinite]"></div>
                                </div>
                                <div class="flex justify-between text-[10px] text-slate-400 font-mono">
                                    <span>API Status</span>
                                    <span class="text-emerald-400">Connected</span>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 space-y-2">
                            <div class="h-10 w-full bg-white/5 rounded-lg border border-white/10 flex items-center px-3 font-mono text-[10px] text-slate-400">
                                <span class="text-blue-400 mr-2">GET</span> /api/v1/health
                            </div>
                            <div class="h-10 w-full bg-white/5 rounded-lg border border-white/10 flex items-center px-3 font-mono text-[10px] text-slate-400">
                                <span class="text-green-400 mr-2">200</span> OK
                            </div>
                        </div>
                    </div>
                {:else if step === 'superuser'}
                    <div class="flex flex-col items-center justify-center h-full gap-4 py-4">
                        <div class="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center border-2 border-violet-500/30">
                            <Icon name="user" size="32" class="text-violet-300" />
                        </div>
                        <div class="text-center space-y-1">
                            <div class="h-4 w-32 bg-white/10 rounded mx-auto"></div>
                            <div class="h-3 w-48 bg-white/5 rounded mx-auto"></div>
                        </div>
                        <div class="flex gap-2 mt-2">
                            <div class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">Active</div>
                            <div class="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold uppercase tracking-wider border border-violet-500/30">Admin</div>
                        </div>
                    </div>
                {:else}
                    <div class="flex flex-col items-center justify-center h-full py-6">
                        <div class="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 animate-[bounce_2s_infinite]">
                            <Icon name="check" size="40" class="text-amber-400" />
                        </div>
                        <div class="text-2xl font-bold text-white">All Systems Go</div>
                    </div>
                {/if}
            </div>
            {/key}
        </div>
    </div>
</div>
