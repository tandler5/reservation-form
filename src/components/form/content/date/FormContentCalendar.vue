<template>
  <div class="flex flex-col gap-2.5 pb-[70px]">
    <FormKit preserve type="group" name="date" v-slot="{ node, value }" @node="setCalendarNode">
      <FormKit type="meta" validation="required" name="day" @node="setDayNode" />
      <FormKit type="meta" validation="required" name="time" @node="setTimeNode" />
      <div
        class="header capitalize text-lg font-medium text-[#1f222b] flex justify-center items-center relative"
      >
        <div class="w-24 flex justify-end">
          <div>{{ months[month!] }}</div>
          <div class="text-[#1f222b4d] ml-[5px]">{{ year }}</div>
        </div>
        <div
          class="absolute w-full flex justify-end"
          :class="{ 'justify-between': todayMonth !== month || todayYear !== year }"
        >
          <button
            v-if="todayMonth !== month || todayYear !== year"
            type="button"
            @click="previousMonth"
          >
            <i class="pi pi-arrow-left ml-[5px]" style="font-size: 0.8rem"></i>
          </button>
          <button type="button" @click="nextMonth">
            <i class="pi pi-arrow-right ml-[5px]" style="font-size: 0.8rem"></i>
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between mb-[5px]">
        <div
          v-for="(day, index) in weekDays"
          :key="index"
          class="uppercase font-medium text-xs w-[14.2%] flex justify-center items-center"
          :class="index >= 5 ? 'text-[#13171a]' : 'text-light'"
        >
          {{ day }}
        </div>
      </div>
      <div class="grid grid-cols-7 gap-[15px]">
        <template v-for="(week, weekNumber) in sortedWeekInMonths" :key="weekNumber">
          <button
            v-for="(
              { date, past, slotsAreAvailable, availableSlots, availableSlotsCount, prevMonth },
              weekIndex
            ) in week"
            :key="weekIndex"
            :disabled="past || !slotsAreAvailable"
            :class="{
              'opacity-60 hover:opacity-100':
                prevMonth && areDatesSame(date, value?.day as Date | undefined),
              'bg-[#eefdec]': !past && slotsAreAvailable,
              '!cursor-not-allowed': past || !slotsAreAvailable,
              '!bg-primary text-white ': areDatesSame(date, value?.day as Date | undefined)
            }"
            class="group font-medium w-[53.11px] h-[36.8px] px-2 py-[5px] text-center cursor-pointer relative text-base rounded-lg group flex justify-center items-center"
            @click.prevent="selectDay(date, availableSlots)"
          >
            <span
              v-if="areDatesSame(date, value?.day as Date | undefined)"
              class="absolute -top-1 -right-1 bg-light rounded-full size-4 border-2 border-white flex justify-center items-center"
            >
              <i class="pi pi-check text-[0.5rem] font-bold"></i>
            </span>
            <span
              v-if="!past && slotsAreAvailable"
              class="absolute group-hover:flex hidden pointer-events-none whitespace-pre top-0 leading-[1.3] text-[15px] rounded left-1/2 bg-[#111] py-1 px-1.5 text-white font-semibold animate-availabilityPopup fill-mode-both z-10 translate-3d-center"
            >
              {{ availableSlotsCount }}
              {{ $t('k dispozici', availableSlotsCount) }}
            </span>
            <span
              :class="{
                'text-[#adadae]': past || !slotsAreAvailable,
                'scale-[1.2] translate-y-[-2px]': areDatesSame(date, value?.day as Date | undefined)
              }"
              class="relative leading-[1.3] text-center transition-all group-hover:translate-y-[-2px] group-hover:scale-[1.2] group-hover:whitespace-nowrap"
            >
              {{ date.getDate() }}
            </span>
            <span
              v-if="!areDatesSame(date, value?.day as Date | undefined)"
              class="flex rounded-sm transition-all m-0 h-[4px] absolute overflow-hidden bottom-[3px] left-[8px] right-[8px] bg-[#e6e9ef] group-hover:h-[6px] group-hover:left-[3px] group-hover:right-[3px]"
            >
              <span
                v-if="!past && slotsAreAvailable"
                :style="`width: ${(availableSlotsCount / openingHours[date?.getDay()]?.slots) * 100}%;`"
                class="bg-[#8fe286] z-1 absolute min-w-[3px] top-0 bottom-0 w-full"
              ></span>
            </span>
          </button>
        </template>
      </div>

      <div v-if="value?.day">
        <div class="flex w-full justify-center mb-2.5">
          <span
            class="relative text-[#16171d] text-sm before:content-[ ] before:absolute before:right-[calc(100%+15px)] before:top-1/2 before:w-full before:h-[1px] before:border after:content-[ ] after:absolute after:left-[calc(100%+15px)] after:top-1/2 after:w-full after:h-[1px] after:border after:border-t-0 before:border-t-0"
          >
            {{ $t('Vyberte čas pro') }}
            <span class="unde border-b text-primary border-dotted border-primary">{{
              getDayName(value.day as Date)
            }}</span>
          </span>
        </div>
        <div class="relative">
          <div class="grid grid-cols-5 gap-2.5">
            <button
              v-for="(slot, slotMinute) in getDaySlots(
                (value.day as Date)?.getDay(),
                (node.parent?.parent as FormKitNode<Form['multiStep']>)!.value?.services?.service
                  ?.duration
              )"
              :key="slotMinute"
              :disabled="!selectedAvaibleSlots[slotMinute]"
              :class="{
                'hover:bg-[#c0fbb8]': selectedAvaibleSlots[slotMinute] && slot.time !== value?.time,
                'bg-[#d6ffd1] text-[#14161d] cursor-pointer': selectedAvaibleSlots[slotMinute],
                'bg-[#f7f7f7] text-[#b3b3b3] cursor-not-allowed': !selectedAvaibleSlots[slotMinute],
                'bg-primary text-white': slot.time === value?.time
              }"
              class="rounded-lg py-1.5 px-[3px] leading-[1.2] text-center font-medium text-sm relative"
              @click.prevent="selectTime(slot)"
            >
              {{ slot.time }}
              <span
                v-if="slot.time === value?.time"
                class="absolute -top-1 -right-1 bg-light rounded-full size-4 border-2 border-white flex justify-center items-center"
              >
                <i class="pi pi-check text-[0.5rem] font-bold"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </FormKit>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onBeforeMount, inject, type Ref, shallowRef } from 'vue'
import { useQueryClient, type InfiniteData } from '@tanstack/vue-query'
import type { FormKitNode } from '@formkit/core'
import type { SLOT } from '@/types/Slot'
import type { Form } from '@/types/Form'
import type { Day } from '@/types/Day'
import type { GET_INITIAL_DATA_TS, SERIALIZED_INITIAL_DATA_TS } from '@/api/queries/initialQuery'
import type { OpeningHour } from '@/types/OpeningHour'
import { timeStringToMinutes, minutesToTimeString } from '@/composables/time'

const queryClient = useQueryClient()

const props = defineProps<{
  slotsData?: InfiniteData<{
    availableSlots: SLOT
  }>
}>()

const openingHours = ref<{ [key: string]: OpeningHour & { slots: number } }>({})
const timeBlockInterval = shallowRef()
const calendarNode = shallowRef<FormKitNode>()

const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}

const month = inject<Ref<number>>('month')
const year = inject<Ref<number>>('year')
const data = inject<Ref<SERIALIZED_INITIAL_DATA_TS>>('config')

const todayMonth = new Date().getMonth()
const todayYear = new Date().getFullYear()

const emit = defineEmits(['fetch-next-page'])

const availableSlots = computed(() => {
  const days: { [key: string]: SLOT } = {}
  props.slotsData?.pages.forEach((p) => {
    Object.entries(p.availableSlots).forEach(([key, value]) => {
      days[key] = Object.fromEntries(
        Object.entries(value).filter(([minutes]) => !selectedTimes.value?.[key]?.[minutes])
      ) as unknown as SLOT
    })
  })
  return days
})

onBeforeMount(() => {
  const serializedOpeningHours: { [key: number]: OpeningHour & { slots: number } } = {}
  const { openingHours: openingHoursData, timeBlockInterval: timeBlockIntervalData } =
    queryClient.getQueryData<GET_INITIAL_DATA_TS>(['data'])!
  timeBlockInterval.value = timeBlockIntervalData
  openingHoursData.forEach((day) => {
    serializedOpeningHours[day.week_day === 7 ? 0 : day.week_day] = {
      ...day,
      slots: getDaySlotsCount(day.start_time, day.end_time, 0)
    }
  })
  openingHours.value = serializedOpeningHours
})

const getDayName = (date: Date) => {
  const { format } = new Intl.DateTimeFormat('cs-cz', { day: 'numeric', month: 'long' })
  return format(date)
}

const getDaySlotsCount = (startTime: number, endTime: number, serviceDuration: number) => {
  let slotsCount = 0
  let tempStartTime = startTime
  while (tempStartTime + timeBlockInterval.value + serviceDuration <= endTime) {
    tempStartTime += timeBlockInterval.value
    slotsCount++
  }
  return slotsCount
}

const getDaySlots = (dayNumber: number, serviceDuration: number) => {
  const slots: { [key: string]: { time: string } } = {}
  let startTime = openingHours.value[dayNumber]?.start_time - timeBlockInterval.value
  while (
    startTime + timeBlockInterval.value + serviceDuration <=
    openingHours.value[dayNumber]?.end_time
  ) {
    startTime += timeBlockInterval.value
    slots[startTime] = {
      time: minutesToTimeString(startTime)
    }
  }

  return slots
}

const setCalendarNode = (node: FormKitNode) => {
  calendarNode.value = node
}

const weekDays = computed(() => {
  const { format } = new Intl.DateTimeFormat('cs-cz', { weekday: 'short' })
  return [...Array(7).keys()].map((day) => format(new Date(Date.UTC(2021, 5, day))))
})

const months = computed(() => {
  const format = new Intl.DateTimeFormat('cs-cz', { month: 'long' }).format
  return [...Array(12).keys()].map((m) => format(new Date(Date.UTC(2021, m))))
})

const monthBeforeLoadsNextData = 3

const nextMonth = () => {
  if (month!.value === 11) {
    month!.value = 0
    year!.value++
  } else {
    month!.value++
  }
  if (
    props.slotsData?.pages &&
    year &&
    month?.value === todayMonth - monthBeforeLoadsNextData &&
    year.value === todayYear + props.slotsData?.pages?.length
  ) {
    emit('fetch-next-page')
  }
}

const previousMonth = () => {
  if (month!.value === 0) {
    month!.value = 11
    year!.value--
  } else {
    month!.value--
  }
}

const dayNode = shallowRef<FormKitNode<Date>>()
const timeNode = shallowRef<FormKitNode>()

const setDayNode = (node: FormKitNode) => {
  dayNode.value = node as FormKitNode<Date>
  if (dayNode.value.value) {
    const y = dayNode.value.value.getFullYear()
    const m = dayNode.value.value.getMonth()
    year!.value = y
    month!.value = m
    const weekNumber = getWeekNumber(dayNode.value.value)
    let selectedDay: Day | undefined
    if (sortedWeekInMonths.value[weekNumber]) {
      selectedDay = sortedWeekInMonths.value[weekNumber]?.find((date) =>
        areDatesSame(date.date, dayNode.value!.value)
      )
    } else {
      Object.values(sortedWeekInMonths.value).find((days) => {
        const find = days.find((d) => areDatesSame(d.date, dayNode.value!.value))
        if (find) {
          selectedDay = find
        }
        return find
      })
    }

    if (selectedDay) {
      selectedAvaibleSlots.value = selectedDay.availableSlots
    } else {
      throw new Error('Chyba při získáni datumu')
    }
  }
}

const selectedTimes = computed(() => {
  const times: {
    [date: string]: {
      [time: string]: boolean
    }
  } = {}
  const formNode = calendarNode.value!.at('$root') as FormKitNode<Form>
  formNode.value.bookings
    .filter((_, index) => index !== formNode.value.currentBookingEdit)
    .forEach((b) => {
      if (b.time) {
        const start = timeStringToMinutes(b.time)
        let tempStart =
          start - Number(data!.value.categories[b.category]?.services[b.service]?.duration)
        const end =
          start + Number(data!.value.categories[b.category]?.services[b.service]?.duration)
        while (tempStart < end) {
          if (!times[new Date(b.day!).toLocaleDateString('en-CA', dateOptions)]) {
            times[new Date(b.day!).toLocaleDateString('en-CA', dateOptions)] = {}
          }
          if (!times[new Date(b.day!).toLocaleDateString('en-CA', dateOptions)][tempStart]) {
            times[new Date(b.day!).toLocaleDateString('en-CA', dateOptions)][tempStart] = true
          }

          tempStart = tempStart + data!.value.timeBlockInterval
        }
      }
    })
  return times
})

const areDatesSame = (firstDate?: Date, secondDate?: Date) =>
  Object.is(
    firstDate ? new Date(firstDate).getTime() : undefined,
    secondDate ? new Date(secondDate).getTime() : undefined
  )

const setTimeNode = (node: FormKitNode) => {
  timeNode.value = node
}

const selectedAvaibleSlots = shallowRef<SLOT>({})

const selectDay = async (day: Date, slots: SLOT) => {
  await timeNode.value?.input(undefined)
  await dayNode.value?.input(day)

  const bookingIndex = dayNode.value?.at('$root.currentBookingEdit') as FormKitNode<number>
  const bookignsNode = dayNode.value?.at('$root.bookings') as FormKitNode<Form['bookings']>
  const currentValue = JSON.parse(JSON.stringify(bookignsNode.value))
  currentValue[bookingIndex?.value].time = undefined
  currentValue[bookingIndex?.value].day = day
  await bookignsNode?.input(currentValue)
  selectedAvaibleSlots.value = slots
}

const selectTime = async ({ time }: { time: string }) => {
  await timeNode.value?.input(time)
  const bookingIndex = dayNode.value?.at('$root.currentBookingEdit') as FormKitNode<number>
  const bookignsNode = dayNode.value?.at('$root.bookings') as FormKitNode<Form['bookings']>
  const currentValue = JSON.parse(JSON.stringify(bookignsNode.value))
  currentValue[bookingIndex?.value].time = time
  await bookignsNode?.input(currentValue)
  const multiStepNode = timeNode.value?.at('$root.multiStep') as FormKitNode<Form['multiStep']>
  if (bookignsNode.value.length > 1) {
    const currentStepIndex = multiStepNode.context!.stepCount as number
    multiStepNode.goTo(currentStepIndex + 2)
  } else {
    multiStepNode.next()
  }
}

const weekInMonths = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const firstDayOfMonth = new Date(year!.value, month!.value, 1)
  const lastDayOfMonth = new Date(year!.value, month!.value + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Získejte den v týdnu, kdy začíná měsíc (0 = neděle, 1 = pondělí, ...)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  const days: Day[] = []

  // Přidejte dny z předchozího měsíce
  if (daysFromPrevMonth > 0) {
    const lastDayOfPrevMonth = new Date(year!.value, month!.value, 0)
    const daysInPrevMonth = lastDayOfPrevMonth.getDate()
    for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
      const date = new Date(year!.value, month!.value - 1, i)
      const slots = availableSlots.value?.[date.toLocaleDateString('en-CA', dateOptions)] ?? {}
      days.push({
        date,
        past: date.getTime() < today.getTime(),
        availableSlots: slots,
        availableSlotsCount: Object.keys(slots).length,
        slotsAreAvailable: !!Object.keys(slots).length,
        prevMonth: date.getMonth() !== month!.value || date.getFullYear() !== year!.value,
        isCurrentMonth: false
      })
    }
  }

  // Přidejte dny z aktuálního měsíce
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year!.value, month!.value, i)
    const slots = availableSlots.value?.[date.toLocaleDateString('en-CA', dateOptions)] ?? {}
    days.push({
      date,
      past: date.getTime() < today.getTime(),
      availableSlots: slots,
      availableSlotsCount: Object.keys(slots).length,
      slotsAreAvailable: !!Object.keys(slots).length,
      prevMonth: date.getMonth() !== month!.value || date.getFullYear() !== year!.value,
      isCurrentMonth: true
    })
  }

  // Přidejte dny z následujícího měsíce
  const daysToAddFromNextMonth = days.length <= 35 ? 35 - days.length : 42 - days.length
  for (let i = 1; i <= daysToAddFromNextMonth; i++) {
    // Pokud je měsíc prosinec (11), zvyšme rok a nastavme měsíc na 0 (leden)
    const nextMonth = month!.value === 11 ? 0 : month!.value + 1
    const nextYear = month!.value === 11 ? year!.value + 1 : year!.value
    const date = new Date(nextYear, nextMonth, i)
    const slots = availableSlots.value?.[date.toLocaleDateString('en-CA', dateOptions)] ?? {}
    days.push({
      date,
      past: date.getTime() < today.getTime(),
      availableSlotsCount: Object.keys(slots).length,
      slotsAreAvailable: !!Object.keys(slots).length,
      availableSlots: slots,
      prevMonth: date.getMonth() !== month!.value || date.getFullYear() !== year!.value,
      isCurrentMonth: false
    })
  }

  // Vytvoření objektu pro uložení dnů podle týdne
  const weeksObject: { [key: string]: Day[] } = {}
  days.forEach((day) => {
    const weekNumber = getWeekNumber(day.date)

    if (!weeksObject[weekNumber]) {
      weeksObject[weekNumber] = []
    }

    weeksObject[weekNumber].push(day)
  })

  return weeksObject
})

const sortedWeekInMonths = computed(() => {
  const sortedData: { [key: string]: Day[] } = {}
  Object.entries(weekInMonths.value).forEach(([key, value]) => {
    if (month!.value === 11 && Number(key) < 5) {
      sortedData[Number(key) + Math.max(...Object.keys(weekInMonths.value).map((v) => Number(v)))] =
        value
    } else if (
      month!.value === 0 &&
      Number(key) < Math.max(...Object.keys(weekInMonths.value).map((v) => Number(v)))
    ) {
      sortedData[Number(key) + Math.max(...Object.keys(weekInMonths.value).map((v) => Number(v)))] =
        value
    } else {
      sortedData[key] = value
    }
  })
  return sortedData
})

// Funkce pro získání čísla týdne v roce
function getWeekNumber(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + startOfYear.getDay() + 1) / 7)
}
</script>
