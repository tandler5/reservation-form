<template>
  <FloatLabel class="w-full md:w-14rem">
    <Dropdown
      :id="context?.id"
      class="w-full border border-[#cad2e0]"
      v-bind="context.attrs"
      :class="{ 'p-invalid': context.state.dirty && !context.state.valid }"
      :disabled="context?.disabled"
      :filter="context.filter"
      :show-clear="context.showClear"
      :options="context.options"
      :placeholder="context.placeholder"
      :data-key="context.optionValue"
      :option-group-label="context.optionGroupLabel"
      :option-group-children="context.optionGroupChildren"
      :option-value="context.optionValue ?? (context.optionValue === null ? undefined : 'id')"
      :option-disabled="context.optionDisabled"
      :option-label="context.optionLabel"
      :model-value="context?.value"
      @update:model-value="update"
      @blur="context.handlers.blur"
    >
      <template v-for="(slot, slotName) in context?.slots" :key="slotName" #[slotName]="data">
        <component :is="slot" v-bind="data" />
      </template>
    </Dropdown>
    <label :for="context?.id"
      >{{ context.label }} <span class="text-red-400" v-if="context.state.required">*</span></label
    >
  </FloatLabel>
</template>

<script lang="ts">
type FormKitDropdownProps<T> = {
  optionValue?: string | T
  placeholder?: string
  optionDisabled?: string
  filter?: boolean
  showClear?: boolean
  disabled?: boolean
  optionLabel?: string | ((data: T) => string)
  optionGroupLabel?: string
  optionGroupChildren?: string
}

declare module '@formkit/inputs' {
  import { FormKitInputs, PropType, FormKitBaseSlots } from '@formkit/inputs'
  interface FormKitInputProps<Props extends FormKitInputs<Props>> {
    dropdown: FormKitDropdownProps<PropType<Props, 'options'>> & {
      type: 'dropdown'
      options: PropType<Props, 'options'>
      value?: Props['options']
    }
  }
  interface FormKitInputSlots<Props extends FormKitInputs<Props>> {
    dropdown: FormKitBaseSlots<Props> & {
      [K in keyof DropdownSlots]: FormKitFrameworkContext & DropdownSlots[K]
    }
  }
}
</script>

<script setup lang="ts" generic="T">
import type {
  FormKitFrameworkContext,
  FormKitNode,
  FormKitFrameworkContextState
} from '@formkit/core'
import type { DropdownSlots } from 'primevue/dropdown'

const props = defineProps<{
  context: Omit<FormKitFrameworkContext, 'slots'> &
    FormKitDropdownProps<T> & {
      options?: T[]
      value?: T
      state: FormKitFrameworkContextState
      slots: Record<keyof DropdownSlots, CallableFunction>
      node: FormKitNode
      handlers: FormKitFrameworkContext['handlers']
    }
}>()

const update = async (value: string) => {
  await props.context.node.input(value)
  props.context.node.emit('updateValue', value)
}
</script>
