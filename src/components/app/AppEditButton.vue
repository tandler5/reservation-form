<template>
  <button
    class="!text-content hover:!text-primary group flex cursor-pointer"
    style="pointer-events: auto !important"
    @click.prevent="$emit('on-click', $event)"
  >
    <i class="pi pi-pencil text-xs group-hover:!font-extrabold"></i>
  </button>
</template>
