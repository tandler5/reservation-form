<template>
  <Accordion multiple v-model:active-index="openedSummary">
    <AccordionTab
      v-for="(booking, index) in bookings"
      :disabled="bookings.length === 1"
      :key="index"
      :pt="{
        root: {
          class: index + 1 !== bookings.length ? 'border-b border-[#e5e7ee]' : ''
        },
        content: {
          class: 'p-0'
        },
        header: {
          class: 'opacity-100 !cursor-auto'
        },
        headerAction: {
          class:
            bookings.length > 1
              ? index === 0
                ? 'px-0 pt-0 flex gap-2 pb-4 items-start'
                : 'px-0 py-4 flex gap-2 items-start'
              : 'cursor-default flex gap-2 px-0 py-0 items-start'
        }
      }"
    >
      <template #headericon="{ active }">
        <div
          class="text-[22px] flex items-center mb-[5px] font-medium text-[#1f222b] leading-[1.3]"
        >
          <component
            v-if="!active"
            :is="ChevronDownIcon"
            aria-hidden="true"
            :class="bookings.length > 1 ? 'mt-2 mr-0' : '!hidden'"
          />
          <component
            v-else
            :is="ChevronRightIcon"
            aria-hidden="true"
            class="-rotate-90"
            :class="bookings.length > 1 ? 'mt-2 mr-0' : '!hidden'"
          />
        </div>
      </template>
      <template
        v-if="data?.categories[booking.category]?.services?.[booking.service]?.name"
        #header
      >
        <div class="flex flex-col w-full">
          <div
            class="text-[22px] mb-[5px] font-medium text-[#1f222b] leading-[1.3] inline items-center gap-2"
          >
            {{ data?.categories[booking.category]?.services?.[booking.service]?.name }}
            <AppEditButton
              v-if="!preview && openedSummary.includes(index)"
              class="!inline align-text-bottom"
              @click="emit('edit-step', { type: 'service', bookingIndex: index })"
            />
          </div>
          <div v-if="booking.day" class="text-primary font-medium flex items-center gap-2">
            {{ getBookingDateTime(booking.day, booking.time!) }}
            <AppEditButton
              v-if="!preview && openedSummary.includes(index)"
              class="text-[#1f222b]"
              @click="emit('edit-step', { type: 'date', bookingIndex: index })"
            />
          </div>
        </div>
      </template>
      <FormSummaryBookingCar
        v-if="activeStep !== 'custom_fields_for_booking' || mode === 'select'"
        :preview
        :brands
        :car="booking.car"
        :car-id="booking.carId"
        @edit-car="emit('edit-step', { type: 'car', bookingIndex: index })"
      />
      <FormSummaryExtras
        :extras="booking.extras"
        @edit-extras="emit('edit-step', { type: 'extras', bookingIndex: index })"
      />
    </AccordionTab>
  </Accordion>
</template>
<script setup lang="ts">
import FormSummaryBookingCar from '@/components/form/summary/FormSummaryBookingCar.vue'
import FormSummaryExtras from '@/components/form/summary/FormSummaryExtras.vue'

import { inject, type Ref, defineAsyncComponent } from 'vue'
import type { BookingInput } from '@/types/Booking'
import type { SerializedBrand } from '@/types/Brand'
import type { SERIALIZED_INITIAL_DATA_TS } from '@/api/queries/initialQuery'
import AppEditButton from '@/components/app/AppEditButton.vue'

const ChevronDownIcon = defineAsyncComponent(() => import('primevue/icons/chevrondown'))
const ChevronRightIcon = defineAsyncComponent(() => import('primevue/icons/chevronright'))

withDefaults(
  defineProps<{
    bookings: BookingInput[]
    brands: { [key: string]: SerializedBrand }
    preview?: boolean
    activeStep?: string
    mode?: string
  }>(),
  {
    preview: false
  }
)
const emit = defineEmits(['edit-step'])

const data = inject<Ref<SERIALIZED_INITIAL_DATA_TS>>('config')

const openedSummary = defineModel<number[]>('openedSummary', { default: () => [0] })

const getBookingDateTime = (dateWithoutTime: Date, time?: string) => {
  const date = new Date(dateWithoutTime)
  const [hours, minutes] = time ? time.split(':') : []
  if (time) {
    date.setHours(Number(hours), Number(minutes))
  }
  return new Intl.DateTimeFormat('cs-cz', {
    dateStyle: 'long',
    ...(time ? { timeStyle: 'short' } : {})
  }).format(date)
}
</script>
