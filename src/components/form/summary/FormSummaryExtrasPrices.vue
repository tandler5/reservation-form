<template>
  <div
    v-for="(extra, extraId) in extras"
    :key="extraId"
    class="mb-[5px] flex justify-between gap-3"
  >
    <div class="text-[#1f222b] font-normal leading-[1.3] text-sm">
      {{ extra.name }}
      <span
        v-if="typeof extra.quantity === 'number' && extra.quantity > 1"
        class="text-content text-[11px]"
      >
        ({{ extra.quantity }}x {{ calcPriceWithoutVats(extra.charge_amount, taxes) }}{{ $t('Kč') }})
      </span>
    </div>
    <div class="text-[#1f222b] font-normal leading-[1.3] text-sm">
      {{ calcPriceWithoutVats(extra.charge_amount * (extra.quantity ?? 1), taxes) }}{{ $t('Kč') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ServiceExtra } from '@/types/ServiceExtra'
import { calcPriceWithoutVats } from '@/composables/vat'
import type { Tax } from '@/types/Tax'

defineProps<{ extras: ServiceExtra[]; taxes: Tax[] }>()
</script>
