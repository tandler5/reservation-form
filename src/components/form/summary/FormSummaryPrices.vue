<template>
  <div class="flex flex-col">
    <div class="flex items-center mb-[5px] mt-[15px] gap-[10px]">
      <div class="text-content uppercase font-medium tracking-[1px] relative text-[11px]">
        {{ $t('Služba') }}
      </div>
      <div class="h-[1px] bg-[#f1f1f1] flex-1"></div>
    </div>
    <div>
      <div v-for="(booking, index) in bookings" :key="index" class="flex justify-between mb-[7px]">
        <div class="text-[#1f222b] font-normal text-left leading-[1.3] text-sm">
          {{ data?.categories[booking.category]?.services?.[booking.service]?.name }}
        </div>
        <div class="font-normal text-left leading-[1.3] text-sm">
          {{
            calcPriceWithoutVats(
              parseInt(data?.categories[booking.category]?.services?.[booking.service]?.price_min!),
              data?.taxes ?? []
            )
          }}{{ $t('Kč') }}
        </div>
      </div>
      <button
        class="relative items-center px-2.5 py-2 mt-5 border border-dotted hover:border-solid text-primary border-[#13171a] flex gap-2.5 font- w-full"
        @click.prevent="addNewServiceToBooking"
      >
        <span class="plus alt size-3"></span>
        <span class="mx-auto text-[#13171a] font-medium">{{
          $t('Přidat další službu do objednávky')
        }}</span>
      </button>
    </div>
    <div class="flex items-center mb-[5px] mt-[15px] gap-[10px]">
      <div class="text-content uppercase font-medium tracking-[1px] relative text-[11px]">
        {{ $t('Doplňky') }}
      </div>
      <div class="h-[1px] bg-[#f1f1f1] flex-1"></div>
    </div>
    <div v-for="(extra, index) in extras" :key="index" class="flex justify-between mb-[7px]">
      <div class="text-[#1f222b] font-normal text-left leading-[1.3] text-sm">
        {{ extra.name }}
        <span
          v-if="extra.quantity && extra.quantity > 1"
          class="text-content text-[11px] font-normal leading-[1.3]"
          >({{ extra.quantity }} x {{ extra.charge_amount }}{{ $t('Kč') }})</span
        >
      </div>
      <div class="font-normal text-left leading-[1.3] text-sm">
        {{ extra.quantity ? extra.quantity * extra.charge_amount : extra.charge_amount
        }}{{ $t('Kč') }}
      </div>
    </div>
    <div class="mb-[5px] flex justify-between mt-5">
      <div class="text-[#1f222b] font-medium leading-[1.3] text-sm">
        {{ $t('Mezisoučet') }}
      </div>
      <div class="text-[#1f222b] font-normal leading-[1.3] text-sm">
        {{
          getSumOfBookingsWithoutVats(
            data!,
            values.bookings ?? [],
            Object.values(values.multiStep?.service_extras?.extras ?? {}),
            data?.taxes
          )
        }}{{ $t('Kč') }}
      </div>
    </div>
    <div v-for="tax in data?.taxes" :key="tax.id" class="mb-[5px] flex justify-between">
      <div class="text-[#1f222b] font-normal leading-[1.3] text-sm">
        {{ tax.name }} ({{ tax.value }}{{ getVatSymbol(tax.type) }})
      </div>
      <div class="text-[#1f222b] font-normal leading-[1.3] text-sm">
        {{ calcVat(data!, tax.value, values.bookings ?? [], extrasSumWithVat) }}{{ $t('Kč') }}
      </div>
    </div>
    <div
      class="pt-[5px] mt-[5px] border-[#1f222b] mb-0 border-t flex justify-between *:font-priceTotal"
    >
      <div class="text-[#1f222b] font-medium leading-[1.3] text-base w-max">
        {{ $t('Předpokládaná Cena') }}
      </div>
      <div class="text-[#1f222b] font-medium leading-[1.3] text-base w-max">
        {{ getTotalSum(values.bookings ?? [], data?.taxes ?? []) }}{{ $t('Kč') }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { SERIALIZED_INITIAL_DATA_TS } from '@/api/queries/initialQuery'
import type { Booking } from '@/types/Booking'
import type { ServiceExtra } from '@/types/ServiceExtra'
import { inject, computed, type Ref } from 'vue'
import { calcPriceWithoutVats, getVatSymbol, calcVat } from '@/composables/vat'
import type { Form } from '@/types/Form'
import { getSumOfBookingsWithoutVats } from '@/composables/bookings'
import type { Tax } from '@/types/Tax'

const props = defineProps<{ bookings: Booking[]; extras: ServiceExtra[]; values: Form }>()
const emit = defineEmits(['add-new-service'])

const data = inject<Ref<SERIALIZED_INITIAL_DATA_TS>>('config')

const extrasSumWithVat = computed<number>(() =>
  Object.values(props.values.multiStep?.service_extras?.extras ?? {}).reduce(
    (acc: number, extra) => acc + extra.charge_amount * extra.quantity!,
    0
  )
)

const extrasSum = computed<number>(() =>
  Object.values(props.values.multiStep?.service_extras?.extras ?? {}).reduce(
    (acc: number, extra) =>
      acc + calcPriceWithoutVats(extra.charge_amount * extra.quantity!, data?.value?.taxes ?? []),
    0
  )
)

const getTotalSum = (bookings: Booking[], taxes: Tax[]) => {
  const total =
    getSumOfBookingsWithoutVats(data?.value!, bookings, undefined, taxes) +
    taxes.reduce(
      (acc, tax) => acc + calcVat(data?.value!, tax.value, bookings, extrasSumWithVat.value),
      0
    ) +
    extrasSum.value

  if (props.values.coupons) {
    const discounts = props.values.coupons.reduce((acc, coupon) => {
      if (coupon.discount_type === 'percent') {
        return acc + (coupon.discount_value / 100) * total
      }
      return acc + coupon.discount_value
    }, 0)
    return total - discounts
  }
  return total
}

const addNewServiceToBooking = () => {
  emit('add-new-service')
}
</script>
<style scoped>
.plus {
  --b: 2px; /* the thickness */
  --color: #13171a;
  aspect-ratio: 1;
  border: 10px solid #000; /* the outer space */
  background: conic-gradient(from 90deg at var(--b) var(--b), var(--color) 90deg, #fff 0)
    calc(100% + var(--b) / 2) calc(100% + var(--b) / 2) / calc(50% + var(--b)) calc(50% + var(--b));
  display: inline-block;
}

.alt {
  border: none;
  background: conic-gradient(from 90deg at var(--b) var(--b), #fff 90deg, var(--color) 0)
    calc(100% + var(--b) / 2) calc(100% + var(--b) / 2) / calc(50% + var(--b)) calc(50% + var(--b));
}
</style>
