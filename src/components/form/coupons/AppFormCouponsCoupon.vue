<template>
  <div
    class="relative rounded-lg flex group bg-white border border-primary items-center outline-none p-2.5 cursor-pointer group"
  >
    <div class="flex gap-2">
      <span class="size-6 rounded-full border grid place-items-center border-primary bg-light/10">
        <i class="pi pi-check !text-xs text-primary"></i>
      </span>
      <div class="flex flex-col">
        <span class="leading-[1.3] text-sm">
          <span class="font-medium text-base">{{ coupon.code }}</span> {{ $t('aplikován') }}
        </span>
        <span class="leading-[1.1]">
          <span class="text-xs text-content">
            - {{ coupon.discount_value }}
            {{ coupon.discount_type === 'fixed' ? $t('Kč') : '%' }}
            {{ $t('na') }} vše
          </span>
        </span>
      </div>
    </div>
    <button
      class="absolute top-1 right-1 size-6 grid place-content-center"
      @click.prevent="confirmRemoveCoupon($event)"
    >
      <i class="pi pi-times !text-xs text-[#d03739d4] hover:text-[#d03739]"></i>
    </button>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfirm } from 'primevue/useconfirm'
import type { Coupon } from '@/types/Coupon'

defineProps<{ coupon: Coupon }>()
const emit = defineEmits(['remove'])

const confirm = useConfirm()
const { t } = useI18n()

const confirmRemoveCoupon = (event: MouseEvent) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: t('Opravdu chcete odebrat tento kupón?'),
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm text-sm',
    acceptClass: 'p-button-danger p-button-sm text-sm ml-1',
    acceptLabel: t('Ano'),
    rejectLabel: t('Ne'),
    accept: () => {
      emit('remove')
    }
  })
}
</script>
<style>
.p-button.p-button-danger,
.p-button-group.p-button-danger > .p-button,
.p-splitbutton.p-button-danger > .p-button {
  color: #ffffff;
  background: #ef4444;
  border: 1px solid #ef4444;
  padding: 0.4375rem 0.875rem;
}
.p-button.p-button-outlined.p-button-secondary {
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 0.4375rem 0.875rem;
}
</style>
