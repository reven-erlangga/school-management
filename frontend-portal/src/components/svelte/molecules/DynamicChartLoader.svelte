<script lang="ts">
  import EnrollmentMonitoring from '@modules/monitoring/EnrollmentMonitoring.svelte';
  import FinanceMonitoring from '@modules/monitoring/FinanceMonitoring.svelte';
  import AttendanceMonitoring from '@modules/monitoring/AttendanceMonitoring.svelte';
  import GradingMonitoring from '@modules/monitoring/GradingMonitoring.svelte';
  import StatCardsMonitoring from '@modules/monitoring/StatCardsMonitoring.svelte';
  import Icon from '../atoms/Icon.svelte';

  interface ChartConfig {
    type: 'line' | 'stacked-bar' | 'heatmap' | 'stat-cards' | 'list';
    title?: string;
    subtitle?: string;
    source?: {
      url: string;
      method: 'GET' | 'POST';
    };
    permission?: string;
  }

  interface Props {
    config: ChartConfig;
  }

  let { config }: Props = $props();
</script>

{#if config.type === 'stat-cards'}
  <StatCardsMonitoring source={config.source} />

{:else if config.type === 'line'}
  <EnrollmentMonitoring 
    title={config.title} 
    subtitle={config.subtitle} 
    source={config.source} 
  />

{:else if config.type === 'stacked-bar'}
  <FinanceMonitoring 
    title={config.title} 
    subtitle={config.subtitle} 
    source={config.source} 
  />

{:else if config.type === 'heatmap'}
  <AttendanceMonitoring 
    title={config.title} 
    subtitle={config.subtitle} 
    source={config.source} 
  />

{:else if config.type === 'list'}
  <GradingMonitoring 
    title={config.title} 
    source={config.source} 
  />

{:else}
  <div class="w-full h-[300px] flex items-center justify-center bg-rose-50 rounded-[32px] border border-rose-100">
    <div class="text-center space-y-2">
      <Icon name="close" size="24" class="text-rose-400 mx-auto" />
      <p class="text-sm font-bold text-rose-600">Unknown chart type</p>
      <p class="text-xs text-rose-400">{config.type}</p>
    </div>
  </div>
{/if}
