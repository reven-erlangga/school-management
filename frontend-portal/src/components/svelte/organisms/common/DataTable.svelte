<script lang="ts">
  import Icon from '../../atoms/Icon.svelte';
  import Button from '../../atoms/Button.svelte';

  interface Props {
    slug: string;
    items: any[];
    onRowClick?: (item: any) => void;
  }

  let { slug, items, onRowClick }: Props = $props();
</script>

<div class="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800 overflow-hidden overflow-x-auto transition-all hover:border-slate-300 dark:hover:border-slate-700">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-slate-50/50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
        {#if slug === 'institutes'}
          <th class="px-6 py-4 text-[12px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest">Institute</th>
          <th class="px-6 py-4 text-[12px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest">Type</th>
          <th class="px-6 py-4 text-[12px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest">Admin</th>
          <th class="px-6 py-4 text-[12px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest text-center">Teachers</th>
          <th class="px-6 py-4 text-[12px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest text-center">Students</th>
          <th class="px-6 py-4 text-[12px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest text-center">Staff</th>
          <th class="px-6 py-4 text-[12px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest text-center">Status</th>
          <th class="px-6 py-4 text-[12px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest text-right">Actions</th>
        {:else}
          <th class="px-6 py-4 text-[12px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest">Name</th>
          <th class="px-6 py-4 text-[12px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest text-right">Actions</th>
        {/if}
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
      {#each items as item}
        <tr 
          class="hover:bg-slate-50/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group/row"
          onclick={() => onRowClick?.(item)}
        >
          {#if slug === 'institutes'}
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center font-bold">
                  <Icon name="grad" size="18" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[14px] font-bold text-slate-900 dark:text-slate-100">{item.name}</span>
                  {#if item.address}
                    <span class="text-[11px] text-slate-400 dark:text-slate-400">{item.address}</span>
                  {/if}
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 text-[11px] font-bold rounded-full uppercase tracking-wider">
                {item.type}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="text-[13px] font-medium text-slate-600 dark:text-slate-300">
                {item.admin_id ? 'Assigned' : 'Not assigned'}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex items-center justify-center gap-1.5 text-indigo-600">
                <Icon name="user" size="14" />
                <span class="text-[13px] font-bold">{item.teacher_count || 0}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex items-center justify-center gap-1.5 text-emerald-600">
                <Icon name="grad" size="14" />
                <span class="text-[13px] font-bold">{item.student_count || 0}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex items-center justify-center gap-1.5 text-violet-600">
                <Icon name="user" size="14" />
                <span class="text-[13px] font-bold">{item.staff_count || 0}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-center">
              <span class="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-lg uppercase tracking-wider">
                {item.status || 'active'}
              </span>
            </td>
          {:else}
            <td class="px-6 py-4">
              <span class="text-[14px] font-bold text-slate-900 dark:text-slate-100">{item.name || item.username}</span>
            </td>
          {/if}
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end gap-2">
              <Button variant="ghost" size="icon" class="p-2 text-slate-400 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-all">
                <Icon name="play" size="16" />
              </Button>
              <Button variant="ghost" size="icon" class="p-2 text-slate-400 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-all">
                <Icon name="check" size="16" />
              </Button>
              <Button variant="ghost" size="icon" class="p-2 text-slate-400 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-all">
                <Icon name="close" size="16" />
              </Button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
