<template>
  <div
    ref="container"
    class="p-calendar p-component p-inputwrapper flex flex-column w-full relative border border-[#cad2e0] rounded-md h-[42px]"
  >
    <div class="w-full flex">
      <FloatLabel class="w-full h-full">
        <input
          :id="id"
          :class="{ 'p-inputwrapper-filled': modelValue }"
          class="p-inputtext p-component relative w-full h-full px-3 py-2 text-input"
          :type="
            timeOnly
              ? 'time'
              : monthOnly
                ? 'month'
                : yearOnly
                  ? 'number'
                  : showTime
                    ? 'datetime-local'
                    : 'date'
          "
          :value="localeValue"
          :min="minDateString"
          :max="maxDateString"
          :disabled="disabled"
          @focus="onFocusFn"
          @blur="onBlur"
          @click.prevent=""
          @change="onChange"
          @input="onInput"
        />
        <label :for="id">{{ label }} <span class="text-red-400" v-if="required">*</span></label>
      </FloatLabel>
      <slot v-for="(_, name) in slots" :name="name"></slot>
    </div>
    <div ref="calendarDiv" class="w-full h-10 absolute top-10"></div>
    <Calendar
      ref="calendar"
      :append-to="calendarDiv"
      class="w-full hidden z-5"
      :pt="{
        input: {
          class: 'hidden'
        }
      }"
      :view="monthOnly ? 'month' : yearOnly ? 'year' : undefined"
      :min-date="minDate"
      :max-date="maxDate"
      :class="{ 'p-invalid': invalidClass }"
      :disabled="disabled"
      :show-time="showTime"
      :time-only="timeOnly"
      hour-format="24"
      :model-value="modelValue"
      @blur="onBlur"
      @date-select="selectDate"
    >
    </Calendar>
  </div>
</template>

<script setup lang="ts">
import { ConnectedOverlayScrollHandler } from 'primevue/utils'
import type { CalendarBlurEvent } from 'primevue/calendar'
import { ref, useSlots, computed } from 'vue'

const calendarDiv = ref()
const slots = useSlots()

const modelValue = defineModel<Date | null>('modelValue')

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    placeholder?: string
    minDate?: Date
    maxDate?: Date
    showTime?: boolean
    timeOnly?: boolean
    monthOnly?: boolean
    yearOnly?: boolean
    onBlur?: (e: CalendarBlurEvent | Event) => void
    onFocus?: (e: Event) => void
    invalidClass?: boolean
    label: string
    id: string
    required?: boolean
  }>(),
  {
    placeholder: undefined,
    minDate: undefined,
    maxDate: undefined,
    onBlur: undefined,
    onFocus: undefined,
    invalidClass: false,
    required: false
  }
)

const calendar = ref()
const container = ref()

const localeValue = computed(() => {
  if (modelValue.value) {
    return getStringValue(modelValue.value)
  }
  return null
})

const getStringValue = (dateObject: Date) => {
  const time = dateObject.toLocaleTimeString('cs').split(':').splice(0, 2).join(':')
  const timeParts = time.split(':')
  const paddedTime = timeParts[0].padStart(2, '0')
  const parsedTime = paddedTime + ':' + timeParts[1]

  const date = dateObject.toLocaleDateString('fr-ca')
  const dateParts = date.split('-')
  const paddedDate = dateParts[0].padStart(4, '0')
  const parsedDate = paddedDate + '-' + dateParts[1] + '-' + dateParts[2]

  const parsedMonth = `${paddedDate}-${dateParts[1]}`

  return props.timeOnly
    ? parsedTime
    : props.monthOnly
      ? parsedMonth
      : props.yearOnly
        ? paddedDate
        : props.showTime
          ? `${parsedDate}T${parsedTime}`
          : parsedDate
}

const minDateString = computed(() => {
  if (props.minDate) {
    return getStringValue(props.minDate)
  }
  return undefined
})

const maxDateString = computed(() => {
  if (props.maxDate) {
    return getStringValue(props.maxDate)
  }
  return undefined
})

const onFocusFn = (e: Event) => {
  calendar.value.scrollHandler = new ConnectedOverlayScrollHandler(container.value)
  calendar.value.onButtonClick()
  if (typeof props.onFocus === 'function') {
    props.onFocus(e)
  }
}

const onChange = (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  const inputValue = inputElement.value
  if (inputValue !== '' && !props.yearOnly) {
    const date = props.timeOnly || props.monthOnly ? new Date() : new Date(inputValue)
    if (props.timeOnly) {
      const splittedTime = inputValue.split(':')
      const hours = parseInt(splittedTime[0])
      const minutes = parseInt(splittedTime[1])
      date.setHours(hours, minutes)
    } else if (props.monthOnly) {
      const splittedDate = inputValue.split('-')
      const years = parseInt(splittedDate[0])
      const months = parseInt(splittedDate[1])
      date.setFullYear(years)
      date.setMonth(months - 1)
    }
    modelValue.value = date
  }
}

const onInput = (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  const inputValue = inputElement.value
  if (inputValue !== '' && props.yearOnly) {
    const date = new Date()
    date.setFullYear(parseInt(inputValue))
    modelValue.value = date
  } else if (props.yearOnly) {
    modelValue.value = null
  }
}

const selectDate = (date: Date) => {
  modelValue.value = date
}
</script>
<style>
.p-datepicker {
  z-index: 999999999 !important;
}
</style>
