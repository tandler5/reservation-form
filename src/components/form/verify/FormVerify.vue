<template>
  <div class="flex flex-col gap-5">
    <div class="text-content leading-[1.3] text-sm">
      Zkontrolujte své údaje o rezervaci, můžete se vrátit zpět a upravit je nebo kliknutím na
      tlačítko Odeslat potvrdit rezervaci.
    </div>
    <div>
      <FormContentServicesList :bookings="data!.bookings" :brands :opened-summary="[]" />
      <FormSummaryExtras :extras="data?.multiStep?.service_extras?.extras" />
      <FormSummaryCustomer
        :customer="data?.contact?.customer! ?? data?.multiStep?.contact?.customer"
      />
      <FormSummaryPrices
        :bookings="data!.bookings"
        :values="data!"
        :extras
        @add-new-service="emit('add-new-service')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'
import FormSummaryExtras from '../summary/FormSummaryExtras.vue'
import FormSummaryCustomer from '../summary/FormSummaryCustomer.vue'
import FormSummaryPrices from '../summary/FormSummaryPrices.vue'
import FormContentServicesList from '@/components/form/content/services/FormContentServicesList.vue'
import type { Form } from '@/types/Form'
import type { SerializedBrand } from '@/types/Brand'
import type { ServiceExtra } from '@/types/ServiceExtra'

defineProps<{ brands: { [key: string]: SerializedBrand } }>()

const emit = defineEmits(['add-new-service'])

const data = inject<Ref<Form>>('data')

const extras = computed(() => {
  const allExtras = data!.value.bookings?.reduce<{ [key: string]: ServiceExtra }>(
    (acc, booking) => {
      Object.values(booking.extras ?? {}).forEach((extra) => {
        if (acc[extra.id]) {
          acc[extra.id].quantity = (acc[extra.id].quantity ?? 0) + (extra.quantity ?? 0)
        } else {
          acc[extra.id] = { ...extra }
        }
      })
      return acc
    },
    {}
  )
  return Object.values(allExtras ?? {})
})
</script>
