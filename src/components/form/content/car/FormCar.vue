<template>
  <div
    class="flex gap-10 transition-all duration-300"
    :class="{ 'translate-x-[-110%]': mode === 'select' }"
  >
    <div class="gap gap-3 flex flex-col w-full min-w-full">
      <div
        @click="selectCar"
        class="border w-full h-16 rounded-lg text-input items-center px-3 py-2 flex justify-between group cursor-pointer hover:border-primary"
      >
        <span class="group-hover:translate-x-[3px] transition-transform duration-200 ease-out">
          {{ $t('Vybrat vozidlo ze své garáže') }}
        </span>
        <div class="flex items-center gap-2">
          <AvatarGroup v-if="cars">
            <Avatar
              v-for="car in Object.values(cars)?.slice(0, 3)"
              :key="car.id"
              class="bg-slate-100"
              size="normal"
              shape="circle"
            >
              <AppCarImage :car />
            </Avatar>
            <Avatar
              v-if="Object.keys(cars ?? {}).length > 3"
              :label="`+${Object.keys(cars ?? {}).length - 3}`"
              shape="circle"
              size="normal"
              class="bg-slate-100"
            />
          </AvatarGroup>
          <InputIcon class="pi pi-arrow-right" />
        </div>
      </div>
      <FormKit
        v-if="mode !== 'select'"
        preserve
        type="group"
        name="car"
        v-slot="{ value, node }"
        @node="setCarNode"
      >
        <FormCarInputs :brands :value="value" @input-update="onCarInputsUpdate(node)" />
      </FormKit>
      <FormKit
        v-else
        preserve
        type="meta"
        validation="required"
        name="carId"
        @node="setCarIdNode"
      />
    </div>
    <div class="w-full min-w-full">
      <FormUserCars
        v-if="user"
        :cars="Object.values(cars ?? {})"
        :model-value="carId"
        @update:model-value="onSelectCarModel"
      />
      <FormUserLogin
        v-else
        @google-login="(token) => onLogin('google', token)"
        @facebook-login="(token) => onLogin('facebook', token)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import FormCarInputs from '@/components/form/content/car/FormCarInputs.vue'
import FormUserCars from '@/components/form/content/car/FormUserCars.vue'
import FormUserLogin from '@/components/form/content/user/FormUserLogin.vue'
import type { SerializedBrand } from '@/types/Brand'
import type { User } from '@/types/User'
import { type Ref, inject, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { googleOneTap } from 'vue3-google-login'
import type { LoginProviders } from '@/types/Auth'
import { type FormKitNode } from '@formkit/core'
import AppCarImage from '@/components/app/AppCarImage.vue'
import type { Car } from '@/types/Car'
import type { GET_INITIAL_DATA_TS } from '@/api/queries/initialQuery'
import type { Form } from '@/types/Form'

defineProps<{
  brands: { [key: string]: SerializedBrand }
  cars: { [key: string]: Car }
  carId?: string
}>()

const emit = defineEmits(['login'])

const mode = defineModel<'create' | 'select'>('mode')
const user = inject<Ref<null | User>>('user')
const carIdNode = shallowRef<FormKitNode>()
const carNode = shallowRef<FormKitNode>()
const carNodeListener = shallowRef<string>()

const settings = inject<Ref<GET_INITIAL_DATA_TS>>('config')

const onCarInputsUpdate = async (node: FormKitNode) => {
  const parentNode = node.at('$parent') as FormKitNode<
    Form['multiStep']['custom_fields_for_booking']
  >
  parentNode?.input({ ...parentNode.value, carId: null })

  const bookingIndex = node?.at('$root.currentBookingEdit') as FormKitNode<number>
  const bookignsNode = node?.at('$root.bookings') as FormKitNode<Form['bookings']>
  const currentValue = JSON.parse(JSON.stringify(bookignsNode.value))
  currentValue[bookingIndex?.value].car = JSON.parse(JSON.stringify(node.value))

  bookignsNode?.input(currentValue)
}

onMounted(() => {
  if (!user?.value) {
    googleOneTap({ clientId: settings?.value?.socialLogin?.google_client_id })
      .then(({ credential }) => {
        onLogin('google-one-tap', credential)
      })
      .catch((error) => {
        console.log('Handle the error', error)
      })
  }
})

const onSelectCarModel = async (modelId: string) => {
  const parentNode = carIdNode.value!.at('$parent') as FormKitNode<
    Form['multiStep']['custom_fields_for_booking']
  >
  await parentNode?.input({ ...parentNode.value, car: {} })
  await carIdNode.value?.input(modelId)

  console.log('aaa')

  const bookingIndex = carIdNode.value?.at('$root.currentBookingEdit') as FormKitNode<number>
  const bookignsNode = carIdNode.value?.at('$root.bookings') as FormKitNode<Form['bookings']>
  const currentValue = JSON.parse(JSON.stringify(bookignsNode.value))
  currentValue[bookingIndex?.value].carId = modelId

  bookignsNode?.input(currentValue)

  carIdNode.value?.at('$root.multiStep')?.next()
}

const setCarIdNode = (node: FormKitNode) => {
  carIdNode.value = node
}

const setCarNode = (node: FormKitNode) => {
  carNode.value = node
  const bookignsNode = carNode.value?.at('$root.bookings') as FormKitNode<Form['bookings']>
  const bookingIndex = carNode.value?.at('$root.currentBookingEdit') as FormKitNode<number>

  const { brand, model, ccm, performance, vin, year } =
    bookignsNode.value[bookingIndex.value].car ?? {}
  carNode.value.input({
    brand,
    ccm,
    model,
    performance,
    vin,
    year
  })
}

onBeforeUnmount(() => {
  carNode.value?.off(carNodeListener.value!)
})

const onLogin = (provider: LoginProviders, token: string) => {
  emit('login', provider, token)
}

const selectCar = () => {
  mode.value = 'select'
}
</script>
