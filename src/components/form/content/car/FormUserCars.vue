<template>
  <div class="flex flex-col gap-3 pb-[70px]">
    <div
      v-for="car in cars"
      :key="car.id"
      :class="{ 'border-primary shadow-button': modelValue === car.id }"
      class="rounded-lg flex group bg-white border border-[#e5e7ee] items-center shadow-none outline-none p-2.5 cursor-pointer group hover:border-primary hover:shadow-button"
      @click="modelValue = car.id"
    >
      <div class="h-[45px] w-auto aspect-square flex justify-center items-center mr-[15px]">
        <AppCarImage :car />
      </div>
      <div
        class="mr-auto py-[5px] group-hover:translate-x-[3px] transition-transform duration-200 ease-out flex flex-col"
      >
        <span class="leading-[1.3]"> {{ car?.model.brand.name }} {{ car?.model.name }} </span>
        <span class="text-content text-[12px]"> {{ car?.spz }}</span>
      </div>
      <InputIcon class="pi pi-arrow-right text-input" />
    </div>
  </div>
</template>
<script setup lang="ts">
import AppCarImage from '@/components/app/AppCarImage.vue'
import type { Car } from '@/types/Car'
defineProps<{
  cars: Car[]
}>()

const modelValue = defineModel<string>()
</script>
