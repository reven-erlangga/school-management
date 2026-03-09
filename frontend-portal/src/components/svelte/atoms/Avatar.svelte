<script lang="ts">
  interface Props {
    src: string;
    alt?: string;
    size?: "sm" | "md" | "lg";
    class?: string;
  }

  let {
    src,
    alt = "Avatar",
    size = "md",
    class: className = "",
  }: Props = $props();

  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const combinedStyles = `rounded-full border-2 border-white object-cover ${sizes[size]} ${className}`;
</script>

<img {src} {alt} class={combinedStyles} />
