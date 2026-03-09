<script lang="ts">
  import Navbar from "../organisms/landing/Navbar.svelte";
  import Hero from "../organisms/landing/Hero.svelte";
  import InstituteMarquee from "../organisms/landing/InstituteMarquee.svelte";
  import InstituteMap from "../organisms/landing/InstituteMap.svelte";
  import HowToApply from "../organisms/landing/HowToApply.svelte";
  import FeaturesSection from "../organisms/landing/FeaturesSection.svelte";
  import TestimonialCarousel from "../organisms/landing/TestimonialCarousel.svelte";
  import Footer from "../organisms/common/Footer.svelte";
  import ChatFloatingActions from "../molecules/landing/ChatFloatingActions.svelte";
  import Icon from "../atoms/Icon.svelte";
  import {
    currentSchoolBranding,
    isSubdomainValid,
    updateSubdomain,
  } from "../../../store/subdomain";
  import { onMount } from "svelte";

  onMount(() => {
    updateSubdomain();
  });
</script>

<div class="min-h-screen selection:bg-[#C7D2FE] selection:text-[#1E1B4B]">
  {#if !$isSubdomainValid}
    <div
      class="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center p-6 text-center"
    >
      <div
        class="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-8"
      >
        <Icon name="close" size="40" />
      </div>
      <h1 class="text-3xl font-black text-[#1E1B4B] mb-4">School Not Found</h1>
      <p class="text-slate-500 max-w-md mb-10 leading-relaxed">
        The school you are looking for doesn't exist or hasn't been registered
        in our system yet.
      </p>
      <a
        href="/"
        class="px-10 py-4 bg-[#1E1B4B] text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20"
      >
        Back to Main Website
      </a>
    </div>
  {:else}
    <Navbar />
    <main>
      <Hero />
      <InstituteMarquee />
      <FeaturesSection />
      <TestimonialCarousel />
      <InstituteMap />
      <HowToApply />
      <ChatFloatingActions />
    </main>
    <Footer />
  {/if}
</div>
