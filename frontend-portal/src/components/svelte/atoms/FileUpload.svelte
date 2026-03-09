<script lang="ts">
  import Icon from './Icon.svelte';

  interface Props {
    id?: string;
    label?: string | null;
    placeholder?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    files?: FileList | null;
    previewUrl?: string | null;
    onChange?: (files: FileList | null) => void;
  }

  let {
    id = '',
    label = 'Upload File',
    placeholder = 'Click to Upload',
    accept = 'image/*',
    multiple = false,
    disabled = false,
    required = false,
    class: className = '',
    files = $bindable(null),
    previewUrl = null,
    onChange,
  }: Props = $props();

  let inputRef: HTMLInputElement;
  let isDragging = $state(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) isDragging = true;
  };

  const handleDragLeave = () => {
    isDragging = false;
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    isDragging = false;
    if (disabled) return;
    
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      files = e.dataTransfer.files;
      if (onChange) onChange(files);
    }
  };

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      files = target.files;
      if (onChange) onChange(files);
    }
  };

  const triggerUpload = () => {
    if (!disabled) inputRef.click();
  };

  const clearFiles = (e: Event) => {
    e.stopPropagation();
    files = null;
    if (inputRef) inputRef.value = '';
    if (onChange) onChange(null);
  };
</script>

<div class="w-full {className}">
  {#if label}
    <label
      for={id}
      class="text-xs text-slate-400 dark:text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2.5 block"
    >
      {label} {#if required}<span class="text-rose-500">*</span>{/if}
    </label>
  {/if}

  <div
    role="button"
    tabindex="0"
    class="relative group cursor-pointer transition-all duration-300"
    onkeydown={(e) => e.key === 'Enter' && triggerUpload()}
    onclick={triggerUpload}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    <input
      {id}
      type="file"
      {accept}
      {multiple}
      {disabled}
      class="hidden"
      bind:this={inputRef}
      onchange={handleChange}
    />

    <div
      class="w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-300
      {isDragging
        ? 'border-indigo-500 bg-indigo-500/10'
        : 'border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}"
    >
      {#if files && files.length > 0}
        <div class="relative w-full h-full p-4 flex items-center justify-center">
          {#if files[0].type.startsWith('image/')}
            <img
              src={URL.createObjectURL(files[0])}
              alt="Preview"
              class="h-full w-auto object-contain rounded-lg shadow-sm"
            />
          {:else}
            <div class="flex flex-col items-center text-slate-600 dark:text-slate-300">
              <Icon name="check" size="32" class="text-emerald-500 mb-2" />
              <span class="text-sm font-medium truncate max-w-[200px]">{files[0].name}</span>
            </div>
          {/if}
          
          <button
            type="button"
            class="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-lg z-10"
            onclick={clearFiles}
            title="Remove file"
          >
            <Icon name="close" size="12" />
          </button>
        </div>
      {:else if previewUrl}
        <div class="relative w-full h-full p-4 flex items-center justify-center">
          <img
            src={previewUrl}
            alt="Preview"
            class="h-full w-auto object-contain rounded-lg shadow-sm"
          />
        </div>
      {:else}
        <div class="flex flex-col items-center text-slate-400 dark:text-slate-500 transition-colors group-hover:text-indigo-500/80">
          <div class="p-3 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors mb-2">
            <Icon name="upload" size="20" />
          </div>
          <span class="text-xs font-medium uppercase tracking-wider">
            {isDragging ? 'Drop Here' : placeholder}
          </span>
        </div>
      {/if}
    </div>
  </div>
</div>
