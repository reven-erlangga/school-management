<script lang="ts">
  import AdminTemplate from "@components/svelte/templates/AdminTemplate.svelte";
  import Icon from "@components/svelte/atoms/Icon.svelte";
  import { availableModules } from "@store/rbac";
  import QuickAnnouncement from "@components/svelte/molecules/QuickAnnouncement.svelte";
  import AuditDrawer from "@components/svelte/molecules/AuditDrawer.svelte";
  import PillTab from "@components/svelte/molecules/common/PillTab.svelte";
  import GreetingText from "@components/svelte/molecules/GreetingText.svelte";
  import DynamicChartLoader from "@components/svelte/molecules/DynamicChartLoader.svelte";

  // Get dynamic dashboard metadata from store
  const dashboardModule = $derived(
    $availableModules.find((m) => m.slug === "dashboard"),
  );
  const meta = $derived(dashboardModule?.meta || null);

  // Dynamic Charts & Stats
  const dynamicCharts = $derived(meta?.chart || []);
  const statCards = $derived(dynamicCharts.filter((c: any) => c.type === "stat-cards"));
  const mainCharts = $derived(dynamicCharts.filter((c: any) => c.type !== "stat-cards"));

  // Audit Drawer State
  let isAuditOpen = $state(false);
  const toggleAudit = () => (isAuditOpen = !isAuditOpen);

  // Unit Tabs
  let activeUnit = $state("Select All");
  const unitTabs = [
    { id: "Select All", label: "Select All" },
    { id: "SMA", label: "SMA" },
    { id: "SMP", label: "SMP" },
    { id: "SD", label: "SD" },
    { id: "TK", label: "TK" },
  ];
</script>

<AdminTemplate title="Dashboard" activePath="/admin/dashboard">
  <div class="space-y-8 py-6 max-w-[1600px] mx-auto">
    <!-- Header Welcome Area -->
    <div
      class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1"
    >
      <GreetingText name="Serah Lovegood" notificationCount={2} />

      <!-- Unit Filters -->
      <PillTab
        tabs={unitTabs}
        activeTabId={activeUnit}
        onTabChange={(id) => (activeUnit = id)}
      >
        <button
          class="flex items-center gap-2.5 px-4 py-2 text-slate-600 font-bold text-[12px] hover:bg-white/50 rounded-xl transition-all border border-transparent hover:border-slate-100 cursor-pointer"
        >
          Date
          <Icon name="community" size="14" class="opacity-60" />
        </button>
      </PillTab>
    </div>

    <!-- Stat Cards Section -->
    {#each statCards as chart}
      <DynamicChartLoader config={chart} />
    {/each}

    <!-- Main Charts Section (Dynamic from Meta) -->
    <div class="grid lg:grid-cols-2 gap-6">
      {#each mainCharts as chart}
        <DynamicChartLoader config={chart} />
      {/each}
    </div>
  </div>

  <QuickAnnouncement />
  <AuditDrawer isOpen={isAuditOpen} onToggle={toggleAudit} />
</AdminTemplate>
