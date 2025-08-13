<template>
  <div>
    <div v-if="visibleQRCode && qrCode"></div>
    <div class="mb-5">
      <div class="flex flex-col gap-2">
        <div class="flex justify-between">
          <div class="flex flex-col w-max">
            <div class="text-sm tracking-[0.5px] uppercase font-semibold text-content w-max">
              {{ $t('Objednávka') }}&nbsp;#
            </div>
            <strong class="text-4xl tracking-normal text-[#14161d] block leading-[1.1] w-max">
              {{ values?.order?.id }}
            </strong>
          </div>
          <div
            v-if="!visibleQRCode && qrCode"
            class="flex flex-col items-center pt-2 cursor-pointer"
          >
            <i class="pi pi-qrcode text-4xl"></i>
            <span
              class="leading-[1.2] border-b border-[#777] font-semibold mt-[5px] text-xs uppercase tracking-[0.5px]"
              @click="visibleQRCode = true"
            >
              {{ $t('Zobrazit QR kód') }}
            </span>
          </div>
        </div>
        <div>
          <add-to-calendar-button
            size="4"
            style="
              --btn-background: #fff;
              --btn-text: #ad3d12;
              --btn-hover-text: #ad3d12;
              --list-background: #fff;
              --list-hover-background: #f1f5f9;
              --btn-border: #ad3d12;
              --btn-padding-y: 0.125rem;
              --btn-padding-x: 0.375rem;
              --btn-font-weight: 600;
              --btn-border-radius: 0.25rem;
              --font: Inter var, sans-serif;
            "
            hideBackground
            iCalFileName="Reminder"
            :dates="JSON.stringify(events)"
            language="cs"
            :label="$t('Přidat do kalendáře')"
            options="'Apple','Google','iCal','Outlook.com'"
          ></add-to-calendar-button>
        </div>
      </div>
    </div>
    <div>
      <FormContentServicesList preview :brands :bookings="serializedBookingsData" />
      <FormSummaryCustomer :customer="props.values.order?.customer" />
      <FormSummaryPricesList
        active-step="verify"
        :bookings="serializedBookingsData"
        :extras="{}"
        :coupons="values.coupons"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import FormContentServicesList from '@/components/form/content/services/FormContentServicesList.vue'
import FormSummaryCustomer from '@/components/form/summary/FormSummaryCustomer.vue'
import { toDataURL } from 'qrcode'

import { minutesToTimeString } from '@/composables/time'
import type { SerializedBrand } from '@/types/Brand'
import type { MakeReservation } from '@/types/Reservation'
import { computed, shallowRef } from 'vue'
import FormSummaryPricesList from '../summary/FormSummaryPricesList.vue'
import type { ServiceCategory } from '@/types/ServiceCategory'
import 'add-to-calendar-button'
import { calcEndDateTime, toShortDatefromDate } from '@/composables/date'

const props = defineProps<{
  values: MakeReservation
  brands: { [key: string]: SerializedBrand }
  categories: { [key: string]: ServiceCategory }
}>()
const visibleQRCode = shallowRef(false)

const events = computed(() =>
  props.values.bookings.map((booking) => {
    const vehicleBrand = props.brands[booking.vehicle?.model.brand_id!]
    const vehicleModel = vehicleBrand.models[booking.vehicle?.model.id!]
    const service = props.categories[booking.service.category.id].services[booking.service.id]
    const { endDate, endTime } = calcEndDateTime(
      toShortDatefromDate(new Date(booking.start_date!)),
      booking.start_time,
      booking.service.duration
    )

    return {
      name: `${service.name} - ${vehicleBrand.name} ${vehicleModel.name}`,
      startDate: toShortDatefromDate(new Date(booking.start_date!)),
      startTime: minutesToTimeString(Number(booking.start_time)),
      location: booking.location?.full_address,
      endDate,
      endTime
    }
  })
)

const qrCode = shallowRef()

const serializedBookingsData = computed(() => {
  return (
    props.values.bookings?.map((b) => {
      const year = new Date()
      year.setFullYear(b.car?.year!)
      return {
        ...b,
        service: b.service.id,
        category: b.service.category.id,
        car: {
          brand: b.car?.model.brand_id,
          model: b.car?.model.id,
          vin: b.car?.vin,
          year
        },
        day: new Date(b.start_date!),
        time: minutesToTimeString(Number(b.start_time))
      }
    }) ?? []
  )
})
</script>
