<template>
  <div class="pt-[25px] pb-[30px] px-[30px] mt-[20px] mx-[-30px] mb-[-30px] border-t border-[#eee]">
    <div
      class="border-b border-[#f1f1f1] pb-[5px] mb-[5px] uppercase text-[11px] font-medium text-content tracking-[1px]"
    >
      {{ $t('Rozpis nákladů') }}
    </div>
    <div v-for="booking in bookings" :key="booking.id" class="mb-[5px] flex justify-between">
      <div class="text-[#1f222b] font-normal leading-[1.3] text-sm">
        {{ data?.categories[booking.category]?.services?.[booking.service]?.name }}
        <span
          v-if="typeof booking.quantity === 'number' && booking.quantity > 1"
          class="text-content text-[11px]"
        >
          ({{ booking.quantity }}x
          {{
            calcPriceWithoutVats(
              parseInt(data?.categories[booking.category]?.services?.[booking.service]?.price_min!),
              data?.taxes ?? []
            )
          }}{{ $t('Kč') }})
        </span>
      </div>
      <div class="text-[#1f222b] font-normal leading-[1.3] text-sm">
        {{
          calcPriceWithoutVats(
            parseInt(data?.categories[booking.category]?.services?.[booking.service]?.price_min!),
            data?.taxes ?? []
          ) * (booking.quantity ?? 1)
        }}{{ $t('Kč') }}
      </div>
    </div>
    <FormSummaryExtrasPrices :extras :taxes="data?.taxes ?? []" />
    <div class="mt-[20px]"></div>
    <div v-if="activeStep !== 'verify'" class="mb-[5px] pt-[20px] flex justify-between">
      <AppFormCouponsApply :duplicate-coupon="duplicateCoupon" />
    </div>
    <div class="mb-[5px] flex justify-between">
      <div class="text-[#1f222b] font-medium leading-[1.3] text-sm">
        {{ $t('Mezisoučet') }}
      </div>
      <div class="text-[#1f222b] font-normal leading-[1.3] text-sm">
        {{
          getSumOfBookingsWithoutVats(
            data!,
            bookings ?? [],
            Object.values(extras ?? {}),
            data?.taxes
          )
        }}{{ $t('Kč') }}
      </div>
    </div>
    <div v-if="activeStep === 'verify' && coupons?.length" class="mb-[5px] flex flex-col gap-1">
      <div class="text-[#1f222b] font-medium leading-[1.3] text-sm">{{ $t('Kupóny') }}</div>
      <div v-for="coupon in coupons" class="flex justify-between" :key="coupon.id">
        <div class="bg-[#eee] font-medium px-[3px] py-[1px] text-xs uppercase rounded">
          {{ coupon.code }}
        </div>
        <div class="text-success font-normal leading-[1.3] text-sm">
          - {{ coupon.discount_value }}{{ coupon.discount_type === 'fixed' ? $t('Kč') : '%' }}
        </div>
      </div>
    </div>
    <div v-for="tax in data?.taxes" :key="tax.id" class="mb-[5px] flex justify-between">
      <div class="text-[#1f222b] font-normal leading-[1.3] text-sm">
        {{ tax.name }} ({{ tax.value }}{{ getVatSymbol(tax.type) }})
      </div>
      <div class="text-[#1f222b] font-normal leading-[1.3] text-sm">
        {{ calcVat(data!, tax.value, bookings ?? [], extrasSumWithVat) }}{{ $t('Kč') }}
      </div>
    </div>
    <div
      class="pt-[5px] mt-[5px] border-[#1f222b] mb-0 border-t flex justify-between *:font-priceTotal"
    >
      <div class="text-[#1f222b] font-medium leading-[1.3] text-base w-max">
        {{ $t('Předpokládaná Cena') }}
      </div>
      <div class="text-[#1f222b] font-medium leading-[1.3] text-base w-max">
        {{ getTotalSum(bookings ?? [], data?.taxes ?? []) }}{{ $t('Kč') }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import AppFormCouponsApply from '@/components/form/coupons/AppFormCouponsApply.vue'
import FormSummaryExtrasPrices from './FormSummaryExtrasPrices.vue'
import type { BookingInput } from '@/types/Booking'
import { calcPriceWithoutVats, getVatSymbol, calcVat } from '@/composables/vat'
import { getSumOfBookingsWithoutVats } from '@/composables/bookings'
import { computed, inject, type Ref } from 'vue'
import type { SERIALIZED_INITIAL_DATA_TS } from '@/api/queries/initialQuery'
import type { Tax } from '@/types/Tax'
import type { ServiceExtra } from '@/types/ServiceExtra'
import type { Coupon } from '@/types/Coupon'

const props = withDefaults(
  defineProps<{
    bookings: BookingInput[]
    activeStep: string | unknown
    extras: {
      [key: string]: ServiceExtra
    }
    couponCode?: string
    coupons: Coupon[]
  }>(),
  { coupons: () => [] }
)
const data = inject<Ref<SERIALIZED_INITIAL_DATA_TS>>('config')

const extras = computed(() => {
  const allExtras = props.bookings?.reduce<{ [key: string]: ServiceExtra }>((acc, booking) => {
    Object.values(booking.extras ?? {}).forEach((extra) => {
      if (acc[extra.id]) {
        acc[extra.id].quantity = (acc[extra.id].quantity ?? 0) + (extra.quantity ?? 0)
      } else {
        acc[extra.id] = { ...extra }
      }
    })
    return acc
  }, {})
  return Object.values(allExtras ?? {})
})

const duplicateCoupon = computed(
  () => props.coupons?.some((c) => c.code === props.couponCode) ?? false
)

const extrasSum = computed<number>(() =>
  Object.values(props.extras ?? {}).reduce(
    (acc: number, extra) =>
      acc + calcPriceWithoutVats(extra.charge_amount * extra.quantity!, data?.value?.taxes ?? []),
    0
  )
)

const extrasSumWithVat = computed<number>(() =>
  Object.values(props.extras ?? {}).reduce(
    (acc: number, extra) => acc + extra.charge_amount * extra.quantity!,
    0
  )
)

const getTotalSum = (bookings: BookingInput[], taxes: Tax[]) => {
  const total =
    getSumOfBookingsWithoutVats(data?.value!, props.bookings, undefined, data?.value?.taxes) +
    taxes.reduce(
      (acc, tax) => acc + calcVat(data?.value!, tax.value, bookings, extrasSumWithVat.value),
      0
    ) +
    extrasSum.value

  if (props.coupons.length) {
    const discounts = props.coupons.reduce((acc, coupon) => {
      if (coupon.discount_type === 'percent') {
        return acc + (coupon.discount_value / 100) * total
      }
      return acc + coupon.discount_value
    }, 0)
    return total - discounts
  }
  return total
}
</script>
