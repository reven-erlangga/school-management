<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Icon from '../../atoms/Icon.svelte';

  let visible = $state(false);
  let sectionElement: HTMLElement;
  let scrollProgress = $state(0);

  const steps = [
    {
      number: '01',
      title: 'Online Registration',
      description: 'Fill out our comprehensive online application form with your personal and academic details. It only takes 10 minutes to start your journey.',
      icon: 'community' as const
    },
    {
      number: '02',
      title: 'Document Submission',
      description: 'Upload necessary documents including previous transcripts, identification, and recommendation letters to our secure portal.',
      icon: 'excellence' as const
    },
    {
      number: '03',
      title: 'Entrance Assessment',
      description: 'Participate in our holistic assessment process designed to understand your potential, creativity, and future goals.',
      icon: 'grad' as const
    },
    {
      number: '04',
      title: 'Final Interview',
      description: 'A personal conversation with our admissions committee to ensure the perfect fit for our community and your aspirations.',
      icon: 'excellence' as const
    }
  ];

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        visible = true;
      }
    }, { threshold: 0.1 });

    if (sectionElement) {
      observer.observe(sectionElement);
    }

    const handleScroll = () => {
      if (!sectionElement) return;
      const rect = sectionElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;
      
      // Calculate progress based on scroll position within section
      let progress = (windowHeight - elementTop) / (windowHeight + elementHeight * 0.5);
      scrollProgress = Math.min(Math.max(progress * 100, 0), 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<section id="how-to-apply" bind:this={sectionElement} class="py-32 bg-slate-50 overflow-hidden relative">
  <!-- Decorative Elements -->
  <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
  <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

  <div class="max-w-6xl mx-auto px-6 relative z-10">
    <div class="text-center mb-32">
      <span class="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-4 bg-indigo-50 px-4 py-1.5 rounded-full inline-block">Admissions Process</span>
      <h2 class="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6 tracking-tight">How to <span class="text-indigo-600">Apply</span>.</h2>
      <p class="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
        Join our world-class learning community through a simple and transparent admission journey.
      </p>
    </div>

    <div class="relative min-h-[800px]">
      <!-- Central Line Container -->
      <div class="absolute left-8 md:left-1/2 top-4 bottom-4 w-[2px] bg-slate-200 -translate-x-1/2 hidden md:block overflow-hidden">
        <!-- Animated Progress Line -->
        <div 
          class="absolute top-0 left-0 w-full bg-indigo-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
          style="height: {scrollProgress}%"
        ></div>
      </div>
      
      <div class="space-y-32 md:space-y-48">
        {#each steps as step, i}
          <div class="relative flex flex-col md:flex-row items-start md:items-center py-8">
            <!-- Left Side Content -->
            <div class="flex-1 order-2 md:order-1 {i % 2 === 0 ? 'md:pr-32 text-left md:text-right' : 'md:invisible md:h-0'}">
              {#if visible}
                <div in:fly={{ x: -30, duration: 800, delay: 200, easing: cubicOut }}>
                  <h4 class="text-2xl md:text-3xl font-black text-[#1E1B4B] mb-6 tracking-tight group-hover:text-indigo-600 transition-colors">{step.title}</h4>
                  <p class="text-slate-500 font-medium leading-relaxed text-base md:text-lg">{step.description}</p>
                </div>
              {/if}
            </div>

            <!-- Central Node -->
            <div class="relative z-10 order-1 md:order-2 flex justify-center w-16 md:w-auto px-4 md:px-12">
              {#if visible}
                <div in:scale={{ duration: 600, delay: 100, easing: cubicOut }} class="relative group">
                  <div class="w-16 h-16 md:w-28 md:h-28 bg-white border-4 border-slate-100 rounded-[28px] md:rounded-[40px] flex items-center justify-center shadow-2xl shadow-indigo-500/5 group-hover:border-indigo-600 group-hover:shadow-indigo-500/20 transition-all duration-500 bg-white z-20 relative">
                    <div class="text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                      <Icon name={step.icon} size="40" />
                    </div>
                  </div>
                  <!-- Floating Step Number -->
                  <div class="absolute -top-3 -right-3 w-10 h-10 bg-[#1E1B4B] text-white rounded-2xl flex items-center justify-center text-xs font-black shadow-lg border-4 border-white z-30">
                    {step.number}
                  </div>
                </div>
              {/if}
            </div>

            <!-- Right Side Content -->
            <div class="flex-1 order-3 md:order-3 {i % 2 !== 0 ? 'md:pl-32 text-left' : 'md:invisible md:h-0'}">
              {#if visible}
                <div in:fly={{ x: 30, duration: 800, delay: 200, easing: cubicOut }}>
                  <h4 class="text-2xl md:text-3xl font-black text-[#1E1B4B] mb-6 tracking-tight group-hover:text-indigo-600 transition-colors">{step.title}</h4>
                  <p class="text-slate-500 font-medium leading-relaxed text-base md:text-lg">{step.description}</p>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Final CTA Area -->
    <div class="mt-40 text-center">
      {#if visible}
        <div in:fly={{ y: 30, duration: 800, delay: 800 }} class="space-y-12">
          <div class="inline-block p-1 bg-white rounded-[40px] shadow-2xl shadow-indigo-500/10 border border-slate-100">
            <button class="px-12 py-7 bg-[#1E1B4B] text-white rounded-[36px] font-black text-sm md:text-base hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-500 transform hover:-translate-y-1 active:scale-95 flex items-center gap-4">
              Start Your Journey Today
              <Icon name="arrow-right" size="20" />
            </button>
          </div>
          
          <div class="flex flex-wrap items-center justify-center gap-12 text-slate-400">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <Icon name="check" size="16" />
              </div>
              <span class="text-[10px] font-black uppercase tracking-[0.2em]">No Application Fee</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <Icon name="check" size="16" />
              </div>
              <span class="text-[10px] font-black uppercase tracking-[0.2em]">100% Digital Process</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <Icon name="check" size="16" />
              </div>
              <span class="text-[10px] font-black uppercase tracking-[0.2em]">Priority Support</span>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  /* Using global slim scrollbar */
</style>
