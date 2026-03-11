<script lang="ts">
  interface Props {
    id?: string;
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md';
    class?: string;
    dataTestid?: string;
    onChange?: (checked: boolean) => void;
    onValueChange?: (checked: boolean) => void;
  }

  let {
    id = '',
    name = '',
    checked = false,
    disabled = false,
    size = 'md',
    class: className = '',
    dataTestid = '',
    onChange,
    onValueChange,
  }: Props = $props();

  const handleToggle = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const next = target.checked;
    checked = next;
    if (onChange) onChange(next);
    if (onValueChange) onValueChange(next);
  };

  let trackClass = $derived.by(() =>
    size === 'sm'
      ? 'w-10 h-6'
      : 'w-12 h-7'
  );

  let knobClass = $derived.by(() =>
    size === 'sm'
      ? 'w-4 h-4 peer-checked:translate-x-4'
      : 'w-5 h-5 peer-checked:translate-x-5'
  );
</script>

<label class="relative inline-flex items-center cursor-pointer select-none {className}">
  <input
    {id}
    {name}
    type="checkbox"
    class="sr-only peer"
    {disabled}
    checked={checked}
    data-testid={dataTestid}
    onchange={handleToggle}
    aria-checked={checked}
    role="switch"
  />
  <div
    class="{trackClass} bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 transition-colors"
  ></div>
  <div
    class="absolute left-1 top-1 bg-white rounded-full transition-transform {knobClass}"
  ></div>
</label>
