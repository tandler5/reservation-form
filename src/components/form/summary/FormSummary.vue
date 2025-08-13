<template>
  <div class="summary" :class="{ open: phonePanelOpened }">
    <header
      class="text-primary p-[5px] uppercase m-0 relative w-full h-[60px] border-b-[#0000000d] border-b"
    >
      <div class="flex px-[20px] py-[12px] bg-radial-gradient bg-7 relative">
        <span class="bg-white p-[5px] leading-[1] relative inline-block">
          {{ $t('Souhrn') }}
        </span>
        <button
          v-if="phonePanelOpened"
          class="px-[5px] py-[3px] leading-[1.2] hidden items-center absolute right-[20px] max-[1051px]:flex bg-white"
          @click="phonePanelOpened = false"
        >
          <i class="pi pi-times text-black"></i>
        </button>
      </div>
    </header>
    <div class="pt-[25px] px-[20px] pb-[30px] relative flex flex-col justify-between flex-1">
      <div>
        <div class="pb-[10px] border-b border-solid border-[#f1f1f1] mb-[15px]">
          <FormContentServicesList
            :mode
            :brands
            :active-step
            :bookings="values.bookings"
            @edit-step="emit('edit-step', $event)"
          />
        </div>
        <div v-if="values?.contact?.customer" class="flex items-baseline mb-[10px] gap-1">
          <div class="flex flex-1 items-baseline m-0 gap-1">
            <div class="text-content uppercase font-medium relative text-xs tracking-[1px]">
              {{ $t('Zákazník') }}
            </div>
            <div class="h-[1px] bg-[#f1f1f1] flex-1"></div>
          </div>
          <div class="flex items-center font-medium text-[#1f222b] text-sm">
            {{ values?.contact?.customer?.firstName }} {{ values?.contact?.customer?.lastName }}
            <AppEditButton
              v-if="customerEditVisible"
              class="ml-2"
              @click="emit('edit-step', { type: 'customer' })"
            />
          </div>
        </div>
      </div>
      <FormSummaryPricesList
        :bookings
        :active-step
        :coupon-code="values.multiStep.coupon?.code"
        :extras="values.multiStep.service_extras.extras"
        :coupons="values.coupons"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, shallowRef, watch, inject } from 'vue'
import AppEditButton from '@/components/app/AppEditButton.vue'
import FormContentServicesList from '@/components/form/content/services/FormContentServicesList.vue'
import type { Form } from '@/types/Form'
import type { BookingInput } from '@/types/Booking'
import type { SerializedBrand } from '@/types/Brand'
import FormSummaryPricesList from './FormSummaryPricesList.vue'
const props = defineProps<{
  values: Form
  activeStep: string | unknown
  brands: { [key: string]: SerializedBrand }
  mode: string
}>()

const phonePanelOpened = inject('phonePanelOpened')

const emit = defineEmits(['edit-step'])

const openedSummary = shallowRef<number[]>([0])

const customerEditVisible = computed(() => {
  return props.values.bookings.some((b) => b.time)
})

const bookings = computed(() =>
  Object.values(
    props.values.bookings
      ?.filter((b) => b.service !== undefined)
      ?.reduce<{ [key: string]: BookingInput }>((acc, b) => {
        if (acc[b.service]) {
          acc[b.service].quantity = (acc[b.service].quantity ?? 0) + (b.quantity ?? 1)
        } else {
          acc[b.service] = { ...b, quantity: 1 }
        }
        return acc
      }, {}) ?? {}
  )
)

watch(bookings, (newValue) => {
  openedSummary.value = [newValue.length - 1]
})
</script>
<style scoped>
.summary {
  @apply overflow-hidden flex grow-0 shrink-0 basis-[270px] w-[270px] transition-all ease-form  z-10  flex-col relative bg-white;
}
@media (max-width: 1050px) {
  .summary {
    @apply hidden;
  }
  .summary.open {
    @apply !block fixed top-1/2 left-1/2 w-auto flex-1 bottom-auto z-10 shadow-summary max-h-[90vh] max-w-[90vw] min-w-[80vw] -translate-y-1/2 animate-summary fill-mode-both rounded-none;
  }
}
</style>
