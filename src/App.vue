<template>
  <ConfirmPopup />
  <AppForm :steps :brands :data-loading="loading" />
</template>

<script setup lang="ts">
import AppForm from './components/AppForm.vue'
import { useQuery } from '@tanstack/vue-query'
import { GET_INITIAL_DATA, type GET_INITIAL_DATA_TS } from '@/api/queries/initialQuery'
import { computed, provide } from 'vue'
import { useGraphQL } from '@/api/useApi'
import type { Brand } from '@/types/Brand'
import ConfirmPopup from 'primevue/confirmpopup'
import type { Model } from './types/Model'
import type { ServiceCategory } from './types/ServiceCategory'
import type { Service } from './types/Service'
import type { Step } from './types/Steps'

const loading = computed(() => isPending.value || isError.value)

const { isPending, isError, data } = useQuery({
  queryKey: ['data'],
  queryFn: async () => {
    const res = await useGraphQL<GET_INITIAL_DATA_TS>(GET_INITIAL_DATA)
    return res
  },
  select: (data) => {
    const categories: { [key: string]: ServiceCategory } = {}
    data?.categories.forEach((category) => {
      const services: { [key: string]: Service } = {}
      category.services.forEach((service) => {
        services[service.id] = service
      })
      categories[category.id] = { ...category, services }
    })
    return { ...data, categories }
  }
})

provide('config', data)

const steps = computed(() => {
  const steps: { [key: string]: Step } = {}
  data.value?.stepSettings.forEach(({ step, value, label, image }) => {
    if (!steps[step]) {
      steps[step] = {
        name: step,
        [image ? 'image' : label]: image ?? value
      }
    } else {
      steps[step][image ? 'image' : label] = image ?? value
    }
  })
  return steps
})

const brands = computed(() => {
  const brands: { [key: string]: Brand } = {}
  data.value?.brands.forEach((brand) => {
    const models: { [key: string]: Model } = {}
    brand.models.forEach((model) => {
      models[model.id] = model
    })
    brands[brand.id] = { ...brand, models }
  })
  return brands
})
</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
