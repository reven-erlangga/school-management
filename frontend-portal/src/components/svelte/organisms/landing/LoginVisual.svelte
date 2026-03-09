<script lang="ts">
  import { onMount } from 'svelte';
  
  let mounted = $state(false);
  
  onMount(() => {
    mounted = true;
  });
</script>

<div class="flex w-full h-full relative bg-slate-900 items-center justify-center p-12 overflow-hidden rounded-none">
    <!-- Abstract Background Shapes -->
    <div class="absolute top-0 left-0 w-full h-full opacity-20">
        <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600 rounded-full blur-[120px]"></div>
    </div>
    
    <!-- Pattern Overlay -->
    <div class="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

    <div class="relative z-10 w-full max-w-lg transition-all duration-1000 ease-out transform {mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}">
        <div class="space-y-8">
            <div class="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <div class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <span class="text-xs font-bold text-white tracking-widest uppercase">System Online</span>
            </div>
            
            <h1 class="text-6xl font-black text-white leading-[1.1] tracking-tight">
                Manage your <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Academy</span> with ease.
            </h1>
            
            <p class="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                The most advanced platform for educational excellence. Empowering administrators, teachers, and students.
            </p>

            <div class="grid grid-cols-2 gap-6 pt-8">
                <div class="space-y-2">
                    <div class="text-3xl font-black text-white">12k+</div>
                    <div class="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Students</div>
                </div>
                <div class="space-y-2">
                    <div class="text-3xl font-black text-white">99.9%</div>
                    <div class="text-xs font-bold text-slate-500 uppercase tracking-widest">Uptime Record</div>
                </div>
            </div>
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
            <div class="space-y-4">
                <div class="h-8 w-1/2 bg-white/10 rounded-xl"></div>
                <div class="grid grid-cols-3 gap-4">
                    <div class="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
                    <div class="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
                    <div class="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
                </div>
            </div>
        </div>
    </div>
</div>
