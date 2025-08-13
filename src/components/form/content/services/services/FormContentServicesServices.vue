<template>
  <ul class="flex flex-col gap-3 pb-[70px] min-w-full">
    <li
      v-for="(service, _, index) in services"
      :key="service.id"
      :tabindex="active ? index + 1 : undefined"
      :class="{ 'border-primary shadow-button': selected?.id === service.id }"
      class="rounded-lg focus:border-primary flex group bg-white border border-[#e5e7ee] items-center shadow-none outline-none p-2.5 cursor-pointer group hover:border-primary hover:shadow-button"
      @click="$emit('select-service', service)"
      @keydown.enter.prevent="$emit('select-service', service)"
    >
      <div
        class="h-[45px] w-auto aspect-square flex justify-center items-center mr-[15px]"
        v-if="service.image?.url"
      >
        <AppImage class="object-contain" :src="service.image?.url?.replace('online', 'cz')" />
      </div>
      <div
        class="mr-auto py-[5px] group-hover:translate-x-[3px] transition-transform duration-200 ease-out flex flex-col gap-[3px]"
      >
        <span class="leading-[1.3]">
          {{ service.name }}
        </span>
        <span class="text-content text-[12px]"> {{ service.short_description }}</span>
      </div>
      <div class="border-l border-[#0000000d] pl-[15px] ml-[10px] text-center flex flex-col">
        <span class="text-primary font-medium text-base">
          {{ parseInt(service.price_min) }}&nbsp;{{ $t('Kč') }}</span
        ><span v-if="service.price_min !== service.price_max" class="text-content text-xs">{{
          $t('Od')
        }}</span>
      </div>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import type { Service } from '@/types/Service'

defineProps<{ active: boolean; services: { [key: string]: Service }; selected: any }>()
</script>
