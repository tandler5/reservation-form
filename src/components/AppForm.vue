<template>
  <div class="form">
    <FormKit
      type="form"
      v-model="fields"
      :config="{ validationVisibility: 'submit' }"
      validation-visibility="submit"
      v-slot="{ node }"
      :actions="false"
    >
      <FormKit type="meta" name="currentBookingEdit" :value="0" />
      <FormKit type="meta" name="contact" :value="undefined" />
      <FormKit type="meta" name="bookings" :value="[]" />
      <FormKit type="meta" name="coupons" :value="[]" />
      <FormKit
        name="multiStep"
        type="multi-step"
        :before-step-change="onBeforeStepChange"
        :hide-progress-labels="true"
        tab-style="progress"
        :allow-incomplete="
          (!!fields?.multiStep?.services?.category &&
            fields.multiStep?.services?.service &&
            node.at('$self.multiStep')?.context?.activeStep === 'services') ||
          (node.at('$self.multiStep')?.context?.activeStep === 'custom_fields_for_booking' &&
            !!fields?.multiStep?.custom_fields_for_booking?.carId &&
            mode === 'select') ||
          (node.at('$self.multiStep')?.context?.activeStep === 'datepicker' &&
            fields?.multiStep?.datepicker?.date?.day &&
            fields?.multiStep?.datepicker?.date?.time)
        "
        v-slot="context"
        :steps-class="{
          'flex shadow-form transition-all duration-[0.4s] ease-form m-0 items-stretch relative w-max': true,
          modal: phonePanelOpened,
          '':
            fields?.multiStep?.services?.service &&
            !['verify'].includes(node.at('$self.multiStep')?.context?.activeStep as string)
        }"
      >
        <FormSidePanel
          :active-step="context?.activeStep"
          :sorted-steps
          :steps
          :loading="dataLoading"
        />
        <div
          v-if="dataLoading"
          :class="{
            'flex shadow-form  transition-all duration-[0.4s] ease-form m-0 items-stretch relative w-full': true
          }"
        >
          <div
            class="heading rounded-t-lg absolute bg-white z-2 top-0 left-0 right-0 px-[17px] py-[30px] border-b border-[#0000000d] text-left h-[60px] flex items-center"
          >
            <Skeleton class="font-medium leading-[1.2] m-0 !w-[150px]" />
          </div>
          <div class="pt-[90px] px-[30px] h-full flex-1 overflow-hidden">
            <FormContentServices
              :categories="data?.categories ?? {}"
              :loading="dataLoading"
              :value="fields?.multiStep!"
            />
          </div>
        </div>
        <template v-else>
          <FormKit
            v-for="({ name, sub_title }, index) in sortedSteps"
            :key="index"
            type="step"
            :__isPlaceholder="true"
            class="p-2.5"
            step-inner-class="h-full"
            step-class="flex-1 min-w-[470px] max-w-[470px] bg-white rounded-none relative z-2 border-r-[#0000000d] border-r border border-b-0 border-l-0 border-t-0"
            :step-actions-class="{
              'footer flex w-full p-2.5 border-t border-[rgba(0,0,0,.05)] border-solid absolute bottom-0 left-0 right-0 bg-whites':
                !dataLoading &&
                (fields?.multiStep?.services?.category || fields?.multiStep?.services?.service),
              'justify-end': true,
              'justify-between':
                (index || fields?.multiStep?.services?.category) &&
                context?.activeStep !== 'confirmation'
            }"
            :name
          >
            <template v-if="name === context?.activeStep" #default="{ node: stepNode, value }">
              <Heading
                :title="sub_title"
                :visible-right-panel="
                  visibleRightPanel && node.at('$self.multiStep')?.context?.activeStep !== 'verify'
                "
              />
              <div
                class="pt-[90px] px-[30px] h-full flex-1 overflow-hidden"
                :class="{
                  'pb-20': [
                    'custom_fields_for_booking',
                    'contact',
                    'verify',
                    'confirmation'
                  ].includes(context?.activeStep)
                }"
              >
                <FormAlerts :node />
                <FormContentServices
                  v-if="context?.activeStep === 'services'"
                  v-model:selected-category="selectedCategory"
                  :categories="data?.categories ?? {}"
                  :value="fields?.multiStep!"
                />
                <FormExtras
                  v-else-if="context?.activeStep === 'service_extras'"
                  :extras="
                    data?.categories[context?.value?.services?.category]?.services?.[
                      context?.value?.services?.service?.id
                    ]?.extras ?? []
                  "
                />
                <FormCar
                  v-else-if="context?.activeStep === 'custom_fields_for_booking'"
                  v-model:mode="mode"
                  :carId="value?.carId"
                  :cars="userCars ?? {}"
                  :brands
                  @login="onLogin"
                />
                <FormCalendar
                  v-else-if="context?.activeStep === 'datepicker'"
                  :slots-data
                  @fetch-next-page="fetchNextPage()"
                />
                <FormUserLogin
                  v-else-if="context?.activeStep === 'contact'"
                  in-step
                  @google-login="(token) => onLogin('google', token)"
                  @facebook-login="(token) => onLogin('facebook', token)"
                />
                <FormVerify
                  v-else-if="context?.activeStep === 'verify'"
                  :brands
                  @add-new-service="addNewServiceToBooking(stepNode)"
                />
                <FormConfirmation
                  v-else-if="context?.activeStep === 'confirmation'"
                  :brands
                  :categories="data?.categories ?? {}"
                  :values="context?.value?.confirmation"
                />
              </div>
            </template>

            <template #stepPrevious="{ handlers, node }">
              <FormKit
                v-if="
                  (index || fields?.multiStep?.services?.category) &&
                  context?.activeStep !== 'confirmation'
                "
                type="button"
                outer-class="px-3.5 py-2 text-xs text-black tracking-[.2px] rounded-lg font-medium"
                :label="$t('Zpět')"
                @click="goBack(node, handlers)"
              >
                <template #prefixIcon>
                  <font-awesome-icon icon="arrow-left-long" class="mr-[5px]" />
                </template>
              </FormKit>
            </template>
            <template v-if="!dataLoading" #stepNext="{ handlers, stepName, node }">
              <FormKit
                v-if="stepName !== 'Services' || fields?.multiStep?.services?.service"
                type="button"
                :disabled="
                  loading ||
                  makingReservation ||
                  (stepName === 'Custom_fields_for_booking' && slotsLoading)
                "
                :label="
                  stepName === 'Verify'
                    ? $t('Vytvořit závaznou rezervaci')
                    : stepName === 'Confirmation'
                      ? $t('Vytvořit další rezervaci')
                      : $t('Další krok')
                "
                suffixIcon="check"
                :input-class="{
                  '!cursor-not-allowed':
                    loading || (stepName === 'Custom_fields_for_booking' && slotsLoading)
                }"
                :outer-class="{
                  'bg-primary/80 cursor-not-allowed':
                    loading || (stepName === 'Custom_fields_for_booking' && slotsLoading),
                  'bg-primary px-3.5 py-2 text-xs text-white tracking-[.2px] rounded-lg font-medium': true
                }"
                data-next="true"
                @click="onClickNextStep(node, handlers)"
              >
                <template #suffixIcon>
                  <i
                    v-if="loading || (stepName === 'Custom_fields_for_booking' && slotsLoading)"
                    class="pi pi-spin pi-spinner ml-[5px]"
                    style="font-size: 0.8rem"
                  ></i>
                  <font-awesome-icon v-else icon="arrow-right-long" class="ml-[5px]" />
                </template>
              </FormKit>
            </template>
          </FormKit>
        </template>
        <FormSummary
          v-if="
            visibleRightPanel &&
            node.at('$self.multiStep')?.context?.activeStep !== 'verify' &&
            context?.activeStep !== 'confirmation'
          "
          :mode
          :brands
          :values="fields!"
          :loading="dataLoading"
          :active-step="node.at('$self.multiStep')?.context?.activeStep"
          @edit-step="editStep(node, $event)"
        />
      </FormKit>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import Heading from '@/components/form/heading/HeadingPanel.vue'
import FormSidePanel from '@/components/form/left/FormLeftPanel.vue'
import FormContentServices from '@/components/form/content/FormContentServices.vue'
import FormExtras from '@/components/form/content/extras/FormExtras.vue'
import FormSummary from '@/components/form/summary/FormSummary.vue'
import FormCalendar from '@/components/form/content/date/FormContentCalendar.vue'
import FormCar from '@/components/form/content/car/FormCar.vue'
import FormAlerts from '@/components/form/FormAlerts.vue'
import FormUserLogin from '@/components/form/content/user/FormUserLogin.vue'
import FormVerify from '@/components/form/verify/FormVerify.vue'
import FormConfirmation from '@/components/form/confirmation/FormConfirmation.vue'

import { useGraphQL } from '@/api/useApi'

import { GET_USER_CARS, type GET_USER_CARS_TS } from '@/api/queries/cars'
import { ref, shallowRef, provide, inject, computed, type Ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Step } from '@/types/Steps'
import type { SerializedBrand } from '@/types/Brand'
import { GET_SLOTS } from '@/api/queries/slots'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/vue-query'
import { LOGIN } from '@/api/mutations/auth'
import type { Car } from '@/types/Car'
import type { LoginProviders } from '@/types/Auth'
import { type BeforeStepChange } from '@formkit/addons'
import type { FormKitNode } from '@formkit/core'
import type { Form } from '@/types/Form'
import type { StepHandlers } from '@formkit/addons'
import type { SERIALIZED_INITIAL_DATA_TS } from '@/api/queries/initialQuery'
import type { SLOT } from '@/types/Slot'
import { MAKE_RESERVATION } from '@/api/mutations/reservation'
import { serializeBookingData } from '@/composables/bookings'
import type { BookingInput } from '@/types/Booking'
import type { MakeReservation } from '@/types/Reservation'
import { useI18n } from 'vue-i18n'
import type { Customer } from '@/types/Customer'

const user = ref()
const loading = ref(false)
const mode = ref<'select' | 'create'>('create')
const authToken = shallowRef<string>()
const selectedCategory = shallowRef<string>()

provide('authToken', authToken)
provide('user', user)
provide('loading', loading)

const props = defineProps<{
  steps: { [key: string]: Step }
  brands: { [key: string]: SerializedBrand }
  dataLoading: boolean
}>()
const fields = ref<Form>()
const phonePanelOpened = shallowRef(false)
provide('data', fields)
provide('phonePanelOpened', phonePanelOpened)
const data = inject<Ref<SERIALIZED_INITIAL_DATA_TS>>('config')
const { t } = useI18n()

const goBack = (node: FormKitNode, handlers: StepHandlers) => {
  const decrementStep = (steps = -1) => handlers.incrementStep(steps)()
  switch (node.name) {
    case 'custom_fields_for_booking': {
      if (mode.value !== 'create') {
        mode.value = 'create'
        return
      }
      decrementStep(fields.value!.multiStep.services.service.extras.length ? -1 : -2)
      break
    }
    case 'services': {
      if (fields.value!.multiStep.services.category) {
        fields.value!.multiStep.services.category = null
      }
      decrementStep()
      break
    }
    case 'verify':
      {
        const rootNode = node.at('$root') as FormKitNode<Form>
        if (rootNode.value?.bookings?.length > 1) {
          decrementStep(-2)
          return
        }
        decrementStep()
      }
      break
    default: {
      decrementStep()
      break
    }
  }
}

const visibleRightPanel = computed(
  () => !!fields.value?.bookings.some((b) => b.service !== undefined)
)

const onClickNextStep = (node: FormKitNode, handlers: StepHandlers) => {
  const incrementStep = (steps = 1) => handlers.incrementStep(steps)()
  switch (node.name) {
    case 'services': {
      const formNode = node as FormKitNode<Form['multiStep']['services']>
      if (!formNode.value.category && selectedCategory.value) {
        node.at('$self.category')?.input(selectedCategory.value)
      }
      incrementStep(formNode.value.service.extras.length ? 1 : 2)
      break
    }

    case 'service_extras': {
      const formNode = node.at('$parent') as FormKitNode<Form['multiStep']>
      if (
        Object.keys(userCars.value ?? {}).length > 0 &&
        formNode.value.custom_fields_for_booking?.carId
      ) {
        mode.value = 'select'
      }
      incrementStep()
      break
    }

    case 'datepicker': {
      // Skip an user step if there are multiple bookings
      const rootNode = node.at('$root') as FormKitNode<Form>
      if (rootNode.value?.bookings?.length > 1) {
        incrementStep(2)
      } else {
        incrementStep()
      }
      break
    }
    case 'verify': {
      makeReservation({
        bookings: fields.value?.bookings!,
        customer: fields.value?.multiStep?.contact?.customer,
        onSuccess: () => {
          incrementStep()
        },
        onError: async (e: Error) => {
          if (
            'response' in e &&
            e.response &&
            typeof e.response === 'object' &&
            'errors' in e.response &&
            Array.isArray(e.response.errors) &&
            e.response?.errors?.some((e) => e.extensions.timeNotAvailable)
          ) {
            const formNode = node.at('$root') as FormKitNode<Form['multiStep']>

            const dayNode = formNode.at('$self.multiStep.datepicker') as FormKitNode<
              Form['multiStep']['datepicker']
            >
            await refetchSlots()
            const currentSelectedDate = new Date(dayNode.value.date?.day!).toLocaleDateString(
              'fr-ca'
            )
            const isAvailableSomeSlotSelectedDate = slotsData.value?.pages.find(
              (p) => !!Object.keys(p.availableSlots[currentSelectedDate] ?? {}).length
            )
            formNode.setErrors([
              isAvailableSomeSlotSelectedDate
                ? `${t('Vybraný časový slot již není k dispozici')}.`
                : `${t('Vybraný datum a časový slot již není k dispozici')}.`
            ])
            dayNode.reset(
              isAvailableSomeSlotSelectedDate
                ? {
                    date: {
                      day: dayNode.value.date?.day
                    }
                  }
                : {}
            )
            editStep(formNode, {
              bookingIndex: 0,
              type: 'date'
            })
          }
        }
      })
      break
    }

    case 'confirmation': {
      incrementStep(sortedSteps.value.length * -1 + 1)
      const rootNode = node.at('$root') as FormKitNode<Form>
      selectedCategory.value = undefined
      mode.value = 'create'
      rootNode?.reset({
        currentBookingEdit: 0,
        contact: rootNode?.value.contact,
        multiStep: { contact: rootNode?.value.multiStep?.contact, services: {}, datepicker: {} }
      })
      break
    }

    default: {
      incrementStep()
      break
    }
  }
}

const onBeforeStepChange: BeforeStepChange = ({ targetStep }) => {
  const rootNode = targetStep.node.at('$root') as FormKitNode<Form>
  rootNode.clearErrors()
}

const sortedSteps = computed(() => {
  const steps = Object.values(props.steps).filter((step) => step.name !== 'payment')
  steps.sort((a, b) => {
    return parseInt(a.order_number) - parseInt(b.order_number)
  })
  return steps
})

const todayMonth = new Date().getMonth()
const todayYear = new Date().getFullYear()

const month = ref(new Date().getMonth())
const year = ref(new Date().getFullYear())
provide('month', month)
provide('year', year)

const serviceId = computed(() => fields.value?.multiStep?.services?.service?.id)
const enabled = computed(() => serviceId.value !== undefined)

const {
  isPending,
  data: slotsData,
  refetch: refetchSlots,
  fetchNextPage,
  isRefetching
} = useInfiniteQuery({
  enabled,
  queryKey: ['slots', serviceId],
  queryFn: async ({ pageParam }) => {
    const res = await useGraphQL<{ availableSlots: SLOT }>(GET_SLOTS, {
      serviceId: serviceId.value,
      year: todayYear,
      month: todayMonth + 1,
      page: pageParam
    })
    return res
  },
  initialPageParam: 1,
  getNextPageParam: (_, __, currentPage) => currentPage + 1,
  getPreviousPageParam: (_, __, currentPage) => currentPage - 1
})
provide('slotsData', slotsData)

const { mutate: login } = useMutation({
  mutationFn: async ({ provider, token }: { provider: string; token: string }) => {
    const res = await useGraphQL<LOGIN>(LOGIN, {
      token,
      provider
    })
    return res
  },
  onSuccess(data) {
    authToken.value = data.login.token
    user.value = data.login.user
    const { first_name: firstName, last_name: lastName, phone, email, id } = user.value ?? {}
    fields.value!.contact = {
      customer: {
        firstName,
        lastName,
        phone,
        email,
        id
      }
    }
    fields.value!.multiStep.contact = {
      customer: {
        firstName,
        lastName,
        phone,
        email,
        id
      }
    }
    fetchUserCars()
  }
})

const { mutate: makeReservation, isPending: makingReservation } = useMutation({
  mutationFn: async ({
    bookings,
    customer,
    onSuccess,
    onError
  }: {
    bookings: BookingInput[]
    customer: Customer
    onSuccess?: () => void
    onError?: (e: Error) => void
  }) => {
    const serialized = serializeBookingData(bookings)
    const { id, ...customerData } = customer
    const res = await useGraphQL<{ makeReservation: MakeReservation }>(
      MAKE_RESERVATION,
      {
        reservationData: serialized,
        ...(id
          ? {}
          : {
              customer: customerData
            })
      },
      authToken.value
    )
    return { data: res, onSuccess, onError }
  },
  onSuccess({ data, onSuccess }) {
    fields.value!.multiStep.confirmation = data.makeReservation
    if (onSuccess) {
      onSuccess()
    }
  },
  onError: (e, { onError }) => {
    if (onError) {
      onError(e)
    }
  }
})

const { data: userCars, refetch: fetchUserCars } = useQuery({
  queryKey: ['cars'],
  enabled: false,
  queryFn: async () => {
    const cars: { [key: string]: Car } = {}
    const res = await useGraphQL<GET_USER_CARS_TS>(GET_USER_CARS, {}, authToken?.value)
    res.myVehicles.forEach((c) => {
      cars[c.id!] = c
    })
    return cars
  }
})
provide('userCars', userCars)

const slotsLoading = computed(() => isPending.value || isRefetching.value)

const onLogin = (provider: LoginProviders, token: string) => {
  login({ provider, token })
}

const addNewServiceToBooking = async (node: FormKitNode) => {
  const stepsNode = node.at('$parent') as FormKitNode<Form['multiStep']>
  const bookingIndexNode = node.at('$root.currentBookingEdit') as FormKitNode<
    Form['currentBookingEdit']
  >
  await bookingIndexNode.input(bookingIndexNode.value + 1)
  stepsNode.reset()
  const today = new Date()
  month.value = today.getMonth()
  year.value = today.getFullYear()
  stepsNode.goTo(sortedSteps.value[0].name)
}

const editStep = async (
  node: FormKitNode,
  { bookingIndex, type }: { bookingIndex?: number; type: string }
) => {
  if (bookingIndex) {
    await loadStep(node, bookingIndex)
  }

  const stepsNode = node.at('$self.multiStep') as FormKitNode<Form['multiStep']>
  switch (type) {
    case 'car':
      return stepsNode.goTo('custom_fields_for_booking')
    case 'date':
      return stepsNode.goTo('datepicker')
    case 'service':
      return stepsNode.goTo('services')
    case 'extras':
      return stepsNode.goTo('service_extras')
    case 'customer':
      return stepsNode.goTo('contact')
  }
}

const loadStep = async (node: FormKitNode, bookingIndex: number) => {
  const bookingsNode = node.at('$root.bookings') as FormKitNode<Form['bookings']>
  const { car, carId, extras, day, time, category, service } = bookingsNode.value[bookingIndex]
  const bookingIndexNode = node.at('$root.currentBookingEdit') as FormKitNode<
    Form['currentBookingEdit']
  >
  const carNode = node.at('$root.multiStep.custom_fields_for_booking.car') as FormKitNode<
    Form['multiStep']['custom_fields_for_booking']['car']
  >
  const servicesNode = node.at('$root.multiStep.services') as FormKitNode<
    Form['multiStep']['services']
  >
  const carIdNode = node.at('$root.multiStep.custom_fields_for_booking.carId') as FormKitNode<
    Form['multiStep']['custom_fields_for_booking']['carId']
  >
  const extrasStep = node.at('$root.multiStep.service_extras') as FormKitNode<
    Form['multiStep']['service_extras']
  >
  const datepickerStep = node.at('$root.multiStep.datepicker') as FormKitNode<
    Form['multiStep']['datepicker']
  >
  await carNode?.input(car ?? {})
  await carIdNode?.input(carId)
  await servicesNode.input({
    service: data?.value.categories[category]?.services[service],
    category
  })
  selectedCategory.value = category
  await extrasStep.input({ extras: extras ?? {} })
  const newDate = day ? new Date(day) : undefined
  await datepickerStep.input({ date: { day: newDate, time } })
  if (newDate) {
    month.value = newDate.getMonth()
    year.value = newDate.getFullYear()
  }
  await bookingIndexNode.input(bookingIndex)
}
</script>
<style>
@media (max-width: 1050px) {
  .modal {
    @apply before:content-[''] before:fixed before:top-0 before:left-0 before:right-0 before:bottom-0 before:z-10 before:bg-[#0000004d];
  }
}
</style>
<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
