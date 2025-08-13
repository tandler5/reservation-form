<template>
  <ul class="flex flex-col gap-3 pb-[70px] min-w-full">
    <li
      v-for="({ id, name, services, image }, index) in loading
        ? Array(5).fill({})
        : sortedCategories"
      :key="index"
      :tabindex="active ? index + 1 : undefined"
      :class="{ 'border-primary shadow-button': selected === id && !loading }"
      class="min-w-[409px] focus:border-primary rounded-lg flex group bg-white border border-[#e5e7ee] items-center shadow-none outline-none p-2.5 cursor-pointer group hover:border-primary hover:shadow-button"
      @click="$emit('select-category', id)"
      @keydown.enter.prevent="$emit('select-category', id)"
    >
      <component
        :is="loading ? 'Skeleton' : 'div'"
        v-if="image?.url || loading"
        class="!min-h-[45px] !min-w-[45px] !size-[45px] flex justify-center items-center mr-[15px]"
      >
        <AppImage
          class="object-contain !min-h-[45px] !min-w-[45px] !size-[45px]"
          :src="image?.url?.replace('online', 'cz')"
        />
      </component>
      <component
        :is="loading ? 'Skeleton' : 'div'"
        :class="{ '!w-[150px]': loading }"
        class="mr-auto py-[5px] block group-hover:translate-x-[3px] transition-transform duration-200 ease-out"
      >
        {{ name }}
      </component>
      <component
        :is="loading ? 'Skeleton' : 'div'"
        class="text-content text-[11px]"
        :class="{ '!w-[51px]': loading }"
      >
        {{ Object.keys(services).length }} {{ $t('Služeb', Object.keys(services).length) }}
      </component>
    </li>
  </ul>
</template>
<script setup lang="ts">
import type { ServiceCategory } from '@/types/ServiceCategory'
import { computed } from 'vue'
const props = defineProps<{
  active: boolean
  categories: { [key: string]: ServiceCategory }
  loading?: boolean
  selected?: string
}>()
const sortedCategories = computed(() => {
  return Object.values(props.categories ?? {})
    ?.toSorted((a, b) => {
      return parseInt(a.order_number) - parseInt(b.order_number)
    })
    .filter((category) => Object.keys(category.services).length)
})
</script>
