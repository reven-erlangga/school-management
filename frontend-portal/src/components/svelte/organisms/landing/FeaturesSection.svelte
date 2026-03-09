<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import FeatureCard from "../../molecules/landing/FeatureCard.svelte";
  import Badge from "../../atoms/Badge.svelte";

  let visible = $state(false);
  let sectionElement: HTMLElement;

  const features = [
    {
      icon: "grad" as const,
      title: "Classical Values",
      description:
        "Our curriculum is built on time-tested principles that foster critical thinking and moral clarity.",
    },
    {
      icon: "check" as const,
      title: "Modern Tools",
      description:
        "We leverage the latest educational technology to enhance learning and administrative efficiency.",
    },
    {
      icon: "community" as const,
      title: "Strong Community",
      description:
        "A vibrant ecosystem of parents, teachers, and students working together for excellence.",
    },
    {
      icon: "excellence" as const,
      title: "Proven Results",
      description:
        "Consistent academic achievement and character development across all grade levels.",
    },
  ];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          visible = true;
        }
      },
      { threshold: 0.1 },
    );

    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => observer.disconnect();
  });
</script>

<section
  id="methodology"
  bind:this={sectionElement}
  class="py-24 bg-white relative overflow-hidden"
>
  <!-- Subtle Grid Background -->
  <div
    class="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
    style="background-image: radial-gradient(#4338CA 1px, transparent 1px); background-size: 40px 40px;"
  ></div>

  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center max-w-3xl mx-auto mb-20">
      {#if visible}
        <div in:fly={{ y: 20, duration: 800 }}>
          <Badge variant="secondary" class="mb-6">Our Methodology</Badge>
        </div>
        <h2
          class="text-4xl md:text-5xl font-black text-[#1E1B4B] mb-6 tracking-tight leading-tight"
          in:fly={{ y: 20, duration: 800, delay: 200 }}
        >
          A Holistic Approach to <br /> Modern Education<span
            class="text-[#4338CA]">.</span
          >
        </h2>
        <p
          class="text-lg text-[#64748B] font-medium leading-relaxed"
          in:fly={{ y: 20, duration: 800, delay: 400 }}
        >
          We believe that education should be as dynamic as the world we live
          in. Our unique blend of tradition and innovation ensures our students
          are always ahead.
        </p>
      {/if}
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#if visible}
        {#each features as feature, i}
          <div in:fly={{ y: 40, duration: 800, delay: 600 + i * 100 }}>
            <FeatureCard
              {...feature}
              class="hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
            />
          </div>
        {/each}
      {/if}
    </div>
  </div>
</section>
