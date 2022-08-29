<script lang="ts">
  export let date: string;
  export let title: string;
  export let description: string;
  export let path: string;
</script>

<div class="flex flex-col">
  <span class="text-slate-400 text-sm mb-4">{date}</span>
  <a
    href={path}
    class="text-4xl font-bold text-strong-blue mb-3 cursor-pointer"
  >
    {title}
  </a>
  <p class="text-base">{description}</p>
</div>
