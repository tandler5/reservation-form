<template>
  <div class="w-full">
    <FormKit type="group" name="coupon" v-slot="{ value, node }">
      <div class="flex w-full">
        <FormKit
          :right-button="isPending ? $t('Aplikuji...') : $t('Aplikovat')"
          name="code"
          type="input"
          :disabledRightButton="!value?.code || isPending || duplicateCoupon"
          :label="$t('Máte kupón?')"
          class="h-8"
          outer-class="w-full"
          @node="setCouponNode"
        />
      </div>
      <div v-if="data?.coupons" class="mt-2 flex flex-col gap-2">
        <AppFormCouponsCoupon
          v-for="(coupon, key) in data.coupons"
          :key
          :coupon
          @remove="removeCoupon(node, key)"
        />
      </div>
    </FormKit>
  </div>
</template>
<script setup lang="ts">
import { inject, onBeforeUnmount, shallowRef, type Ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import type { FormKitNode } from '@formkit/core'
import { useGraphQL } from '@/api/useApi'
import { APPLY_COUPON } from '@/api/mutations/coupons'
import type { Coupon } from '@/types/Coupon'
import { useFormKit } from '@/composables/formkit'
import { createMessage } from '@formkit/core'
import AppFormCouponsCoupon from '@/components/form/coupons/AppFormCouponsCoupon.vue'
import { useI18n } from 'vue-i18n'
import {
  COUPON_ADDED,
  COUPON_EXPIRATE,
  COUPON_REMOVED,
  COUPON_SERVICE_NOT_VALID,
  COUPON_USER_AUTHORISATION,
  COUPON_USER_NOT_VALID,
  COUPON_VALIDATIONS
} from '@/composables/coupon-validations'
import type { Form } from '@/types/Form'

defineProps<{ duplicateCoupon: boolean }>()

const couponNode = shallowRef<FormKitNode>()
const couponNodeButtonClickListener = shallowRef<string>()
const couponNodeInputListener = shallowRef<string>()

const { add, remove } = useFormKit()
const { t } = useI18n()

const data = inject<Ref<Form>>('data')

const removeCoupon = (node: FormKitNode, index: number) => {
  remove(node.at('$root.coupons') as FormKitNode<Coupon[]>, index)
  if (couponNode.value) {
    setCouponMessage(COUPON_REMOVED, t('Kupón byl odebrán.'), 'success')
  }
}

const authToken = inject<Ref<string>>('authToken')

const setCouponNode = (node: FormKitNode) => {
  couponNode.value = node
  couponNodeButtonClickListener.value = couponNode.value.on('buttonClick', ({ origin }) => {
    // TODO: multi bookings
    const rootNode = origin.at('$root') as FormKitNode<Form>
    applyCoupon({
      code: origin.value as string,
      services: [rootNode?.value.multiStep?.services?.service.id]
    })
  })
  couponNodeInputListener.value = couponNode.value.on('updateValue', () => {
    clearCouponErrors
  })
}

const setCouponMessage = (key: string, value: string, type: string = 'danger') => {
  if (couponNode.value) {
    clearCouponErrors(key)
    couponNode.value.store.set(
      createMessage({
        key,
        blocking: false,
        visible: true,
        type,
        value
      })
    )
  }
}

const clearCouponErrors = (key?: string) => {
  ;(key ? COUPON_VALIDATIONS.filter((v) => v !== key) : COUPON_VALIDATIONS).forEach((v) => {
    if (couponNode.value) {
      couponNode.value.store.remove(v)
    }
  })
}

const { mutate: applyCoupon, isPending } = useMutation({
  mutationFn: async ({ code, services }: { code: string; services: string[] }) => {
    const res = await useGraphQL<{ applyCoupon: Coupon }>(
      APPLY_COUPON,
      {
        code,
        services
      },
      authToken ? authToken.value : undefined
    )
    return res.applyCoupon
  },
  onError(e) {
    if (couponNode.value) {
      if (e.response.errors.some((e) => e.extensions.expirated === true)) {
        setCouponMessage(COUPON_EXPIRATE, t('Kupónu vypršela platnost.'))
      } else if (e.response.errors.some((e) => e.extensions.notValidService === true)) {
        setCouponMessage(COUPON_SERVICE_NOT_VALID, t('Kupón nelze využít pro tuto službu.'))
      } else if (e.response.errors.some((e) => e.extensions.notValidUser === true)) {
        setCouponMessage(COUPON_USER_NOT_VALID, t('Kupón není určen pro Vás.'))
      } else if (e.response.errors.some((e) => e.extensions.missingAuthorization === true)) {
        setCouponMessage(COUPON_USER_AUTHORISATION, t('Kupón vyžaduje přihlášení.'))
      }
    }
  },
  onSuccess(data) {
    const couponsNode = couponNode.value?.at('$root.coupons') as FormKitNode<Coupon[]>
    if (couponsNode) {
      add(couponsNode, data)
      if (couponNode.value) {
        setCouponMessage(COUPON_ADDED, t('Kupón byl přidán.'), 'success')
      }
    }
  }
})

onBeforeUnmount(() => {
  if (couponNode.value) {
    if (couponNodeButtonClickListener.value) {
      couponNode.value.off(couponNodeButtonClickListener.value)
    }
    if (couponNodeInputListener.value) {
      couponNode.value.off(couponNodeInputListener.value)
    }
  }
})
</script>
