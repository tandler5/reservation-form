<template>
  <ul class="flex flex-col gap-3 pb-[70px]">
    <FormKit type="group" preserve name="extras" v-slot="{ value }" @node="setExtraNode">
      <li
        v-for="(extra, index) in extras"
        :key="extra.id"
        :tabindex="index + (Number(extras[index - 1]?.maximum_quantity) > 1 ? 2 : 1)"
        :class="{ 'border-primary shadow-button': value?.[extra.id] }"
        class="rounded-lg focus:border-primary flex group bg-white border border-[#e5e7ee] items-center shadow-none outline-none p-2.5 cursor-pointer group hover:border-primary hover:shadow-button"
        @keydown.enter.prevent="selectExtras(extra)"
        @click="selectExtras(extra)"
      >
        <div
          class="h-[45px] w-auto aspect-square flex justify-center items-center mr-[15px]"
          v-if="extra.image?.url"
        >
          <AppImage
            class="object-contain !h-[45px]"
            :src="extra.image?.url?.replace('online', 'cz')"
          />
        </div>
        <div
          class="mr-auto py-[5px] group-hover:translate-x-[3px] transition-transform duration-200 ease-out flex flex-col"
        >
          <span class="leading-[1.3]">
            {{ extra.name }}
          </span>
          <span class="text-content text-[12px]"> {{ extra.short_description }}</span>
        </div>
        <div class="border-l pl-[15px] ml-[10px] text-center block border-solid border-[#0000000d]">
          <div class="text-primary">{{ extra.charge_amount }}&nbsp;{{ $t('Kč') }}</div>
        </div>
        <div
          v-if="Number(extra.maximum_quantity) > 1"
          class="text-content text-[11px] flex ml-[15px]"
        >
          <span
            @click.stop="subtractItem(extra)"
            class="bg-[#f3f4f9] size-[20px] text-[#000000cc] text-sm p-[3px] flex justify-center items-center rounded-lg hover:bg-primary hover:text-white cursor-pointer"
          >
            -
          </span>
          <input
            class="!rounded-[3px] mx-[4px] w-[25px] text-[#32373c] border text-center border-[#cad2e0] py-[2px] px-[1px] transition-all duration-[0.2s] ease-[ease]"
            :min="0"
            placeholder="0"
            :max="extra.maximum_quantity"
            :value="
              (value as Form['multiStep']['service_extras']['extras'])?.[extra?.id]?.quantity as
                | string
                | undefined
            "
            type="number"
            @input="onBaseInput($event, extra)"
            @click.stop=""
          />
          <span
            @click.stop="addItem(extra)"
            class="bg-[#f3f4f9] size-[20px] text-[#000000cc] text-sm p-[3px] flex justify-center items-center rounded-lg hover:bg-primary hover:text-white cursor-pointer"
            >+
          </span>
        </div>
      </li>
    </FormKit>
  </ul>
</template>
<script setup lang="ts">
import type { Form } from '@/types/Form'
import type { ServiceExtra } from '@/types/ServiceExtra'
import type { FormKitNode } from '@formkit/core'
import { shallowRef } from 'vue'
defineProps<{ extras: ServiceExtra[] }>()

const extrasNode = shallowRef<FormKitNode>()

const setExtraNode = (node: FormKitNode) => {
  extrasNode.value = node
}

const onBaseInput = async (e: Event, extra: ServiceExtra) => {
  console.log(e)
  const target = e.target as HTMLInputElement
  let newValue
  if (target.value) {
    const number = Number(target.value)
    newValue = number
    if (newValue < 0) {
      newValue = 1
    }
    if (newValue > Number(extra.maximum_quantity)) {
      newValue = Number(extra.maximum_quantity)
    }
  }
  const oldValue = JSON.parse(JSON.stringify(extrasNode.value?.value ?? {}))
  if (newValue) {
    oldValue[extra.id] = { ...extra, quantity: newValue }
  } else {
    delete oldValue[extra.id]
  }
  await extrasNode.value?.input(oldValue)
  updateBookingNode(oldValue)
}

const selectExtras = async (extra: ServiceExtra) => {
  const oldValue = JSON.parse(JSON.stringify(extrasNode.value?.value ?? {}))
  if (oldValue[extra.id]) {
    delete oldValue[extra.id]
  } else {
    oldValue[extra.id] = { ...extra, quantity: 1 }
  }
  await extrasNode.value?.input(oldValue)
  updateBookingNode(oldValue)
}

const subtractItem = async (extra: ServiceExtra) => {
  const oldValue = JSON.parse(JSON.stringify(extrasNode.value?.value ?? {}))
  if (oldValue[extra.id] && oldValue[extra.id]?.quantity > 1) {
    oldValue[extra.id].quantity--
  } else {
    delete oldValue[extra.id]
  }
  await extrasNode.value?.input(oldValue)
  updateBookingNode(oldValue)
}

const addItem = async (extra: ServiceExtra) => {
  const oldValue = JSON.parse(JSON.stringify(extrasNode.value?.value ?? {}))
  if (oldValue[extra.id] && oldValue[extra.id]?.maximum_quantity > oldValue[extra.id]?.quantity) {
    oldValue[extra.id].quantity++
    await extrasNode.value?.input(oldValue)
  } else if (!oldValue[extra.id]) {
    oldValue[extra.id] = { ...extra, quantity: 1 }
    await extrasNode.value?.input(oldValue)
  }
  updateBookingNode(oldValue)
}

const updateBookingNode = (newValue: { [key: string]: ServiceExtra }) => {
  const bookingIndex = extrasNode.value?.at('$root.currentBookingEdit') as FormKitNode<number>
  const bookignsNode = extrasNode.value?.at('$root.bookings') as FormKitNode<Form['bookings']>
  const currentValue = JSON.parse(JSON.stringify(bookignsNode.value))
  currentValue[bookingIndex?.value].extras = newValue
  bookignsNode?.input(currentValue)
}
</script>
