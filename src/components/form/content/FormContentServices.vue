<template>
  <FormKit preserve type="meta" name="category" validation="required" @node="setCategoryNode" />
  <FormKit preserve type="meta" name="service" validation="required" @node="setServiceNode" />
  <div
    class="flex gap-10 transition-all duration-300"
    :class="{ 'translate-x-[-110%]': value?.services?.category, 'w-full': loading }"
  >
    <Categories
      :active="!value?.services?.category"
      :categories
      :selected="selectedCategory"
      :loading
      @select-category="(id) => selectCategory(id)"
    />
    <Services
      v-if="value.services?.category"
      :active="!!value?.services?.category"
      :services="categories[selectedCategory]?.services"
      :selected="serviceNode?.value"
      @select-service="(id) => selectService(id)"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import type { FormKitNode } from '@formkit/core'
import Categories from '@/components/form/content/services/services/FormContentServicesCategories.vue'
import Services from '@/components/form/content/services/services/FormContentServicesServices.vue'
import type { Form } from '@/types/Form'
import type { ServiceCategory } from '@/types/ServiceCategory'
import type { Service } from '@/types/Service'

defineProps<{
  categories: { [key: string]: ServiceCategory }
  value: Form['multiStep']
  loading?: boolean
}>()
const selectedCategory = defineModel<string>('selectedCategory', { default: null })

const categoryNode: Ref<FormKitNode | undefined> = ref()
const serviceNode: Ref<FormKitNode<Form['multiStep']['services']['service']> | undefined> = ref()

const setCategoryNode = (node: FormKitNode) => {
  categoryNode.value = node
  selectedCategory.value = node.value as string
}

const setServiceNode = (node: FormKitNode) => {
  serviceNode.value = node as FormKitNode<Form['multiStep']['services']['service']>
}

const selectCategory = async (categoryId: string) => {
  if (selectedCategory.value !== categoryId) {
    await serviceNode.value?.input(undefined)
  }
  await categoryNode.value?.input(categoryId)
  selectedCategory.value = categoryId

  const bookingIndex = serviceNode.value?.at('$root.currentBookingEdit') as FormKitNode<number>
  const bookignsNode = serviceNode.value?.at('$root.bookings') as FormKitNode<Form['bookings']>
  const currentValue = JSON.parse(JSON.stringify(bookignsNode.value))
  if (!currentValue[bookingIndex?.value]) {
    await bookignsNode?.input([...currentValue, { category: categoryId, service: undefined }])
  } else {
    currentValue[bookingIndex?.value].category = categoryId
    currentValue[bookingIndex?.value].service = undefined
    await bookignsNode?.input(currentValue)
  }
}

const selectService = async (service: Service) => {
  await serviceNode.value?.input(service)

  const bookingIndex = serviceNode.value?.at('$root.currentBookingEdit') as FormKitNode<number>
  const bookignsNode = serviceNode.value?.at('$root.bookings') as FormKitNode<Form['bookings']>
  const currentValue = JSON.parse(JSON.stringify(bookignsNode.value))
  currentValue[bookingIndex?.value].service = service.id
  await bookignsNode?.input(currentValue)
  const stepsNode = serviceNode.value?.at('$root.multiStep') as FormKitNode<Form['multiStep']>
  if (service.extras.length) {
    stepsNode.next()
  } else {
    stepsNode.goTo('custom_fields_for_booking')
  }
}
</script>
