<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import Icon from '../../atoms/Icon.svelte';

  interface Institute {
    id: number;
    name: string;
    type: 'International' | 'National' | 'Private';
    location: string;
    coordinates: [number, number]; // [lng, lat]
    established: number;
    programs: string[];
    contact: string;
    address: string;
    subdomain?: string;
  }

  const institutes: Institute[] = [
    {
      id: 1,
      name: 'Lumina Jakarta Academy',
      type: 'International',
      location: 'Jakarta',
      coordinates: [106.8272, -6.1751],
      established: 2010,
      programs: ['IB Diploma', 'Cambridge IGCSE', 'Robotics'],
      contact: '+62 21 555 0123',
      address: 'Jl. Sudirman No. 45, Jakarta Pusat',
      subdomain: 'yadika-8' // Mapping to existing config for testing
    },
    {
      id: 2,
      name: 'Surabaya Elite School',
      type: 'Private',
      location: 'Surabaya',
      coordinates: [112.7521, -7.2575],
      established: 2015,
      programs: ['Advanced STEM', 'Arts & Design'],
      contact: '+62 31 777 0987',
      address: 'Pakuwon Indah Blok A2, Surabaya',
      subdomain: 'yadika-7'
    },
    {
      id: 3,
      name: 'Bandung Tech Institute',
      type: 'National',
      location: 'Bandung',
      coordinates: [107.6191, -6.9175],
      established: 2008,
      programs: ['Software Engineering', 'Green Energy'],
      contact: '+62 22 444 0555',
      address: 'Jl. Dago No. 102, Bandung'
    },
    {
      id: 4,
      name: 'Bali Visionary School',
      type: 'International',
      location: 'Bali',
      coordinates: [115.2167, -8.6500],
      established: 2018,
      programs: ['Sustainability', 'Hospitality Management'],
      contact: '+62 361 222 333',
      address: 'Jl. Raya Canggu No. 88, Bali'
    },
    {
      id: 5,
      name: 'Medan Prime Academy',
      type: 'Private',
      location: 'Medan',
      coordinates: [98.6722, 3.5952],
      established: 2012,
      programs: ['Business Excellence', 'Medical Science'],
      contact: '+62 61 999 000',
      address: 'Jl. Thamrin No. 12, Medan'
    },
    {
      id: 6,
      name: 'Makassar Global School',
      type: 'National',
      location: 'Makassar',
      coordinates: [119.4173, -5.1476],
      established: 2014,
      programs: ['Marine Biology', 'Public Speaking'],
      contact: '+62 411 888 777',
      address: 'Jl. Losari No. 5, Makassar'
    },
    {
      id: 7,
      name: 'Yogyakarta Heritage School',
      type: 'Private',
      location: 'Yogyakarta',
      coordinates: [110.3705, -7.7956],
      established: 2005,
      programs: ['Cultural Arts', 'Advanced Mathematics'],
      contact: '+62 274 666 555',
      address: 'Jl. Malioboro No. 20, Yogyakarta'
    },
    {
      id: 8,
      name: 'Semarang Future School',
      type: 'National',
      location: 'Semarang',
      coordinates: [110.4203, -6.9667],
      established: 2016,
      programs: ['Artificial Intelligence', 'Journalism'],
      contact: '+62 24 333 444',
      address: 'Jl. Pemuda No. 15, Semarang'
    },
    {
      id: 9,
      name: 'Palembang Elite Academy',
      type: 'Private',
      location: 'Palembang',
      coordinates: [104.7567, -2.9909],
      established: 2011,
      programs: ['Sports Management', 'Global Economy'],
      contact: '+62 711 555 666',
      address: 'Jl. Ampera No. 2, Palembang'
    },
    {
      id: 10,
      name: 'Balikpapan Energy School',
      type: 'International',
      location: 'Balikpapan',
      coordinates: [116.8289, -1.2654],
      established: 2019,
      programs: ['Geology', 'Data Science'],
      contact: '+62 542 444 888',
      address: 'Jl. Sudirman No. 99, Balikpapan'
    }
  ];

  let map: any = $state(null);
  let mapContainer: HTMLElement;
  let searchQuery = $state('');
  let selectedType = $state('All');
  let selectedLocation = $state('All');
  let selectedInstitute: Institute | null = $state(null);
  let isMapLoading = $state(true);
  let mapError = $state(false);

  const locations = ['All', ...new Set(institutes.map(i => i.location))].sort();
  const types = ['All', 'International', 'National', 'Private'];

  let filteredInstitutes = $derived(
    institutes.filter(inst => {
      const matchSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inst.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedType === 'All' || inst.type === selectedType;
      const matchLocation = selectedLocation === 'All' || inst.location === selectedLocation;
      return matchSearch && matchType && matchLocation;
    })
  );

  let markers: any[] = [];

  function updateMarkers() {
    // @ts-ignore
    if (!map || !window.maplibregl) return;
    
    // Clear existing markers
    markers.forEach(m => m.remove());
    markers = [];

    // Add new markers
    filteredInstitutes.forEach(inst => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `<div class="marker-pin ${inst.type.toLowerCase()}"></div>`;
      
      // @ts-ignore
      const marker = new window.maplibregl.Marker(el)
        .setLngLat(inst.coordinates)
        .addTo(map);

      el.addEventListener('click', () => {
        selectedInstitute = inst;
        if (map && typeof map.flyTo === 'function') {
          map.flyTo({
            center: inst.coordinates,
            zoom: 12,
            speed: 1.5,
            curve: 1.42
          });
        }
      });

      markers.push(marker);
    });

    // If only one result, fly to it
    if (filteredInstitutes.length === 1 && searchQuery !== '' && map && typeof map.flyTo === 'function') {
      map.flyTo({ center: filteredInstitutes[0].coordinates, zoom: 10 });
    }
  }

  $effect(() => {
    if (filteredInstitutes && !isMapLoading) {
      updateMarkers();
    }
  });

  onMount(() => {
    // Add style first
    if (!document.getElementById('maplibre-style')) {
      const link = document.createElement('link');
      link.id = 'maplibre-style';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/maplibre-gl@4.0.0/dist/maplibre-gl.css';
      document.head.appendChild(link);
    }

    // Add script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/maplibre-gl@4.0.0/dist/maplibre-gl.js';
    script.async = true;
    script.onload = () => {
      initializeMap();
    };
    script.onerror = () => {
      isMapLoading = false;
      mapError = true;
    };
    document.head.appendChild(script);
  });

  function initializeMap() {
    // @ts-ignore
    if (!window.maplibregl || !mapContainer) {
      isMapLoading = false;
      mapError = true;
      return;
    }

    try {
      // @ts-ignore
      map = new window.maplibregl.Map({
        container: mapContainer,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
        center: [118, -2], // Center of Indonesia
        zoom: 4.5,
        attributionControl: false
      });

      // @ts-ignore
      map.addControl(new window.maplibregl.NavigationControl(), 'bottom-right');

      map.on('load', () => {
        isMapLoading = false;
        updateMarkers();
      });

      map.on('error', () => {
        isMapLoading = false;
        mapError = true;
      });
    } catch (e) {
      console.error('Error initializing map:', e);
      isMapLoading = false;
      mapError = true;
    }
  }

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });

  function closeDetail() {
    selectedInstitute = null;
    if (map && !isMapLoading && typeof map.flyTo === 'function') {
      map.flyTo({
        center: [118, -2], // Reset to center of Indonesia
        zoom: 4.5,
        speed: 1.2,
        curve: 1
      });
    }
  }

  function handleInstituteClick(inst: Institute) {
    selectedInstitute = inst;
    if (map && !isMapLoading && typeof map.flyTo === 'function') {
      map.flyTo({ center: inst.coordinates, zoom: 12 });
    }
  }

  function goToSchoolWebsite(subdomain?: string) {
    if (!subdomain) return;
    
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    let targetUrl = '';
    
    if (parts[parts.length - 1] === 'localhost') {
      targetUrl = `http://${subdomain}.localhost:${window.location.port}`;
    } else if (parts.length >= 2) {
      // If we are on domain.com or sub.domain.com
      const baseDomain = parts.length === 2 ? hostname : parts.slice(-2).join('.');
      targetUrl = `https://${subdomain}.${baseDomain}`;
    } else {
      targetUrl = `https://${subdomain}.lumina.edu`; // Fallback
    }
    
    window.location.href = targetUrl;
  }
</script>

<section id="institutes-map" class="py-24 bg-slate-50 relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div class="max-w-2xl">
        <span class="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-4 bg-indigo-50 px-4 py-1.5 rounded-full inline-block">Global Presence</span>
        <h2 class="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6 tracking-tight">Find Our <span class="text-indigo-600">Institutes</span>.</h2>
        <p class="text-lg text-slate-500 font-medium leading-relaxed">
          Explore our network of world-class educational institutions across Indonesia. From international academies to specialized private schools.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
      <!-- Sidebar Filters -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-[600px] flex flex-col">
          <h4 class="text-sm font-black text-[#1E1B4B] uppercase tracking-wider mb-6">Search & Filter</h4>
          
          <div class="space-y-4 mb-6">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Search Institute</label>
              <div class="relative">
                <input 
                  type="text" 
                  bind:value={searchQuery}
                  placeholder="Type name or city..."
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="play" size="16" />
                </div>
              </div>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Institute Type</label>
              <select 
                bind:value={selectedType}
                class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {#each types as type}
                  <option value={type}>{type}</option>
                {/each}
              </select>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Location</label>
              <select 
                bind:value={selectedLocation}
                class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {#each locations as loc}
                  <option value={loc}>{loc}</option>
                {/each}
              </select>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-50 flex-grow flex flex-col overflow-hidden">
            <p class="text-xs font-bold text-slate-400 mb-4">Showing {filteredInstitutes.length} results</p>
            <div class="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {#each filteredInstitutes as inst}
                <button 
                  onclick={() => handleInstituteClick(inst)}
                  class="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <p class="text-sm font-bold text-[#1E1B4B] group-hover:text-indigo-600 transition-colors">{inst.name}</p>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{inst.location} • {inst.type}</p>
                </button>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Map Container -->
      <div class="lg:col-span-3 relative h-[600px] rounded-[40px] overflow-hidden shadow-2xl shadow-indigo-500/10 border border-white bg-slate-100">
        <div bind:this={mapContainer} class="w-full h-full"></div>

        <!-- Loading State -->
        {#if isMapLoading}
          <div class="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center gap-4 z-20" out:fade>
            <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm font-bold text-slate-500">Loading Map Resources...</p>
          </div>
        {/if}

        <!-- Error State -->
        {#if mapError}
          <div class="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-8 text-center z-20">
            <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
              <Icon name="close" size="32" />
            </div>
            <h4 class="text-lg font-black text-[#1E1B4B] mb-2">Oops! Map failed to load</h4>
            <p class="text-sm text-slate-500 max-w-xs mb-6">We're having trouble connecting to the map service. Please check your connection and try again.</p>
            <button 
              onclick={() => window.location.reload()}
              class="px-6 py-3 bg-[#1E1B4B] text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all"
            >
              Retry Loading
            </button>
          </div>
        {/if}

        <!-- Detail Overlay -->
        {#if selectedInstitute}
          <div 
            class="absolute inset-y-6 right-6 w-full max-w-sm z-30"
            transition:fly={{ x: 50, duration: 400 }}
          >
            <div class="bg-white h-full rounded-[32px] shadow-2xl border border-white flex flex-col overflow-hidden">
              <div class="relative h-40 bg-indigo-600 p-8 text-white">
                <button 
                  onclick={closeDetail}
                  class="absolute top-4 right-4 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon name="close" size="16" />
                </button>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">{selectedInstitute?.type}</span>
                <h3 class="text-xl font-black leading-tight">{selectedInstitute?.name}</h3>
              </div>
              
              <div class="flex-grow p-8 overflow-y-auto custom-scrollbar">
                <div class="space-y-6">
                  <div>
                    <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location & Contact</h5>
                    <p class="text-sm text-[#1E1B4B] font-bold mb-1">{selectedInstitute?.address}</p>
                    <p class="text-sm text-slate-500">{selectedInstitute?.contact}</p>
                  </div>

                  {#if selectedInstitute?.programs && (selectedInstitute?.programs?.length ?? 0) > 0}
                    <div>
                      <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Programs</h5>
                      <div class="flex flex-wrap gap-2">
                        {#each selectedInstitute?.programs ?? [] as program}
                          <span class="px-3 py-1 bg-slate-50 text-indigo-600 rounded-lg text-xs font-bold">{program}</span>
                        {/each}
                      </div>
                    </div>
                  {/if}

                  <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Established</h5>
                      <p class="text-lg font-black text-[#1E1B4B]">{selectedInstitute?.established}</p>
                    </div>
                    <div>
                      <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</h5>
                      <p class="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg inline-block">Active</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onclick={() => goToSchoolWebsite(selectedInstitute?.subdomain)}
                  class="w-full mt-8 py-4 bg-[#1E1B4B] text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedInstitute?.subdomain}
                >
                  Visit School Website
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  :global(.custom-marker) {
    cursor: pointer;
  }
  
  :global(.marker-pin) {
    width: 24px;
    height: 24px;
    border-radius: 50% 50% 50% 0;
    background: #4338CA;
    position: absolute;
    transform: rotate(-45deg);
    left: 50%;
    top: 50%;
    margin: -12px 0 0 -12px;
    box-shadow: 0 4px 10px rgba(67, 56, 202, 0.3);
    border: 3px solid white;
    transition: all 0.3s ease;
  }

  :global(.marker-pin:hover) {
    transform: rotate(-45deg) scale(1.2);
    z-index: 10;
  }

  :global(.marker-pin.international) { background: #4338CA; }
  :global(.marker-pin.national) { background: #059669; }
  :global(.marker-pin.private) { background: #D97706; }

  /* Using global slim scrollbar */
</style>
