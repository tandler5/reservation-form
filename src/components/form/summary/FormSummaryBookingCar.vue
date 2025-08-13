<template>
  <FormSummaryCar v-if="userCar" :preview :car="userCar" @edit-car="emit('edit-car')" />
</template>
<script setup lang="ts">
import FormSummaryCar from './FormSummaryCar.vue'
import { computed, inject, type Ref } from 'vue'
import type { Car } from '@/types/Car'
import type { Booking } from '@/types/Booking'
import type { SerializedBrand } from '@/types/Brand'

const props = withDefaults(
  defineProps<{
    carId?: Booking['carId']
    car?: Booking['car']
    brands: { [key: string]: SerializedBrand }
    preview: boolean
  }>(),
  { preview: false }
)

const emit = defineEmits(['edit-car'])

const userCars = inject<Ref<{ [key: string]: Car }>>('userCars')

const userCar = computed(() => {
  const selectedCar = props.carId ? userCars?.value?.[props.carId] : undefined
  if (selectedCar) {
    return selectedCar
  }
  const { brand, model, vin, year, performance, ccm } = props?.car ?? {}
  if (!props.brands?.[brand!]?.models?.[model!]) {
    return null
  }
  const car = {
    vin,
    year: year ? new Date(year).getFullYear() : undefined,
    performance,
    ccm,
    model: {
      ...props.brands?.[brand!]?.models?.[model!],
      brand: {
        ...props.brands?.[brand!],
        models: undefined
      }
    }
  }
  delete car.model.brand.models
  return car
})
</script>
