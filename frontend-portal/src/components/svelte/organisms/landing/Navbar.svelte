<script lang="ts">
  import { onMount } from 'svelte';
  import NavLink from '../../molecules/common/NavLink.svelte';
  import Button from '../../atoms/Button.svelte';
  import Icon from '../../atoms/Icon.svelte';
  import { branding, updateBranding } from '../../../../store/branding';
  import { currentSchoolBranding, updateSubdomain } from '../../../../store/subdomain';

  let activeSection = $state('home');
  let isScrolled = $state(false);
  let isDarkSection = $derived(activeSection === 'academic');

  const mainNavItems = [
    { label: 'Home', id: 'home' },
    { label: 'Methodology', id: 'methodology' },
    { label: 'Campus Life', id: 'campus' },
    { label: 'About', id: 'about' }
  ];

  const instituteNavItems = [
    { label: 'Beranda', id: 'home' },
    { label: 'Prodi', id: 'programs' },
    { label: 'Akademik', id: 'academic' },
    { label: 'Kemahasiswaan', id: 'students' },
    { label: 'Fasilitas', id: 'facilities' },
    { label: 'Tentang', id: 'about-campus' },
    { label: 'Kontak', id: 'contact' }
  ];

  let navItems = $derived($currentSchoolBranding ? instituteNavItems : mainNavItems);

  onMount(() => {
    updateSubdomain();
    
    const initBranding = async () => {
      try {
        await updateBranding();
      } catch (e) {
        console.error('Failed to load branding:', e);
      }
    };
    
    initBranding();
    
    // Check for hash on load for deep linking
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => scrollToSection(id), 500);
    }

    const handleScroll = () => {
      isScrolled = window.scrollY > 50;
      const scrollPosition = window.scrollY + 120;
      
      let currentSection = 'home';
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          if (scrollPosition >= element.offsetTop) {
            currentSection = item.id;
          }
        }
      }
      activeSection = currentSection;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update hash without jumping
      history.pushState(null, '', `#${id}`);
      activeSection = id;
    }
  };

  const goMainSite = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    let mainUrl = '';
    
    if (parts[parts.length - 1] === 'localhost') {
      mainUrl = `http://localhost:${window.location.port}`;
    } else if (parts.length >= 3) {
      mainUrl = `https://${parts.slice(1).join('.')}`;
    } else {
      mainUrl = '/';
    }
    window.location.href = mainUrl;
  };
</script>

<header class="fixed top-6 left-0 w-full z-[200] px-6">
  <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
    <!-- 1. BACK MODULE -->
    {#if $currentSchoolBranding}
      <Button 
        onclick={goMainSite}
        variant="ghost"
        class="h-20 px-6 backdrop-blur-xl border shadow-[0_8px_32px_-4px_rgba(0,0,0,0.08)] rounded-[32px] flex items-center gap-3 transition-all duration-500 group shrink-0
               {isDarkSection ? 'bg-[#1E1B4B] border-white/10 text-white' : 'bg-white/80 border-white/40 text-[#1E1B4B]'}"
        title="Back to Main Site"
      >
        <Icon name="arrow-left" size="20" class="group-hover:-translate-x-1 transition-transform" />
        <span class="text-xs font-black uppercase tracking-widest hidden sm:inline">Main Site</span>
      </Button>
    {/if}

    <!-- 2. NAVBAR MODULE (LOGO + MENU) -->
    <div class="flex-grow lg:flex-initial h-20 backdrop-blur-xl border shadow-[0_8px_32px_-4px_rgba(0,0,0,0.08)] rounded-[32px] px-6 flex items-center gap-8 transition-all duration-500 overflow-hidden
                {isDarkSection ? 'bg-[#1E1B4B] border-white/10' : 'bg-white/80 border-white/40'}">
      <!-- Logo Section -->
      <div class="flex items-center shrink-0">
        <Button 
          onclick={() => scrollToSection('home')} 
          variant="ghost"
          class="flex items-center gap-3 group cursor-pointer h-auto p-0 hover:bg-transparent"
        >
          {#if $currentSchoolBranding?.logo || $branding.appIcon}
            <img src={$currentSchoolBranding?.logo || $branding.appIcon} alt="Logo" class="w-10 h-10 rounded-xl object-cover group-hover:scale-110 transition-transform shadow-sm" />
          {:else}
            <div class="w-10 h-10 bg-[#1E1B4B] rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform" style={$currentSchoolBranding ? `background-color: ${isDarkSection ? $currentSchoolBranding.secondaryColor : $currentSchoolBranding.primaryColor}` : ''}>
              <Icon name="grad" size="24" />
            </div>
          {/if}
          
          <span class="text-xl font-bold tracking-tight whitespace-nowrap transition-colors duration-500 {isDarkSection ? 'text-white' : 'text-[#1E1B4B]'}">
            {#if $currentSchoolBranding}
              {$currentSchoolBranding.name}<span style={`color: ${isDarkSection ? 'white' : $currentSchoolBranding.secondaryColor}`}>.sch</span>
            {:else if ($branding.foundationName || '').trim().includes(' ')}
              {@const parts = ($branding.foundationName || '').trim().split(' ')}
              {parts[0]}<span class={isDarkSection ? 'text-white' : 'text-[#4338CA]'}>{parts.slice(1).join(' ')}</span>
            {:else}
              {$branding.foundationName || 'Lumina'}<span class={isDarkSection ? 'text-white' : 'text-[#4338CA]'}>.edu</span>
            {/if}
          </span>
        </Button>
      </div>

      <!-- Divider (Only if Subdomain) -->
      {#if $currentSchoolBranding}
        <div class="w-px h-8 hidden lg:block transition-colors duration-500 {isDarkSection ? 'bg-white/10' : 'bg-slate-200'}"></div>
      {/if}

      <!-- Menu Items: Optimized spacing to prevent scroll -->
      <nav class="hidden lg:flex items-center gap-1 xl:gap-4 overflow-hidden py-2">
        {#each navItems as item}
          <Button 
            onclick={() => scrollToSection(item.id)} 
            variant="ghost"
            class="bg-transparent border-none p-0 shrink-0 hover:bg-transparent"
          >
            <NavLink href="#{item.id}" active={activeSection === item.id} class="text-[13px] xl:text-sm px-2 xl:px-3 transition-colors duration-500 {isDarkSection ? (activeSection === item.id ? 'text-white' : 'text-white/60 hover:text-white') : ''}">
              {item.label}
            </NavLink>
          </Button>
        {/each}
      </nav>
    </div>

    <!-- 3. LOGIN MODULE (ICON BUTTON ONLY) -->
    <Button 
      variant="outline"
      class="w-14 h-14 rounded-[24px] flex items-center justify-center transition-all duration-500 shadow-xl active:scale-95 group shrink-0 border
             {isDarkSection ? 'bg-[#1E1B4B] text-white border-white/10 shadow-indigo-500/20' : 'bg-white/80 text-[#1E1B4B] border-white/40 shadow-black/5 hover:bg-slate-50'}"
      title="Portal Login"
    >
      <Icon name="user" size="22" class="group-hover:scale-110 transition-transform" />
    </Button>
  </div>
</header>
