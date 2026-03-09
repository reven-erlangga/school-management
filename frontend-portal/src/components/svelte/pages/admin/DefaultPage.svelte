<script lang="ts">
  import { untrack } from "svelte";
  import AdminTemplate from "../../templates/AdminTemplate.svelte";
  import Icon from "../../atoms/Icon.svelte";
  import Button from "../../atoms/Button.svelte";
  import TextField from "../../atoms/TextField.svelte";
  import { fade, fly } from "svelte/transition";
  import AdminTabs from "../../molecules/common/AdminTabs.svelte";
  import PillTab from "../../molecules/common/PillTab.svelte";
  import {
    availableModules,
    rbacUser,
    hasPermission,
  } from "@store/rbac";
  import { translations } from "@store/tolgee.store";
  import { t } from "@utils/translation.util";
  import MonitoringPageContent from "./MonitoringPage.svelte";
  import ChartRenderer from "../../molecules/common/ChartRenderer.svelte";
  import FilterModal from "../../molecules/common/FilterModal.svelte";
  import DynamicForm from "../../molecules/common/DynamicForm.svelte";
  import Pagination from "../../molecules/common/Pagination.svelte";
  import FilterButton from "../../molecules/common/FilterButton.svelte";
  import DataTable from "../../organisms/common/DataTable.svelte";
  import DirectPage from "./DirectPage.svelte";

  interface Props {
    slug: string;
    title: string;
  }

  let { slug, title }: Props = $props();

  let items = $state<any[]>([]);
  let isLoading = $state(true);
  let activeFilters = $state<Record<string, any>>({});
  let pagination = $state({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });

  const fetchItems = async () => {
    isLoading = true;
    const apiUrl = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";
    try {
      const endpoint = slug === "institutes" ? "institutes" : slug;
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...activeFilters,
      });

      const res = await fetch(`${apiUrl}/${endpoint}?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          items = data.items;
          // Update pagination meta individually to avoid replacing the whole object
          pagination.total = data.meta.total;
          pagination.totalPages = data.meta.totalPages;
        } else {
          items = data;
        }
      }
    } catch (e) {
      console.error(`Failed to fetch ${slug}:`, e);
    } finally {
      isLoading = false;
    }
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    activeFilters = filters;
    pagination.page = 1; // Reset to first page when filtering
    // fetchItems() will be triggered by $effect
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      pagination.page--;
      // fetchItems() will be triggered by $effect
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      pagination.page++;
      // fetchItems() will be triggered by $effect
    }
  };

  const goToPage = (p: number) => {
    if (p >= 1 && p <= pagination.totalPages) {
      pagination.page = p;
    }
  };

  const handleLimitChange = (newLimit: number) => {
    pagination.limit = newLimit;
    pagination.page = 1;
  };

  $effect(() => {
    // These are our dependencies - any change to them will trigger the effect
    const _slug = slug;
    const _page = pagination.page;
    const _limit = pagination.limit;
    const _filters = activeFilters;
    const _modules = $availableModules; // Explicitly depend on modules

    untrack(() => {
      if (!currentModule) return; // Don't run if module data isn't ready

      let meta;
      try {
        meta = currentMeta;
      } catch (e) {
        meta = {};
      }

      // ONLY fetch a list of items if the module's main view IS NOT a direct form.
      if (currentModule?.page === "direct" || (meta.form && meta.form.type === "direct")) {
        // This is a settings-like page. Do nothing.
        // The effect for `fetchSettingData` will handle it.
      } else {
        fetchItems();
      }
    });
  });

  // Find module and its sub-modules
  let currentModule = $derived($availableModules.find((m) => m.slug === slug));
  let isMonitoringPage = $derived(currentModule?.page === "monitoring");
  let subModules = $derived(currentModule?.subModules || []);

  // Tabs logic
  let tabs = $derived(
    subModules.length > 0
      ? [
          { id: "overview", label: "Overview" },
          ...subModules.map((sm) => ({ id: sm.slug, label: sm.name })),
        ]
      : [],
  );

  let activeTabId = $state("overview");
  let activeSubModule = $derived(
    subModules.find((sm) => sm.slug === activeTabId),
  );

  // Meta logic (Filter & Chart)
  let currentMeta = $derived.by(() => {
    // 1. Get raw meta from either the sub-module or the parent module
    let rawMeta =
      activeTabId === "overview" ? currentModule?.meta : activeSubModule?.meta;

    // 2. If no meta found yet, check if parent meta has sub-module info (optional fallback)
    if (!rawMeta && activeTabId !== "overview" && currentModule?.meta) {
      try {
        const parentMeta =
          typeof currentModule.meta === "string"
            ? JSON.parse(currentModule.meta)
            : currentModule.meta;
        if (parentMeta?.subModules?.[activeTabId]) {
          rawMeta = parentMeta.subModules[activeTabId];
        }
      } catch (e) {}
    }

    if (!rawMeta) {
      console.log(
        `[PageContainer] No meta found for activeTabId: ${activeTabId}`,
      );
      return { filter: [], chart: [], form: null };
    }

    // 3. Parse and normalize meta
    try {
      const parsed = typeof rawMeta === "string" ? JSON.parse(rawMeta) : rawMeta;

      // 4. Look for a form in the new 'forms' array if not found in meta
      let form = parsed.form || null;
      if (!form) {
        let moduleForms: any[] =
          activeTabId === "overview"
            ? (currentModule?.forms as any)
            : (activeSubModule?.forms as any);

        if (moduleForms && typeof moduleForms === "string") {
          try {
            moduleForms = JSON.parse(moduleForms);
          } catch (e) {
            moduleForms = [];
          }
        }

        if (moduleForms && Array.isArray(moduleForms)) {
          // Default to the CREATE or CREATE_OR_UPDATE form for the main view
          form =
            moduleForms.find(
              (f: any) =>
                f.handler === "create" || f.handler === "create_or_update",
            ) || null;
        }
      }

      // Ensure we explicitly return the form property
      return {
        filter: parsed.filter || [],
        chart: parsed.chart || [],
        form: form,
        detailConfig: parsed.detailConfig || null,
      };
    } catch (e) {
      console.error("Failed to parse meta:", e);
      return { filter: [], chart: [], form: null, detailConfig: null };
    }
  });

  const handleTabChange = (id: string) => {
    activeTabId = id;
  };

  // View state for detail
  let selectedItem = $state<any>(null);
  let activeDetailTab = $state("overview");

  const handleRowClick = (item: any) => {
    const canShow = hasPermission(`${slug}.view`, $rbacUser);
    if (canShow && currentMeta.detailConfig) {
      selectedItem = item;
      activeDetailTab = "overview";
    }
  };

  const closeDetail = () => {
    selectedItem = null;
  };

  // Split charts into cards (left) and actual charts (right)
  let cards = $derived(
    currentMeta.chart?.filter((c: any) => c.type === "card") || [],
  );
  let actualCharts = $derived(
    currentMeta.chart?.filter((c: any) => c.type !== "card") || [],
  );

  // Check if current view is a full-page form
  let isFullPageForm = $derived(
    (currentMeta.form?.type === "page" && activeTabId !== "overview") ||
      currentMeta.form?.type === "direct" ||
      currentModule?.page === "direct" ||
      activeSubModule?.page === "direct",
  );
  let settingData = $state<Record<string, any>>({});

  const fetchSettingData = async () => {
    if (!isFullPageForm) return;

    const apiUrl = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";
    const group = activeTabId.replace("settings-", "");
    try {
      const res = await fetch(`${apiUrl}/settings/${group}`);
      if (res.ok) {
        settingData = await res.json();
      }
    } catch (e) {
      console.error(`Failed to fetch settings for ${group}:`, e);
    }
  };

  const handleSettingSubmit = async (values: Record<string, any>) => {
    const endpoint = currentMeta.form?.jsonEndpoint;
    if (!endpoint) {
      console.error("No jsonEndpoint configured for this form.");
      return;
    }

    const apiUrl = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";
    const group = activeTabId.replace("settings-", "");

    try {
      const res = await fetch(`${apiUrl}${endpoint.route}`, {
        method: endpoint.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group, settings: values }),
      });

      if (res.ok) {
        // Refresh settings data after successful update
        await fetchSettingData();
        // Trigger branding update if it was overview
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

  $effect(() => {
    if (isFullPageForm) {
      fetchSettingData();
    }
  });

  // Permission and Form checks
  let hasCreatePermission = $derived.by(() => {
    if (!$rbacUser) return false;

    // Super admin always has permission
    if ($rbacUser.roles.includes("super_admin")) return true;

    const permissionSlug =
      activeTabId === "overview" ? `${slug}.create` : `${activeTabId}.create`;
    return hasPermission(permissionSlug, $rbacUser);
  });

  // Check if form exists in currentMeta
  let canCreate = $derived.by(() => {
    const hasForm = !!currentMeta.form;
    return hasCreatePermission && hasForm;
  });

  let canView = $derived(
    activeTabId === "overview"
      ? hasPermission(`${slug}.view`, $rbacUser)
      : hasPermission(`${activeTabId}.view`, $rbacUser),
  );

  // Modal State
  let isFilterModalOpen = $state(false);
  let isCreateModalOpen = $state(false);
  let isCreatePageActive = $state(false);

  const handleCreateClick = () => {
    if (currentMeta.form?.type === "page") {
      isCreatePageActive = true;
    } else {
      isCreateModalOpen = true;
    }
  };
</script>

<AdminTemplate {title} activePath={`/admin/${slug}`}>
  <div class="py-8 space-y-10" in:fade={{ duration: 400 }}>
    {#if !selectedItem && !isCreatePageActive && canView && !isMonitoringPage}
      <!-- Header Section Above Tabs -->
      <div class="space-y-1">
        <div class="flex items-center gap-2 mb-1">
          <span
            class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/15 px-2 py-0.5 rounded-md"
          >
            {slug}{activeTabId !== "overview" ? ` / ${activeTabId}` : ""}
          </span>
        </div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {$translations && t(`${slug}.${activeTabId}.title`, title)}
        </h2>

        <p class="text-[13px] font-medium text-slate-400 dark:text-slate-400">
          {$translations && t(`${slug}.${activeTabId}.description`)}
        </p>
      </div>
    {/if}

    <!-- Dynamic Tabs based on sub-modules -->
    {#if tabs.length > 0}
      <PillTab {tabs} {activeTabId} onTabChange={handleTabChange} />
    {/if}
    {#if selectedItem}
      <!-- Detail View Layout -->
      <div class="space-y-8" transition:fly={{ x: 20, duration: 400 }}>
        <!-- Header with Back Button -->
        <div class="flex items-center gap-6">
          <button
            onclick={closeDetail}
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-600 transition-all active:scale-90"
          >
            <Icon name="arrow-left" size="18" />
          </button>
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center"
            >
              <Icon name="grad" size="28" />
            </div>
            <div class="flex flex-col">
              <h2
                class="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-1"
              >
                {selectedItem.name}
              </h2>
              <div
                class="flex items-center gap-2 text-[13px] font-medium text-slate-400 dark:text-slate-400"
              >
                <span class="capitalize">{selectedItem.type}</span>
                <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{selectedItem.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Detail Tabs -->
          <div class="flex items-center gap-2 p-1.5 bg-[#F4F7FB] dark:bg-slate-900 rounded-[24px] w-fit border border-slate-100/50 dark:border-slate-700/60">
          {#each currentMeta.detailConfig.tabs as tab}
            <button
              onclick={() => (activeDetailTab = tab.id)}
              class="px-8 py-2.5 text-[14px] font-bold capitalize transition-all duration-300 rounded-[18px]
                     {activeDetailTab === tab.id
                ? 'bg-white dark:bg-slate-800 text-indigo-600 border border-white dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/60'}"
            >
              {tab.label}
            </button>
          {/each}
        </div>

        <!-- Detail Content -->
        <div class="space-y-8">
          {#if activeDetailTab === "overview"}
            <!-- Cards Section -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              {#each currentMeta.detailConfig.overview.cards as card}
                <div class="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/60 dark:border-slate-800 flex flex-col gap-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-xl flex items-center justify-center
                                {card.color === 'indigo'
                        ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600'
                        : card.color === 'emerald'
                          ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600'
                          : 'bg-violet-50 dark:bg-violet-500/20 text-violet-600'}"
                    >
                      <Icon name={card.icon} size="18" />
                    </div>
                    <span class="text-[13px] font-bold text-slate-500 dark:text-slate-400"
                      >{card.label}</span
                    >
                  </div>
                  <p class="text-4xl font-black text-slate-900 dark:text-slate-100">
                    {selectedItem[card.id] || 0}
                  </p>
                </div>
              {/each}
            </div>

            <!-- Info Sections -->
            {#each currentMeta.detailConfig.overview.sections as section}
              <div class="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200/60 dark:border-slate-800 space-y-8">
                <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {section.title}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  {#each section.fields as field}
                    <div class="flex flex-col gap-2">
                      <span
                        class="text-[12px] font-bold text-slate-400 uppercase tracking-widest"
                        >{field.label}</span
                      >
                      <span class="text-[15px] font-semibold text-slate-900"
                        >{selectedItem[field.key] || "-"}</span
                      >
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          {:else}
            <!-- Empty state for other tabs -->
            <div
              class="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800 min-h-[400px] flex flex-col items-center justify-center text-center p-12"
            >
              <div
                class="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-500 mb-6 border border-slate-100 dark:border-slate-700"
              >
                <Icon name="community" size="32" />
              </div>
              <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                No data for {activeDetailTab}
              </h3>
              <p class="text-[14px] text-slate-400 dark:text-slate-400">
                Information for this section is not available yet.
              </p>
            </div>
          {/if}
        </div>
      </div>
    {:else if isFullPageForm}
      <!-- Full Page Form View (for Settings or Direct Pages) -->
      <DirectPage 
        {title} 
        {slug} 
        {activeTabId} 
        {currentMeta} 
        {currentModule} 
        {activeSubModule} 
      />
    {:else if isCreatePageActive}
      <!-- Create Record Page Layout -->
      <div class="space-y-8" transition:fly={{ x: 20, duration: 400 }}>
        <button
          onclick={() => (isCreatePageActive = false)}
          class="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-[13px] transition-colors group"
        >
          <Icon
            name="play"
            size="14"
            class="rotate-180 transition-transform group-hover:-translate-x-1"
          />
          Back to {activeTabId === "overview" ? title : activeSubModule?.name}
        </button>

        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">
            {currentMeta.form?.title ||
              `Add New ${activeTabId === "overview" ? title.replace(/s$/, "") : activeSubModule?.name}`}
          </h2>
          {#if currentMeta.form?.subtitle}
            <p class="text-[13px] font-medium text-slate-400">
              {currentMeta.form.subtitle}
            </p>
          {/if}
        </div>

        <div class="py-4">
          <DynamicForm
            isStandalone={true}
            config={currentMeta.form || {}}
            onClose={() => (isCreatePageActive = false)}
          />
        </div>
      </div>
    {:else if canView}
      <div class="space-y-10" transition:fade={{ duration: 400 }}>
        {#if isMonitoringPage}
          <MonitoringPageContent />
        {:else}
          <!-- Charts Section (Above Table) -->
          {#if currentMeta.chart && currentMeta.chart.length > 0}
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <!-- Left Column: Cards Stack -->
              <div class="lg:col-span-4 space-y-6">
                {#each cards as card}
                  <div
                    class="bg-white dark:bg-slate-900 p-8 rounded-[28px] border border-slate-200/60 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    <p
                      class="text-[12px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-2"
                    >
                      {card.title}
                    </p>
                    <div class="flex items-baseline gap-2">
                      <p
                        class="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight"
                      >
                        {card.value.toLocaleString()}
                      </p>
                      {#if card.subtitle}
                        <p class="text-[12px] font-semibold text-slate-400 dark:text-slate-400">
                          {card.subtitle}
                        </p>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>

              <!-- Right Column: Charts -->
              <div class="lg:col-span-8">
                {#each actualCharts as chart}
                  <div class="h-full">
                    <ChartRenderer
                      type={chart.type}
                      title={chart.title}
                      subtitle={chart.subtitle}
                      data={chart.data}
                      labels={chart.labels}
                    />
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Main Content Area -->
          <div class="space-y-6">
            <!-- Search & Filter Controls -->
            <div
              class="flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div
                class="flex flex-col md:flex-row items-center gap-4 flex-grow w-full md:max-w-3xl"
              >
                <TextField 
                  icon="community"
                  placeholder="Search {activeTabId === 'overview' ? title.toLowerCase() : activeSubModule?.name.toLowerCase()}..."
                  class="md:max-w-md"
                />

                {#if currentMeta.filter && currentMeta.filter.length > 0}
                  <FilterButton 
                    activeFiltersCount={Object.keys(activeFilters).length}
                    onclick={() => (isFilterModalOpen = true)}
                  />
                {/if}
              </div>

              {#if canCreate}
                <Button
                  variant="primary"
                  size="lg"
                  class="rounded-2xl w-full md:w-auto shrink-0"
                  onclick={handleCreateClick}
                >
                  <Icon name="excellence" size="16" class="mr-2" />
                  Add New {activeTabId === "overview"
                    ? title.replace(/s$/, "")
                    : activeSubModule?.name}
                </Button>
              {/if}
            </div>

            <!-- Active Filter Pills -->
            {#if Object.keys(activeFilters).length > 0}
              <div class="flex flex-wrap gap-2 px-1">
                {#each Object.entries(activeFilters) as [key, value]}
                  {#if value}
                    <div
                      class="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-100 dark:border-indigo-500/25 rounded-xl text-[13px] font-bold text-indigo-600"
                    >
                      <span
                        class="text-indigo-300 dark:text-indigo-300 uppercase text-[10px] tracking-widest"
                        >{key}:</span
                      >
                      <span>{value}</span>
                      <button
                        onclick={() => {
                          const next = { ...activeFilters };
                          delete next[key];
                          activeFilters = next;
                        }}
                        class="hover:text-indigo-800 transition-colors p-0.5"
                      >
                        <Icon name="close" size="12" />
                      </button>
                    </div>
                  {/if}
                {/each}
              </div>
            {/if}

            {#if isLoading}
              <div
                class="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800 overflow-hidden min-h-[450px] flex flex-col items-center justify-center text-center p-12 transition-all"
              >
                <div
                  class="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"
                ></div>
                <p class="mt-4 text-slate-500 dark:text-slate-300 font-medium">
                  Loading {title.toLowerCase()}...
                </p>
              </div>
            {:else if items.length > 0}
              <DataTable 
                {slug}
                {items}
                onRowClick={handleRowClick}
              />

              <!-- Pagination Controls -->
              <Pagination 
                page={pagination.page}
                limit={pagination.limit}
                total={pagination.total}
                totalPages={pagination.totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
                onGoToPage={goToPage}
                onLimitChange={handleLimitChange}
              />
            {:else}
              <!-- Table Placeholder -->
              <div
                class="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800 overflow-hidden min-h-[450px] flex flex-col items-center justify-center text-center p-12 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div
                  class="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200 dark:text-slate-500 mb-6 border border-slate-100 dark:border-slate-700"
                >
                  <Icon name="community" size="40" />
                </div>
                <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  No records found
                </h3>
                <p
                  class="text-[14px] text-slate-400 dark:text-slate-400 max-w-[320px] leading-relaxed"
                >
                  It looks like there are no records for this section.
                  {#if canCreate}
                    Click the "Add New" button above to get started.
                  {/if}
                </p>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center py-32 text-center">
        <div
          class="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-500/15 flex items-center justify-center text-rose-500 mb-6"
        >
          <Icon name="play" size="32" class="rotate-180" />
        </div>
        <h3 class="text-xl font-extrabold text-slate-900 dark:text-slate-100">Access Restricted</h3>
        <p class="text-slate-500 dark:text-slate-300 max-w-xs mt-3 font-medium">
          You don't have the required permissions to view this section. Please
          contact your system administrator.
        </p>
      </div>
    {/if}
  </div>
</AdminTemplate>

<FilterModal
  isOpen={isFilterModalOpen}
  filters={currentMeta.filter}
  onClose={() => (isFilterModalOpen = false)}
  onApply={handleApplyFilters}
/>

<DynamicForm
  isOpen={isCreateModalOpen}
  config={currentMeta.form || {}}
  onClose={() => (isCreateModalOpen = false)}
/>
