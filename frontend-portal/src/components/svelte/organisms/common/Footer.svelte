<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Icon from '../../atoms/Icon.svelte';
  import Button from '../../atoms/Button.svelte';

  let visible = $state(false);
  let footerElement: HTMLElement;

  const footerLinks = [
    { title: 'Programs', links: ['Classical Education', 'STEM Integration', 'Arts & Humanities', 'Athletics'] },
    { title: 'Campus', links: ['Campus Tours', 'Student Life', 'Housing', 'Facilities'] },
    { title: 'Admissions', links: ['How to Apply', 'Tuition & Fees', 'Scholarships', 'Financial Aid'] }
  ];

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        visible = true;
      }
    }, { threshold: 0.1 });

    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => observer.disconnect();
  });
</script>

<footer id="about" bind:this={footerElement} class="bg-[#0F172A] pt-32 pb-12 text-white overflow-hidden relative border-t border-white/5">
  <!-- Background Elements -->
  <div class="absolute inset-0 z-0 opacity-20">
    <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 40px 40px;"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-transparent to-[#0F172A]"></div>
  </div>

  <!-- Decorative Glows -->
  <div class="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
  <div class="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

  <div class="max-w-7xl mx-auto px-6 relative z-10">
    {#if visible}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-24">
        <div class="lg:col-span-2" in:fly={{ y: 20, duration: 800 }}>
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Icon name="grad" size="28" />
            </div>
            <span class="text-3xl font-black tracking-tight">Lumina<span class="text-indigo-400">.edu</span></span>
          </div>
          <p class="text-slate-400 max-w-sm mb-10 leading-relaxed font-medium text-lg">
            Empowering the next generation through innovation, excellence, and a global perspective in education.
          </p>
          <div class="flex gap-4">
            <button class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 group">
              <Icon name="community" size="20" />
            </button>
            <button class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 group">
              <Icon name="excellence" size="20" />
            </button>
            <button class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 group">
              <Icon name="play" size="20" />
            </button>
          </div>
        </div>

        {#each footerLinks as section, i}
          <div class="lg:col-span-1" in:fly={{ y: 20, duration: 800, delay: 200 + (i * 100) }}>
            <h4 class="text-sm font-black uppercase tracking-[0.2em] mb-10 text-white/90">{section.title}</h4>
            <ul class="space-y-5">
              {#each section.links as link}
                <li>
                  <a href="#{link.toLowerCase().replace(/ /g, '-')}" class="text-slate-400 hover:text-indigo-400 transition-all duration-300 font-bold text-sm flex items-center gap-2 group">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-all"></span>
                    {link}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}

        <!-- Newsletter / Contact Mini -->
        <div class="lg:col-span-1" in:fly={{ y: 20, duration: 800, delay: 600 }}>
          <h4 class="text-sm font-black uppercase tracking-[0.2em] mb-10 text-white/90">Contact</h4>
          <div class="space-y-6">
            <div class="flex flex-col gap-1">
              <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Email Us</p>
              <p class="text-sm font-bold text-slate-300">hello@lumina.edu</p>
            </div>
            <div class="flex flex-col gap-1">
              <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Call Us</p>
              <p class="text-sm font-bold text-slate-300">+62 21 555 0123</p>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8" in:fade={{ duration: 1000, delay: 800 }}>
        <div class="flex flex-col items-center md:items-start gap-2">
          <p class="text-slate-500 text-xs font-bold tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Lumina Academy Group.
          </p>
          <p class="text-slate-600 text-[10px] font-medium">Designed for excellence in Indonesia.</p>
        </div>
        <div class="flex gap-10">
          <a href="#privacy" class="text-slate-500 hover:text-white transition-colors text-[10px] font-black tracking-[0.2em] uppercase">Privacy Policy</a>
          <a href="#terms" class="text-slate-500 hover:text-white transition-colors text-[10px] font-black tracking-[0.2em] uppercase">Terms of Service</a>
          <a href="#cookies" class="text-slate-500 hover:text-white transition-colors text-[10px] font-black tracking-[0.2em] uppercase">Cookies</a>
        </div>
      </div>
    {/if}
  </div>
</footer>
