<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import TestimonialCard from '../../molecules/landing/TestimonialCard.svelte';
  import Badge from '../../atoms/Badge.svelte';

  const testimonials = [
    {
      quote: "Lumina has completely changed the way I look at education. The community is incredibly supportive and the values they teach are for a lifetime.",
      author: "Sarah Johnson",
      role: "Class of 2023",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
    },
    {
      quote: "The virtual tour gave us a real sense of the campus culture. We knew right away this was the place for our daughter's growth.",
      author: "David Chen",
      role: "Parent",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
    }
  ];

  let activeIndex = $state(0);
  let visible = $state(false);
  let sectionElement: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        visible = true;
      }
    }, { threshold: 0.1 });

    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => observer.disconnect();
  });
</script>

<section id="campus" bind:this={sectionElement} class="py-24 bg-white">
  <div class="max-w-5xl mx-auto px-6">
    <div class="text-center mb-16">
      {#if visible}
        <div in:fly={{ y: 20, duration: 800 }}>
          <Badge variant="primary" class="mb-4">Testimonials</Badge>
        </div>
        <h2 
          class="text-4xl font-black text-[#1E293B] tracking-tight"
          in:fly={{ y: 20, duration: 800, delay: 200 }}
        >
          Voices of Our Community<span class="text-[#4338CA]">.</span>
        </h2>
      {/if}
    </div>

    {#if visible}
      <div class="relative group" in:fade={{ duration: 1000, delay: 400 }}>
        {#each testimonials as t, i}
          {#if activeIndex === i}
            <div class="animate-in fade-in slide-in-from-right-10 duration-700">
              <TestimonialCard {...t} />
            </div>
          {/if}
        {/each}

        <!-- Custom Navigation Dots -->
        <div class="flex justify-center gap-3 mt-10">
          {#each testimonials as _, i}
            <button 
              onclick={() => activeIndex = i}
              class="h-2 rounded-full transition-all duration-300 
                     {activeIndex === i ? 'w-8 bg-[#4338CA]' : 'w-2 bg-[#E2E8F0] hover:bg-[#C7D2FE]'}"
            ></button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>
