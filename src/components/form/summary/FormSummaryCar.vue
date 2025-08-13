<template>
  <div
    class="relative p-[10px] bg-[#f7f7f7] max-h-20 text-content text-xs mt-[10px] flex leading-[1.3]"
  >
    <AppEditButton v-if="!preview" class="absolute top-[10px] right-[10px]" @click="editCar" />
    <div class="flex gap-3">
      <div class="h-full min-h-full w-auto aspect-square">
        <AppCarImage :car />
      </div>
      <div class="flex flex-col">
        <span class="font-bold text-[#1f222b]">
          {{ car.model?.brand?.name }} {{ car.model?.name }}
        </span>
        <span v-if="car.spz">
          <span class="font-bold uppercase">{{ $t('SPZ') }}:</span>
          {{ car.spz }}
        </span>
        <span v-if="car.year">
          <span class="font-bold uppercase">{{ $t('Rok') }}:</span>
          {{ car.year }}
        </span>
        <span v-if="car.vin" class="whitespace-pre">
          <span class="font-bold uppercase">{{ $t('VIN') }}:</span>
          {{ car.vin }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import AppCarImage from '@/components/app/AppCarImage.vue'
import AppEditButton from '@/components/app/AppEditButton.vue'
import type { Car } from '@/types/Car'

withDefaults(defineProps<{ car: Car; preview: boolean }>(), { preview: false })

const emit = defineEmits(['edit-car'])

const editCar = () => {
  emit('edit-car')
}
</script>
