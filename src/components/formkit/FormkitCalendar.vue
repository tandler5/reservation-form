<template>
  <AppCalendar
    :id="context?.id as string"
    :label="context?.label as string"
    :disabled="context?.disabled"
    :placeholder="context?.placeholder"
    :min-date="context?.minDate"
    :max-date="context?.maxDate"
    :show-time="context?.showTime"
    :model-value="context?.value"
    :required="context.state.required"
    :time-only="context?.timeOnly"
    :invalid-class="context?.state.dirty && !context?.state.valid"
    :month-only="context?.monthOnly"
    :year-only="context?.yearOnly"
    @update:model-value="input"
    @blur="context?.handlers.blur"
  >
    <template v-for="(slot, slotName) in context?.slots" :key="slotName" #[slotName]="data">
      <component :is="slot" v-bind="data" />
    </template>
  </AppCalendar>
</template>

<script lang="ts">
import type { FormKitInputs, FormKitBaseSlots } from '@formkit/inputs'

type FormKitCalendarProps = {
  disabled?: boolean
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  showTime?: boolean
  timeOnly?: boolean
  monthOnly?: boolean
  yearOnly?: boolean
}

declare module '@formkit/inputs' {
  interface FormKitInputProps<Props extends FormKitInputs<Props>> {
    calendar: {
      type: 'calendar'
      value?: string
    } & FormKitCalendarProps
  }
  interface FormKitInputSlots<Props extends FormKitInputs<Props>> {
    calendar: FormKitBaseSlots<Props> & {
      [K in keyof CalendarSlots]: FormKitFrameworkContext & CalendarSlots[K]
    }
  }
}
</script>

<script setup lang="ts">
import AppCalendar from '@/components/app/AppCalendar.vue'
import type {
  FormKitFrameworkContext,
  FormKitNode,
  FormKitFrameworkContextState
} from '@formkit/core'
import type { CalendarSlots } from 'primevue/calendar'

const props = withDefaults(
  defineProps<{
    context: Omit<FormKitFrameworkContext, 'slots'> &
      FormKitCalendarProps & {
        value: Date | null
        state: FormKitFrameworkContextState
        slots: Record<keyof CalendarSlots, CallableFunction>
        node: FormKitNode
        handlers: FormKitFrameworkContext['handlers']
      }
  }>(),
  {}
)
const input = async (date: Date | null) => {
  await props.context.node.input(date)
}
</script>
