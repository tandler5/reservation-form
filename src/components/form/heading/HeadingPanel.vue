<template>
  <div
    class="heading rounded-t-lg absolute flex bg-white z-2 top-0 left-0 right-0 px-[17px] py-[30px] border-b border-[#0000000d] text-left h-[60px] items-center"
  >
    <h3 class="font-medium leading-[1.2] m-0 mr-auto">{{ title }}</h3>
    <i
      v-if="visibleRightPanel"
      class="pi pi-shopping-cart text-xl cursor-pointer max-[1050px]:!flex !hidden"
      @click="phonePanelOpened = !phonePanelOpened"
    ></i>
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
defineProps<{ title: string; visibleRightPanel: boolean }>()
const phonePanelOpened = inject('phonePanelOpened')
</script>
