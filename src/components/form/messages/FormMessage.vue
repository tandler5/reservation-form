<template>
  <li
    :class="type === 'success' ? 'text-success' : 'text-[#d03739]'"
    class="text-xs flex items-center gap-2"
  >
    <span class="size-4 rounded-full">
      <i :class="type === 'success' ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'"></i>
    </span>
    <slot />
  </li>
</template>
<script setup lang="ts">
defineProps<{ type: string; messages: any }>()
</script>
