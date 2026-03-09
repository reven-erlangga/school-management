<script lang="ts">
  import Icon from '../../atoms/Icon.svelte';

  const institutes = [
    { name: 'Global Academy', logo: 'grad' },
    { name: 'Elite Institute', logo: 'excellence' },
    { name: 'Future Tech', logo: 'community' },
    { name: 'Unity School', logo: 'check' },
    { name: 'Visionary Uni', logo: 'grad' },
    { name: 'Prime Academy', logo: 'excellence' },
    { name: 'Apex Learning', logo: 'community' },
    { name: 'Nova Institute', logo: 'check' }
  ];

  // Duplicate the list multiple times to ensure enough width for the marquee
  const doubleInstitutes = [...institutes, ...institutes, ...institutes, ...institutes];
</script>

<section class="py-16 bg-white overflow-hidden">
  <div class="max-w-7xl mx-auto px-6 mb-16">
    <div class="flex flex-col items-center text-center">
      <span class="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-4 bg-indigo-50/50 px-4 py-1.5 rounded-full">Partnership</span>
      <h2 class="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6 tracking-tight">Our <span class="text-indigo-600">Institutes</span>.</h2>
      <p class="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
        Collaborating with world-class educational institutions to provide the best learning experience for our students.
      </p>
    </div>
  </div>

  <div class="relative group/marquee">
    <!-- Overlay for fading edges with opacity gradient -->
    <div class="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
    <div class="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

    <!-- Scrolling Container -->
    <div class="flex overflow-hidden">
      <div class="flex animate-marquee group-hover/marquee:pause gap-24 py-4 items-center">
        {#each doubleInstitutes as inst, i}
          <div class="flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 hover:scale-125 cursor-pointer shrink-0">
            <div class="flex items-center gap-3">
              <Icon name={inst.logo as any} size="32" />
              <span class="text-xl font-bold tracking-tight text-slate-900">{inst.name.split(' ')[0]}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-25%); }
  }

  .animate-marquee {
    animation: marquee 40s linear infinite;
    width: fit-content;
  }

  .pause {
    animation-play-state: paused;
  }
</style>
