<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Icon from '../../atoms/Icon.svelte';
  import DynamicForm from '../../molecules/common/DynamicForm.svelte';

  interface Props {
    title: string;
    slug: string;
    activeTabId: string;
    currentMeta: any;
    currentModule: any;
    activeSubModule: any;
  }

  let { 
    title, 
    slug, 
    activeTabId, 
    currentMeta, 
    currentModule, 
    activeSubModule 
  }: Props = $props();

  let settingData = $state<Record<string, any>>({});
  let isLoading = $state(false);

  const fetchSettingData = async () => {
    isLoading = true;
    const apiUrl = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";
    // Use the 'fetch' property from currentMeta.form if available, 
    // otherwise fallback to hardcoded pattern
    const endpoint = currentMeta?.form?.fetch || `/settings/${activeTabId === "overview" ? "overview" : activeTabId}`;
    
    try {
      const res = await fetch(`${apiUrl}${endpoint}`);
      if (res.ok) {
        settingData = await res.json();
      }
    } catch (e) {
      console.error(`Failed to fetch settings:`, e);
    } finally {
      isLoading = false;
    }
  };

  const handleSettingSubmit = async (values: Record<string, any>) => {
    const apiUrl = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";
    const group = activeTabId === "overview" ? "overview" : activeTabId;

    try {
      // Use the generic /settings endpoint for saving
      const res = await fetch(`${apiUrl}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group, settings: values }),
      });

      if (res.ok) {
        await fetchSettingData();
        if (group === "overview" && slug === "settings") {
          import("../../../../store/branding").then(({ updateBranding }) =>
            updateBranding(),
          );
        }
      }
    } catch (e) {
      console.error(`Failed to update settings for ${group}:`, e);
    }
  };

  onMount(() => {
    fetchSettingData();
  });

  // Re-fetch if tab changes
  $effect(() => {
    activeTabId;
    fetchSettingData();
  });
</script>

<div class="space-y-6" in:fade={{ duration: 400 }}>
  <div class="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-10">
    {#if isLoading}
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="mt-4 text-slate-500 font-medium">Loading settings...</p>
      </div>
    {:else if currentMeta?.form}
      <DynamicForm
        config={currentMeta.form}
        isStandalone={true}
        initialData={settingData}
        onSubmit={handleSettingSubmit}
      />
    {:else}
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <Icon name="close" size="40" class="text-slate-300 mb-4" />
        <p class="text-slate-500 font-medium">No configuration form found for this section.</p>
      </div>
    {/if}
  </div>
</div>
