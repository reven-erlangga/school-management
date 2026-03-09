<script lang="ts">
  import { t } from "@utils/translation.util";

  interface Props {
    name?: string;
    notificationCount?: number;
    class?: string;
  }

  let { 
    name = 'Guest', 
    notificationCount = 0,
    class: className = '' 
  }: Props = $props();
</script>

<div class="space-y-3 {className}">
  <h2 class="text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
    {t('dashboard.greeting.title', 'Welcome Back {name}', { name })}
  </h2>
  <p class="text-[14px] font-medium text-slate-500 dark:text-slate-400">
    {t('dashboard.greeting.notification_prefix', 'You have')} 
    <span class="text-emerald-600 font-bold underline underline-offset-4">
      {notificationCount} {t('dashboard.greeting.unread', 'unread')}
    </span> 
    {t('dashboard.greeting.notification_suffix', 'notifications')}
  </p>
</div>
