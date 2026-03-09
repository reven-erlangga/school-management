<script lang="ts">
  import Icon from '@components/svelte/atoms/Icon.svelte';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  let { source = null }: { source?: { url: string; method: string } | null } = $props();

  let data = $state({
    totalStudent: { label: 'Total Students', value: '1,245', trend: '+3.2%', trendType: 'up' },
    totalAttendance: { label: 'Today Attendance', value: '92.4%', trend: '-1.5%', trendType: 'down' },
    invoices: { label: 'Invoices', paidAmount: 'Rp.920M', paidCount: 184, overdueAmount: 'Rp.920M', overdueCount: 27 },
    issues: { label: 'Open Issues', value: 12, pending: 5, exceptions: 7 },
    gradeBudget: { label: 'Grade Budget', unit: 'SMA', total: 'Rp 450.000.000', used: 'Rp 320.000.000', remaining: 'Rp 130.000.000' }
  });

  onMount(async () => {
    if (source?.url) {
      try {
        const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}${source.url}`);
        if (res.ok) {
           const fetchedData = await res.json();
           // Merge or replace data
           data = { ...data, ...fetchedData };
        }
      } catch (e) {
        console.error('Failed to fetch stat cards data:', e);
      }
    }
  });
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  <!-- Total Students -->
  <div class="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group h-[160px] flex flex-col justify-between" in:fly={{ y: 10, duration: 400 }}>
    <p class="text-[12px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{data.totalStudent.label}</p>
    <div class="flex items-end justify-between">
      <h3 class="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{data.totalStudent.value}</h3>
      <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black">
        <Icon name="play" size="10" class="-rotate-90" />
        {data.totalStudent.trend}
      </div>
    </div>
  </div>

  <!-- Today Attendance -->
  <div class="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group h-[160px] flex flex-col justify-between" in:fly={{ y: 10, duration: 400, delay: 100 }}>
    <p class="text-[12px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{data.totalAttendance.label}</p>
    <div class="flex items-end justify-between">
      <h3 class="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{data.totalAttendance.value}</h3>
      <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 text-[11px] font-black">
        <Icon name="play" size="10" class="rotate-90" />
        {data.totalAttendance.trend}
      </div>
    </div>
  </div>

  <!-- Invoices -->
  <div class="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group h-[160px] flex flex-col justify-between" in:fly={{ y: 10, duration: 400, delay: 200 }}>
    <p class="text-[12px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{data.invoices.label}</p>
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-[14px] font-black text-emerald-600">{data.invoices.paidAmount}</span>
        <span class="text-[11px] font-bold text-slate-900 dark:text-slate-100">Paid: {data.invoices.paidCount}</span>
      </div>
      <div class="w-full h-px bg-slate-50 dark:bg-slate-800"></div>
      <div class="flex justify-between items-center">
        <span class="text-[14px] font-black text-rose-600">{data.invoices.overdueAmount}</span>
        <span class="text-[11px] font-bold text-slate-900 dark:text-slate-100">Overdue: {data.invoices.overdueCount}</span>
      </div>
    </div>
  </div>

  <!-- Open Issues -->
  <div class="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group h-[160px] flex flex-col justify-between" in:fly={{ y: 10, duration: 400, delay: 300 }}>
    <p class="text-[12px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{data.issues.label}</p>
    <div class="flex items-end justify-between">
      <h3 class="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{data.issues.value}</h3>
      <div class="text-right space-y-0.5">
        <p class="text-[11px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{data.issues.pending} Pending</p>
        <p class="text-[11px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{data.issues.exceptions} Exceptions</p>
      </div>
    </div>
  </div>

  <!-- Grade Budget -->
  <div class="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group h-[160px] flex flex-col justify-between" in:fly={{ y: 10, duration: 400, delay: 400 }}>
    <div class="flex justify-between items-center">
      <p class="text-[12px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{data.gradeBudget.label}</p>
      <button class="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[10px] font-black text-slate-900 dark:text-slate-100">
        {data.gradeBudget.unit} <Icon name="play" size="8" class="rotate-90 opacity-40" />
      </button>
    </div>
    <div class="space-y-1.5">
      <div class="flex justify-between items-center">
        <span class="text-[11px] font-bold text-slate-400">Total</span>
        <span class="text-[13px] font-black text-slate-900 dark:text-slate-100">{data.gradeBudget.total}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[11px] font-bold text-slate-400">Used</span>
        <span class="text-[13px] font-black text-rose-600">{data.gradeBudget.used}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-[11px] font-bold text-slate-400">Remaining</span>
        <span class="text-[13px] font-black text-amber-500">{data.gradeBudget.remaining}</span>
      </div>
    </div>
  </div>
</div>
