<script lang="ts">
  import { untrack } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Icon from '../../atoms/Icon.svelte';
  import Button from '../../atoms/Button.svelte';
  import { translations } from '@store/tolgee.store';
  import { t } from '@utils/translation.util';

  interface FormOption {
    label: string;
    value: any;
    subtitle?: string;
    info?: string;
  }

  interface FormContent {
    id?: string;
    type: 'textfield' | 'textarea' | 'dropdown' | 'checkbox' | 'radiobutton' | 'date' | 'file' | 'selector';
    label?: string;
    placeholder?: string;
    options?: FormOption[];
    validation?: { required?: boolean };
    step?: string;
    default?: any;
    showIf?: { field: string; value: any };
    column?: 1 | 2 | 3 | 4;
    style?: {
      order?: number;
      columns?: number | { default?: number; sm?: number; md?: number; lg?: number; xl?: number };
    };
  }

  interface Props {
    isOpen?: boolean;
    onClose?: () => void;
    config: {
      title?: string;
      subtitle?: string;
      type?: 'modal' | 'page';
      style?: 'form' | 'step';
      content?: FormContent[];
      ui?: {
        submitLabel?: string;
        cancelLabel?: string;
        layout?: string;
      };
    };
    isStandalone?: boolean;
    initialData?: Record<string, any>;
    onSubmit?: (values: Record<string, any>) => void;
  }

  let { 
    isOpen = true, 
    onClose = () => {}, 
    config, 
    isStandalone = false,
    initialData = {},
    onSubmit = () => {}
  }: Props = $props();

  let formData = $state<Record<string, any>>({});
  let isSubmitting = $state(false);
  let currentStep = $state(0);
  let uploadStatus = $state<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({});

  const getFieldKey = (field: FormContent, i: number): string => {
    return field.id || field.label || String(i);
  };

  const handleFileUpload = async (e: Event, field: FormContent, i: number) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const fieldKey = getFieldKey(field, i);
    const file = input.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    uploadStatus[fieldKey] = 'uploading';
    isSubmitting = true;

    const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
    
    // Determine specific upload endpoint based on field id or label
    let endpoint = 'upload';
    if (fieldKey === 'app_icon' || field.label === 'App Icon') endpoint = 'settings/upload/logo';
    else if (fieldKey === 'favicon_icon' || field.label === 'Favicon') endpoint = 'settings/upload/favicon';
    
    console.log(`[Upload] Attempting to upload file to: ${apiUrl}/${endpoint}`);

    try {
      const res = await fetch(`${apiUrl}/${endpoint}`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`[Upload] Success! URL: ${data.url}`);
        formData[fieldKey] = data.url;
        uploadStatus[fieldKey] = 'success';
      } else {
        const errorText = await res.text();
        console.error(`[Upload] Failed with status ${res.status}: ${errorText}`);
        uploadStatus[fieldKey] = 'error';
      }
    } catch (err) {
      console.error('[Upload] Error occurred:', err);
      uploadStatus[fieldKey] = 'error';
    } finally {
      isSubmitting = false;
    }
  };

  // Sync initialData to formData
  $effect(() => {
    if (Object.keys(initialData).length > 0) {
      untrack(() => {
        formData = { ...formData, ...initialData };
      });
    }
  });

  // Initialize form with default values
  $effect(() => {
    if (config && config.content) {
      const content = config.content;
      untrack(() => {
        const defaults: Record<string, any> = {};
        content.forEach((field, i) => {
          const key = getFieldKey(field, i);
          if (field.default !== undefined && formData[key] === undefined) {
            defaults[key] = field.default;
          }
        });
        
        if (Object.keys(defaults).length > 0) {
          formData = { ...formData, ...defaults };
        }
      });
    }
  });

  // Group content into steps based on 'step' property and visibility
  let stepsData = $derived.by(() => {
    if (!config || !config.content) return [];
    
    const groups: Record<string, FormContent[]> = {};
    const stepOrder: string[] = [];
    
    config.content.forEach(field => {
      // Check visibility condition
      if (field.showIf) {
        const targetValue = formData[field.showIf.field];
        if (targetValue !== field.showIf.value) return;
      }

      const stepName = config.style === 'step' ? (field.step || 'General') : 'Default';
      if (!groups[stepName]) {
        groups[stepName] = [];
        stepOrder.push(stepName);
      }
      groups[stepName].push(field);
    });

    // Sort fields within each step by 'order'
    Object.keys(groups).forEach(name => {
      groups[name].sort((a, b) => (a.style?.order || 0) - (b.style?.order || 0));
    });
    
    return stepOrder.map(name => ({
      name,
      fields: groups[name]
    }));
  });

  const getStepIcon = (name: string): any => {
    const n = name.toLowerCase();
    if (n.includes('general') || n.includes('info')) return 'grad';
    if (n.includes('contact') || n.includes('phone') || n.includes('communication')) return 'phone';
    if (n.includes('account') || n.includes('user') || n.includes('profile')) return 'user';
    if (n.includes('address') || n.includes('location')) return 'community';
    if (n.includes('verify') || n.includes('confirm') || n.includes('check')) return 'check';
    return 'excellence';
  };

  const getColSpanClass = (field: FormContent): string => {
    const cols = field.style?.columns;
    if (!cols) {
      // Fallback to legacy column or full width
      if (field.column) {
        // Map 1, 2, 3, 4 to 3, 6, 9, 12 in 12-col grid
        const legacyMap: Record<number, string> = {
          1: 'col-span-3',
          2: 'col-span-6',
          3: 'col-span-9',
          4: 'col-span-12'
        };
        return legacyMap[field.column] || 'col-span-12';
      }
      return 'col-span-12';
    }

    if (typeof cols === 'number') {
      const colMap: Record<number, string> = {
        1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4',
        5: 'col-span-5', 6: 'col-span-6', 7: 'col-span-7', 8: 'col-span-8',
        9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12'
      };
      return colMap[cols] || 'col-span-12';
    }

    const classes = [];
    const colMap: Record<number, string> = {
      1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4',
      5: 'col-span-5', 6: 'col-span-6', 7: 'col-span-7', 8: 'col-span-8',
      9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12'
    };
    
    const smMap: Record<number, string> = {
      1: 'sm:col-span-1', 2: 'sm:col-span-2', 3: 'sm:col-span-3', 4: 'sm:col-span-4',
      5: 'sm:col-span-5', 6: 'sm:col-span-6', 7: 'sm:col-span-7', 8: 'sm:col-span-8',
      9: 'sm:col-span-9', 10: 'sm:col-span-10', 11: 'sm:col-span-11', 12: 'sm:col-span-12'
    };

    const mdMap: Record<number, string> = {
      1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4',
      5: 'md:col-span-5', 6: 'md:col-span-6', 7: 'md:col-span-7', 8: 'md:col-span-8',
      9: 'md:col-span-9', 10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12'
    };

    if (cols.default) classes.push(colMap[cols.default]);
    if (cols.sm) classes.push(smMap[cols.sm]);
    if (cols.md) classes.push(mdMap[cols.md]);
    
    return classes.filter(Boolean).join(' ') || 'col-span-12';
  };

  const handleNext = () => {
    if (currentStep < stepsData.length - 1) {
      currentStep++;
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      currentStep--;
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    isSubmitting = true;
    
    // Trigger onSubmit if provided
    if (onSubmit) {
      onSubmit(formData);
    }
    
    // Simulate API call for internal state
    setTimeout(() => {
      isSubmitting = false;
      if (!isStandalone) onClose();
    }, 1500);
  };

  let formTitle = $derived.by(() => {
    if (!config.title) return t('common.create_record', 'Create New Record');
    return t(config.title);
  });

  let formSubtitle = $derived.by(() => {
    if (!config.subtitle) return '';
    return t(config.subtitle);
  });

  const submitLabel = $derived.by(() => {
    if (config && config.ui?.submitLabel) {
      return t(config.ui.submitLabel, config.ui.submitLabel);
    }
    if (config && config.style === 'step') {
      const isLastStep = currentStep === stepsData.length - 1;
      if (isLastStep) return config.title?.replace('Create New ', 'Create ') || t('common.create', 'Create Record');
      return t('common.next', 'Next');
    }
    return t('common.save_changes', 'Save Changes');
  });

  const containerClass = isStandalone 
    ? "w-full"
    : "relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[32px] shadow-2xl dark:shadow-none overflow-hidden border border-slate-200/60 dark:border-slate-700/60";
</script>

{#if isStandalone}
  <div class={containerClass}>
    {@render formBody()}
  </div>
{:else if isOpen}
  <div class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
    <!-- Backdrop -->
    <div 
      role="button"
      tabindex="-1"
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-md cursor-default"
      onclick={onClose}
      onkeydown={(e) => e.key === 'Escape' && onClose()}
      transition:fade={{ duration: 300 }}
    ></div>

    <!-- Modal Content -->
    <div 
      class={containerClass}
      transition:fly={{ y: 20, duration: 400 }}
      role="dialog"
      aria-modal="true"
    >
      {@render formBody()}
    </div>
  </div>
{/if}

{#snippet formBody()}
  <!-- Header -->
  {#if !isStandalone}
    <div class="px-10 pt-10 pb-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {$translations && formTitle}
          </h2>
          {#if config.subtitle}
            <p class="text-[13px] font-medium text-slate-400 dark:text-slate-400 mt-1">{$translations && formSubtitle}</p>
          {/if}
        </div>
        <button 
          onclick={onClose}
          class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <Icon name="close" size="18" />
        </button>
      </div>

      {#if config.style === 'step'}
        <!-- Custom Stepper UI -->
        <div class="flex items-center justify-center mt-10 mb-2 relative">
          {#each stepsData as step, i}
            <div class="flex flex-col items-center relative z-10">
              <div class="flex items-center justify-center">
                <div 
                  class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm dark:shadow-none
                         {i === currentStep ? 'bg-indigo-600 text-white scale-110' : 
                          i < currentStep ? 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}"
                >
                  <Icon name={getStepIcon(step.name)} size="18" />
                </div>
              </div>
              <span class="text-[10px] font-black uppercase tracking-widest mt-3 
                           {i === currentStep ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-400'}">
                {step.name}
              </span>
            </div>
            
            {#if i < stepsData.length - 1}
              <div class="flex-grow h-0.5 mx-4 -mt-8 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-indigo-500 transition-all duration-700 ease-out" 
                  style="width: {i < currentStep ? '100%' : '0%'}"
                ></div>
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Form Body -->
  <form onsubmit={handleSubmit} class="{!isStandalone ? 'p-10 max-h-[60vh] overflow-y-auto custom-scrollbar' : ''}">
    <div class="grid grid-cols-12 gap-x-8 gap-y-4 relative">
      {#if stepsData.length > 0}
        {#each stepsData as step, i}
          {#if config.style === 'step'}
            {#if i === currentStep}
              <div 
                class="col-span-12 grid grid-cols-12 gap-x-8 gap-y-4" 
                in:fly={{ x: 20, duration: 400, delay: 300 }}
                out:fly={{ x: -20, duration: 300 }}
              >
                <div class="col-span-12 flex items-center gap-3 mb-2">
                  <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">{step.name} Information</h3>
                </div>
                
                {#each step.fields as field, fi}
                  <div class={getColSpanClass(field)}>
                    {@render renderField(field, fi)}
                  </div>
                {/each}
              </div>
            {/if}
          {:else}
            <!-- Standard Form Layout -->
            {#each step.fields as field, fi}
              <div class={getColSpanClass(field)} transition:fade>
                {@render renderField(field, fi)}
              </div>
            {/each}
          {/if}
        {/each}
      {/if}
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 col-span-12">
      {#if config.style === 'step'}
        {#if currentStep > 0}
          <Button 
            variant="outline" 
            type="button"
            class="px-8 rounded-xl py-2.5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-[13px] font-bold transition-all"
            onclick={handleBack}
          >
            <Icon name="arrow-left" size="14" class="mr-2" />
            Back
          </Button>
        {:else if !isStandalone}
          <Button 
            variant="ghost" 
            type="button"
            class="px-8 rounded-xl py-2.5 text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 text-[13px] font-bold"
            onclick={onClose}
          >
            Cancel
          </Button>
        {/if}

        {#if currentStep < stepsData.length - 1}
          <Button 
            variant="primary"
            type="button"
            class="px-10 rounded-xl py-2.5 shadow-md shadow-indigo-900/10 dark:shadow-none text-[13px] font-bold"
            onclick={handleNext}
          >
            Next
            <Icon name="play" size="14" class="ml-2" />
          </Button>
        {:else}
          <Button 
            type="submit" 
            class="px-10 rounded-xl py-2.5 shadow-md shadow-indigo-900/10 dark:shadow-none text-[13px] font-bold"
            disabled={isSubmitting}
          >
            {#if isSubmitting}
              <span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
              Creating...
            {:else}
              {submitLabel}
              <Icon name="check" size="16" class="ml-2" />
            {/if}
          </Button>
        {/if}
      {:else}
        {#if !isStandalone}
          <Button 
            variant="ghost" 
            type="button"
            class="px-8 rounded-xl py-2.5 text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 text-[13px] font-bold"
            onclick={onClose}
          >
            Cancel
          </Button>
        {/if}
        <Button 
          type="submit" 
          class="px-10 rounded-xl py-2.5 shadow-md shadow-indigo-900/10 dark:shadow-none text-[13px] font-bold"
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            <span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
            Saving...
          {:else}
            {submitLabel}
          {/if}
        </Button>
      {/if}
    </div>
  </form>
{/snippet}

{#snippet renderField(field: FormContent, i: number)}
  <div class="space-y-1.5">
    {#if field.label}
      <label class="block text-[12px] font-bold text-slate-500 dark:text-slate-300 ml-1 uppercase tracking-wider">
        {$translations && t(field.label, field.label)}
        {#if field.validation?.required}
          <span class="text-rose-500 ml-0.5">*</span>
        {/if}
      </label>
    {/if}

    {#if field.type === 'textfield'}
      <input 
        type="text" 
        placeholder={field.placeholder}
        bind:value={formData[getFieldKey(field, i)]}
        required={field.validation?.required}
        class="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[14px] font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500"
      />
    {:else if field.type === 'textarea'}
      <textarea 
        placeholder={field.placeholder}
        bind:value={formData[getFieldKey(field, i)]}
        required={field.validation?.required}
        rows="3"
        class="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[14px] font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500 resize-none"
      ></textarea>
    {:else if field.type === 'dropdown'}
      <div class="relative group">
        <select 
          bind:value={formData[getFieldKey(field, i)]}
          required={field.validation?.required}
          class="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all text-slate-700 dark:text-slate-100 appearance-none"
        >
          <option value="" disabled selected>{field.placeholder || 'Select an option'}</option>
          {#if field.options}
            {#each field.options as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          {/if}
        </select>
        <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-400">
          <Icon name="chevron-right" size="16" class="rotate-90" />
        </div>
      </div>
    {:else if field.type === 'radiobutton'}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#if field.options}
          {#each field.options as opt}
            <label 
              class="relative flex flex-col items-center justify-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 group
                     {formData[getFieldKey(field, i)] === opt.value ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/10' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-600'}"
            >
              <input 
                type="radio" 
                name={getFieldKey(field, i)}
                value={opt.value}
                bind:group={formData[getFieldKey(field, i)]}
                class="sr-only"
              />
              <div 
                class="w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-all
                       {formData[getFieldKey(field, i)] === opt.value ? 'bg-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-700'}"
              >
                <Icon name={opt.value === 'existing' || opt.value === 'new' ? (opt.value === 'existing' ? 'user' : 'community') : 'check'} size="16" />
              </div>
              <span class="text-[13px] font-bold text-slate-900 dark:text-slate-100 text-center">{opt.label}</span>
              {#if opt.value === 'existing' || opt.value === 'new'}
                <p class="text-[10px] text-slate-400 dark:text-slate-400 text-center mt-1 font-medium">
                  {opt.value === 'existing' ? 'Select from school admins' : 'Setup a new school admin'}
                </p>
              {/if}
            </label>
          {/each}
        {/if}
      </div>
    {:else if field.type === 'date'}
      <input 
        type="date" 
        bind:value={formData[getFieldKey(field, i)]}
        required={field.validation?.required}
        class="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[14px] font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all"
      />
    {:else if field.type === 'file'}
      <div class="relative group">
        <input 
          type="file" 
          onchange={(e) => handleFileUpload(e, field, i)}
          required={field.validation?.required && !formData[getFieldKey(field, i)]}
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div class="w-full px-5 py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 dark:text-slate-400 group-hover:border-indigo-500 group-hover:bg-indigo-50/30 dark:group-hover:bg-indigo-500/10 transition-all">
          {#if uploadStatus[getFieldKey(field, i)] === 'uploading'}
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-500 flex items-center justify-center mb-3 animate-spin">
              <Icon name="play" size="20" class="-rotate-90" />
            </div>
            <p class="text-[13px] font-bold text-slate-500 dark:text-slate-200">Uploading...</p>
          {:else if formData[getFieldKey(field, i)]}
            <div class="w-16 h-16 rounded-2xl overflow-hidden mb-3 border-2 border-white dark:border-slate-900 shadow-sm dark:shadow-none">
              <img src={formData[getFieldKey(field, i)]} alt="Preview" class="w-full h-full object-cover" />
            </div>
            <p class="text-[13px] font-bold text-indigo-600">File Uploaded</p>
            <p class="text-[10px] text-slate-400 dark:text-slate-400 mt-1">Click to change</p>
          {:else}
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-500 flex items-center justify-center mb-3 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/25 transition-colors">
              <Icon name="play" size="20" class="-rotate-90" />
            </div>
            <p class="text-[13px] font-bold text-slate-500 dark:text-slate-200 group-hover:text-indigo-600">{field.placeholder || 'Upload File'}</p>
            <p class="text-[11px] text-slate-400 dark:text-slate-400 mt-1">PNG, JPG or SVG (Max. 2MB)</p>
          {/if}
        </div>
      </div>
    {:else if field.type === 'selector'}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#if field.options}
          {#each field.options as opt}
            <label 
              class="relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 group
                     {formData[getFieldKey(field, i)] === opt.value ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/10' : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-600'}"
            >
              <input 
                type="radio" 
                name={getFieldKey(field, i)}
                value={opt.value}
                bind:group={formData[getFieldKey(field, i)]}
                class="sr-only"
              />
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all
                       {formData[field.label || String(i)] === opt.value ? 'bg-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-indigo-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-700'}"
              >
                <Icon name="user" size="18" />
              </div>
              <div class="flex flex-col">
                <span class="text-[14px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{opt.label}</span>
                {#if opt.subtitle}
                  <span class="text-[12px] text-slate-500 dark:text-slate-300 mt-0.5">{opt.subtitle}</span>
                {/if}
                {#if opt.info}
                  <span class="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">{opt.info}</span>
                {/if}
              </div>
            </label>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
{/snippet}

<style>
  /* Local styles if needed, but using global slim scrollbar */
</style>
