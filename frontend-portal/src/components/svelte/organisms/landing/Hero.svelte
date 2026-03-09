<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import Button from '../../atoms/Button.svelte';
  import Badge from '../../atoms/Badge.svelte';
  import Icon from '../../atoms/Icon.svelte';
  import Avatar from '../../atoms/Avatar.svelte';
  import StatBadge from '../../molecules/common/StatBadge.svelte';
  import VirtualTourModal from '../../molecules/landing/VirtualTourModal.svelte';
  import { branding } from '../../../../store/branding';
  import { currentSchoolBranding } from '../../../../store/subdomain';

  let visible = $state(false);
  let isVirtualTourOpen = $state(false);

  const heroImages = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000'
  ];

  let activeIndex = $state(0);
  let interval: any;

  let isShuffling = $state(false);

  function rotateCarousel() {
    if (isShuffling) return;
    isShuffling = true;
    
    // Quick "move up" phase
    setTimeout(() => {
      // The moment activeIndex changes, the old front card's diff becomes (length-1)
      // and its z-index instantly drops to 1, putting it behind the others.
      activeIndex = (activeIndex + 1) % heroImages.length;
      isShuffling = false;
    }, 350); 
  }

  onMount(() => {
    visible = true;
    interval = setInterval(rotateCarousel, 4000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });

  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
  ];

  function shuffleTransition(node: HTMLElement, { duration = 800, delay = 0 }) {
    return {
      duration,
      delay,
      css: (t: number) => {
        const eased = (t: number) => t * t * t * (t * (t * 6 - 15) + 10); // quintOut approx
        const v = eased(t);
        return `
          opacity: ${v};
          transform: translateY(${(1 - v) * 50}px) scale(${0.9 + v * 0.1});
        `;
      }
    };
  }
</script>

<section id="home" class="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center bg-[#F8FAFC]">
  <!-- Background Accents -->
  <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent -z-10"></div>
  <div class="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

  <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
    <!-- Content Column -->
    {#if visible}
      <div class="relative z-10">
        <div in:fly={{ y: 20, duration: 800, delay: 200 }}>
          <Badge variant="primary" class="mb-8 px-4 py-1.5">
            <span class="w-2 h-2 rounded-full bg-[#4338CA] mr-2 inline-block"></span>
            Admissions Open for 2024
          </Badge>
        </div>
        
        <h1 
          class="text-6xl md:text-8xl font-black text-[#1E1B4B] leading-[1.05] tracking-tight mb-8"
          in:fly={{ y: 30, duration: 800, delay: 400 }}
        >
          {#if $currentSchoolBranding}
            {@const parts = ($currentSchoolBranding.fullName || '').trim().split(' ')}
            {parts[0]} <span style={`color: ${$currentSchoolBranding.primaryColor}`}>{parts.slice(1).join(' ')}</span>
          {:else if ($branding.foundationName || '').trim().includes(' ')}
            {@const parts = ($branding.foundationName || '').trim().split(' ')}
            {parts[0]} <span class="text-[#4338CA]">{parts.slice(1).join(' ')}</span>
          {:else}
            Cultivating <br />
            <span class="text-[#4338CA]">Curiosity</span> & <br />
            Character<span class="text-[#4338CA]">.</span>
          {/if}
        </h1>
        
        <p 
          class="text-xl text-[#64748B] max-w-lg mb-12 leading-relaxed font-medium"
          in:fly={{ y: 20, duration: 800, delay: 600 }}
        >
          {$branding.appName || 'Lumina Academy'} blends classical educational values with cutting-edge technology to prepare students for a rapidly evolving world.
        </p>

        <div class="flex flex-wrap gap-6 mb-12" in:fly={{ y: 20, duration: 800, delay: 800 }}>
          <Button variant="primary" size="lg" class="group gap-2 shadow-2xl shadow-indigo-500/30 hover:-translate-y-1">
            Apply for 2024
            <Icon name="grad" size="20" class="group-hover:rotate-12 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            class="group gap-2 hover:-translate-y-1"
            onclick={() => isVirtualTourOpen = true}
          >
            Virtual Tour
            <Icon name="play" size="20" class="text-[#4338CA]" />
          </Button>
        </div>

        <div class="flex items-center gap-6" in:fade={{ duration: 1000, delay: 1000 }}>
          <div class="flex -space-x-3">
            {#each avatars as src, i}
              <div in:scale={{ duration: 500, delay: 1200 + (i * 100) }}>
                <Avatar {src} size="md" class="border-4 border-white shadow-lg" />
              </div>
            {/each}
          </div>
          <div class="h-10 w-px bg-[#E2E8F0]"></div>
          <div>
            <div class="flex gap-1 text-amber-400 mb-1">
              {#each Array(5) as _}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              {/each}
            </div>
            <p class="text-xs font-bold text-[#64748B] uppercase tracking-wider">Trusted by 2,000+ families</p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Image Column (Shuffle Carousel Section) -->
    <div class="relative h-[450px] lg:h-[550px] flex items-center justify-center perspective-1000">
      {#if visible}
        <div class="relative w-full max-w-[400px] lg:max-w-[500px] aspect-[4/3]">
          {#each heroImages as src, i}
            {@const diff = (i - activeIndex + heroImages.length) % heroImages.length}
            {@const isFront = diff === 0}
            <div 
              class="absolute inset-0 transition-all duration-500 ease-in-out card-item"
              class:shuffling-out={isFront && isShuffling}
              style="
                z-index: {isFront && isShuffling ? 50 : heroImages.length - diff};
                transform: 
                  rotate({isFront && isShuffling ? '-8deg' : diff * 6 + 'deg'}) 
                  translate({isFront && isShuffling ? '-30px, -140px' : diff * 25 + 'px, ' + diff * 15 + 'px'})
                  scale({isFront && isShuffling ? 1.05 : 1 - diff * 0.06});
                opacity: {isFront && isShuffling ? 0.8 : 1 - diff * 0.25};
                width: 100%;
                height: 100%;
              "
            >
              <div class="w-full h-full rounded-[40px] lg:rounded-[60px] overflow-hidden shadow-2xl border-4 border-white relative group">
                <img 
                  {src} 
                  alt="Lumina Academy Students" 
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-transparent opacity-60"></div>
              </div>
            </div>
          {/each}

          <!-- Floating Stat Cards (Higher Z-Index) -->
          <div 
            class="absolute -top-10 -right-4 lg:-right-8 z-[100] animate-float"
            in:fly={{ x: 30, duration: 800, delay: 1000 }}
          >
            <StatBadge 
              icon="excellence" 
              title="Excellence" 
              subtitle="100% University Acceptance" 
              class="origin-top-right scale-90 lg:scale-100"
            />
          </div>
          
          <div 
            class="absolute -bottom-12 -left-4 lg:-left-12 z-[100] animate-float-delayed"
            in:fly={{ x: -30, duration: 800, delay: 1200 }}
          >
            <StatBadge 
              icon="community" 
              title="Community" 
              subtitle="45+ Nationalities" 
              class="scale-90 lg:scale-100"
            />
          </div>

          <!-- Carousel Indicators -->
          <div class="absolute -bottom-24 left-1/2 -translate-x-1/2 flex gap-3 z-[100]">
            {#each heroImages as _, i}
              <button 
                onclick={() => {
                  if (activeIndex !== i) {
                    isShuffling = true;
                    setTimeout(() => {
                      activeIndex = i;
                      isShuffling = false;
                    }, 500);
                  }
                }}
                class="w-3 h-3 rounded-full transition-all duration-500 {activeIndex === i ? 'bg-[#4338CA] w-8' : 'bg-[#CBD5E1] hover:bg-indigo-300'}"
              ></button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Decorative Elements -->
      <div class="absolute -z-10 -bottom-12 -right-12 w-48 h-48 border-[16px] border-[#EEF2FF] rounded-[40px] animate-spin-slow opacity-50"></div>
    </div>
  </div>
</section>

<VirtualTourModal 
  isOpen={isVirtualTourOpen} 
  onClose={() => isVirtualTourOpen = false} 
/>

<style>
  .perspective-1000 {
    perspective: 1000px;
  }

  .card-item {
    backface-visibility: hidden;
    will-change: transform, opacity;
    transition: 
      transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
      opacity 0.4s ease-out,
      z-index 0s;
  }

  /* When a card is moving back, delay the opacity change so it moves behind FIRST while still visible */
  .card-item:not(.shuffling-out) {
    transition: 
      transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.5s ease-out 0.2s,
      z-index 0s;
  }

  .shuffling-out {
    z-index: 100 !important;
    pointer-events: none;
    transition: 
      transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
      opacity 0.3s ease-out;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
</style>
