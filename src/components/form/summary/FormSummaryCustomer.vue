<template>
  <div class="mb-[10px] block">
    <div class="flex items-center mb-[5px] mt-[15px]">
      <div class="text-content uppercase font-medium tracking-[1px] relative text-[11px]">
        {{ $t('Zákazník') }}
      </div>
      <div class="h-[1px] bg-[#f1f1f1] flex-1 ml-[10px]"></div>
    </div>
    <div class="flex gap-[10px]">
      <div
        class="size-[30px] flex-grow-0 flex-shrink-0 basis-[30px] flex items-center justify-around rounded-[20px] bg-[#dedede] text-[#1f222b] font-medium text-[11px] bg-contain bg-center"
      >
        <div>
          <span>{{ customer?.firstName[0] }}{{ customer?.lastName[0] }}</span>
        </div>
      </div>
      <div class="leading-[1.1]">
        <div class="font-medium text-[#1f222b] leading-[1.1] text-sm">
          {{ customer?.firstName }} {{ customer?.lastName }}
        </div>
        <div class="text-xs inline-block text-content leading-[1.1]">{{ customer?.email }}</div>
      </div>
    </div>
    <div></div>
    <div></div>
  </div>
</template>
<script setup lang="ts">
import type { Customer } from '@/types/Customer'
import type { User } from '@/types/User'
import { inject, type Ref } from 'vue'

defineProps<{ customer: Customer }>()

const user = inject<Ref<User>>('user')
</script>
