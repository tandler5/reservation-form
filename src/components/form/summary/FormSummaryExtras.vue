<template>
  <div
    v-if="Object.keys(extras ?? {}).length"
    class="p-[10px] bg-[#f7f7f7] text-content text-xs mt-[10px] leading-[1.3] relative"
  >
    <AppEditButton class="right-[10px] top-[10px] float-right" @click="emit('edit-extras')" />
    <span>{{ $t('Doplňky') }}: </span>
    <span class="font-bold">{{ extrasNames }}</span>
  </div>
</template>
<script setup lang="ts">
import AppEditButton from '@/components/app/AppEditButton.vue'
import type { ServiceExtra } from '@/types/ServiceExtra'
import { computed } from 'vue'

const props = defineProps<{ extras?: { [key: string]: ServiceExtra } }>()
const emit = defineEmits(['edit-extras'])

const extrasNames = computed(() => {
  return Object.values(props.extras ?? {})
    ?.map((extra) => {
      if (typeof extra.quantity === 'number' && extra.quantity > 1) {
        return `${extra.name} (${extra.quantity}x)`
      }
      return extra.name
    })
    .join(', ')
})
</script>
