<template>
  <InputGroup class="w-full h-[42px] border border-[#cad2e0] rounded-lg">
    <i v-if="context.icon" :class="['fal', context.icon]" class="z-2" />

    <InputGroupAddon v-if="context.leftAddon">
      <span class="white-space-nowrap" :style="`width: ${context.addonWidth}`">
        {{ context.leftAddon }}
      </span>
    </InputGroupAddon>

    <FloatLabel>
      <InputNumber
        :id="context.id"
        class="w-full"
        :class="{ 'p-invalid': context.state.dirty && !context.state.valid }"
        input-class="px-3 py-2 text-input text-sm font-medium rounded-r-none"
        :min="context.min"
        :max="context.max"
        :disabled="context.disabled"
        :mode="context.currency ? 'currency' : undefined"
        :currency="context.currency"
        locale="cs-cz"
        :min-fraction-digits="context.minFractionDigits"
        :max-fraction-digits="context.maxFractionDigits"
        :show-buttons="context.showButtons"
        :button-layout="context.buttonLayout"
        :step="context.step"
        :decrement-button-class="context.decrementButtonClass"
        :increment-button-class="context.incrementButtonClass"
        :placeholder="context.placeholder"
        :model-value="context.value"
        @blur="context.handlers.blur"
        @input="update($event.value)"
      >
        <template v-for="(slot, slotName) in context.slots" :key="slotName">
          <component :is="slot" />
        </template>
      </InputNumber>
      <label :for="context.id"
        >{{ context.label }}
        <span class="text-red-400" v-if="context.state.required">*</span></label
      >
    </FloatLabel>

    <InputGroupAddon v-if="context.rightAddon" class="border-l">
      <span class="white-space-nowrap" :style="`width: ${context.addonWidth ?? 'auto'}`">
        {{ context.rightAddon }}
      </span>
    </InputGroupAddon>
  </InputGroup>
</template>

<script lang="ts">
type FormKitInputNumberProps = {
  icon?: string
  leftAddon?: string
  rightAddon?: string
  addonWidth?: string
  min?: number
  max?: number
  disabled?: boolean
  currency?: string
  minFractionDigits?: number
  maxFractionDigits?: number
  showButtons?: boolean
  buttonLayout?: 'stacked' | 'horizontal' | 'vertical'
  step?: number
  decrementButtonClass?: string
  incrementButtonClass?: string
  placeholder?: string
}

declare module '@formkit/inputs' {
  import { FormKitInputs, FormKitBaseSlots } from '@formkit/inputs'
  interface FormKitInputProps<Props extends FormKitInputs<Props>> {
    numbers: {
      type: 'numbers'
      value: number
    } & FormKitInputNumberProps
  }
  interface FormKitInputSlots<Props extends FormKitInputs<Props>> {
    numbers: FormKitBaseSlots<Props> & {
      [K in keyof InputNumberSlots]: FormKitFrameworkContext & InputNumberSlots[K]
    }
  }
}
</script>

<script setup lang="ts">
import type { InputNumberSlots } from 'primevue/inputnumber/InputNumber'
import type { FormKitFrameworkContext } from '@formkit/core'
const props = defineProps<{
  context: FormKitFrameworkContext<number> & FormKitInputNumberProps
}>()

const update = async (value: string | number | undefined) => {
  if (value !== props.context._value) {
    await props.context.node.input(value)
    props.context.node.emit('updateValue', value)
  }
}
</script>
