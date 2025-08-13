<template>
  <div class="flex flex-col gap-5">
    <h4 class="my-3 font-medium text-input">{{ $t('Vytvořit vozidlo') }}</h4>
    <div class="grid grid-cols-2 gap-3 gap-y-8">
      <FormKit
        type="dropdown"
        show-clear
        name="brand"
        preserve
        v-bind="getAttrs('brand')"
        :label="$t('Značka vozidla')"
        outer-class="rounded-lg"
        :options="Object.values(brands)"
        @node="setBrandNode"
      >
        <template #option="{ option }">
          <div class="flex gap-2">
            <AppImage v-if="option.logo" class="size-6 object-contain" />
            <div>{{ option.name }}</div>
          </div>
        </template>
        <template #value="{ value }">
          <div class="flex gap-2 h-6">
            <AppImage
              v-if="brands[value]?.logo"
              class="!size-6 object-contain"
              :src="brands[value]?.logo"
            />
            <div>{{ brands[value]?.name }}</div>
          </div>
        </template>
      </FormKit>
      <FormKit
        name="model"
        type="dropdown"
        preserve
        v-bind="getAttrs('model')"
        show-clear
        :disabled="!value.brand"
        :label="$t('Model vozidla')"
        outer-class="rounded-lg"
        :options="Object.values(brands[value.brand]?.models ?? {})"
        @node="setModelNode"
      >
        <template #option="{ option }">
          <div class="flex gap-2">
            <AppImage
              v-if="brands[value.brand]?.slug && option?.slug"
              class="size-8 object-contain"
              :src="`https://cdn.imagin.studio/getImage?&make=${brands[value.brand]?.slug}&modelFamily=${option?.slug}&angle=23&fileType=webp&zoomType=fullscreen&zoomLevel=0&width=1200&dome=opq&steering=lhd&transmission=a&modelVariant=ha&bodySize=3&interiorId=unreleased-interior-id&trim=no-trim-at-all&rimId=bogus-rim-code&aspectRatio=1:1&groundPlaneAdjustment=-0.07&customer=b2l`"
            />
            <div>{{ option.name }}</div>
          </div>
        </template>
        <template #value="{ value: modelValue }">
          <div class="flex gap-2 h-6">
            <AppImage
              v-if="brands[value.brand]?.slug && brands[value.brand]?.models?.[modelValue]?.slug"
              class="size-6 object-contain"
              :src="`https://cdn.imagin.studio/getImage?&make=${brands[value.brand]?.slug}&modelFamily=${brands[value.brand].models?.[modelValue]?.slug}&angle=23&fileType=webp&zoomType=fullscreen&zoomLevel=0&width=1200&dome=opq&steering=lhd&transmission=a&modelVariant=ha&bodySize=3&interiorId=unreleased-interior-id&trim=no-trim-at-all&rimId=bogus-rim-code&aspectRatio=1:1&groundPlaneAdjustment=-0.07&customer=b2l`"
            />
            <div>{{ brands[value.brand]?.models?.[modelValue]?.name }}</div>
          </div>
        </template>
      </FormKit>
      <FormKit
        name="year"
        preserve
        :label="$t('Rok výroby')"
        v-bind="getAttrs('year')"
        :min-date="new Date('01-01-1886')"
        :max-date="new Date()"
        type="calendar"
        yearOnly
        outer-class="rounded-lg"
        @node="setYearNode"
      />
      <FormKit
        name="vin"
        preserve
        v-bind="getAttrs('vin')"
        type="input"
        :label="$t('VIN')"
        outer-class="rounded-lg"
        @node="setVinNode"
      />
      <FormKit
        name="performance"
        preserve
        type="numbers"
        v-bind="getAttrs('performance')"
        :rightAddon="$t('kW')"
        :label="$t('Výkon')"
        outer-class="rounded-lg"
        @node="setPerformanceNode"
      />
      <FormKit
        name="ccm"
        preserve
        type="numbers"
        v-bind="getAttrs('ccm')"
        :rightAddon="$t('ccm')"
        :label="$t('Obsah motoru')"
        outer-class="rounded-lg"
        @node="setCcmNode"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Brand, SerializedBrand } from '@/types/Brand'
import type { CustomField } from '@/types/CustomField'
import type { FormKitNode } from '@formkit/core'
import { inject, onBeforeUnmount, type Ref } from 'vue'
import { shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { createMessage } from '@formkit/core'
import { vinDecoder } from 'car-vin-decoder'
import vinDecodera from 'vin-decode'
import type { GET_INITIAL_DATA_TS } from '@/api/queries/initialQuery'
import type { Form } from '@/types/Form'

const props = defineProps<{
  brands: { [key: string]: SerializedBrand }
  value: {
    brand: string
  }
}>()

const data = inject<Ref<GET_INITIAL_DATA_TS>>('config')

const { t } = useI18n()

const fields = inject<Ref<Form>>('data')
const emit = defineEmits(['inputUpdate'])

const vinNode = shallowRef<FormKitNode>()
const vinNodeListener = shallowRef<string>()

const brandNode = shallowRef<FormKitNode>()
const brandNodeListener = shallowRef<string>()

const modelNode = shallowRef<FormKitNode>()
const modelNodeListener = shallowRef<string>()

const yearNode = shallowRef<FormKitNode>()
const yearNodeListener = shallowRef<string>()

const performanceNode = shallowRef<FormKitNode>()
const performanceNodeListener = shallowRef<string>()

const ccmNode = shallowRef<FormKitNode>()
const ccmNodeListener = shallowRef<string>()

const setBrandNode = (node: FormKitNode) => {
  brandNode.value = node
  brandNodeListener.value = brandNode.value.on('updateValue', () => {
    emit('inputUpdate')
  })
}

const setModelNode = (node: FormKitNode) => {
  modelNode.value = node
  modelNodeListener.value = modelNode.value.on('updateValue', () => {
    emit('inputUpdate')
  })
}

const setYearNode = (node: FormKitNode) => {
  yearNode.value = node
  yearNodeListener.value = yearNode.value.on('updateValue', () => {
    emit('inputUpdate')
  })
}

const setVinNode = (node: FormKitNode) => {
  vinNode.value = node
  vinNodeListener.value = vinNode.value.on('updateValue', ({ payload, origin }) => {
    emit('inputUpdate')
    const isValid = vinDecoder(payload)
    if (isValid === false) {
      origin.store.set(
        createMessage({
          key: 'invalid-vin',
          blocking: true,
          visible: true,
          type: 'validation',
          value: t('VIN není validní.')
        })
      )
    } else {
      const carBrand = Object.values(props.brands).find(
        (b) => b.slug === isValid.manufacturer.toLowerCase()
      )
      if (carBrand) {
        const groupNode = origin.at('$parent') as FormKitNode<
          Form['multiStep']['custom_fields_for_booking']['car']
        >
        const year = isValid.year ? new Date() : undefined
        if (year && isValid.year) {
          year.setFullYear(isValid.year)
        }
        console.log(vinDecodera(payload).decode())
        groupNode?.input({ ...groupNode.value, year, brand: carBrand.id })
      }
      origin.store.remove('invalid-vin')
    }
  })
}

const setPerformanceNode = (node: FormKitNode) => {
  performanceNode.value = node
  performanceNodeListener.value = performanceNode.value.on('updateValue', () => {
    emit('inputUpdate')
  })
}

const setCcmNode = (node: FormKitNode) => {
  ccmNode.value = node
  ccmNodeListener.value = ccmNode.value.on('updateValue', () => {
    emit('inputUpdate')
  })
}

const getAttrs = (type: string) => {
  switch (type) {
    case 'brand': {
      const field = data!.value?.customFields['cf_AAA2mnys'] as CustomField
      return {
        validation: getCondition(field) ? [['required']] : []
      }
    }
    case 'model': {
      const field = data!.value?.customFields['cf_rDpeW2Es'] as CustomField
      return {
        validation: getCondition(field) ? [['required']] : []
      }
    }
    case 'year': {
      const field = data!.value?.customFields['cf_OSOt00pC'] as CustomField
      return {
        validation: getCondition(field) ? [['required']] : []
      }
    }
    case 'vin': {
      const field = data!.value?.customFields['cf_4d4TN7NZ'] as CustomField
      return {
        validation: getCondition(field) ? [['required']] : []
      }
    }
    case 'performance': {
      const field = data!.value?.customFields['cf_uCzra3LT'] as CustomField
      return {
        validation: getCondition(field) ? [['required']] : []
      }
    }
    case 'ccm': {
      const field = data!.value?.customFields['cf_9FshdXjr'] as CustomField
      return {
        validation: getCondition(field) ? [['required']] : []
      }
    }
  }
}

const getCondition = (field: CustomField) => {
  return (
    field?.conditional === 'on' &&
    field?.required === 'on' &&
    Object.values(field.conditions).every((c) => {
      if (c.property === 'service') {
        const condition = c.value
          .split(',')
          .includes(fields?.value!.multiStep?.services?.service?.id!)
        if (c.operator === 'equal') {
          return condition
        } else if (c.operator === 'not_equal') return !condition
      }
      return true
    })
  )
}

onBeforeUnmount(() => {
  if (vinNode.value && vinNodeListener.value) {
    vinNode.value.off(vinNodeListener.value)
  }
  if (brandNode.value && brandNodeListener.value) {
    brandNode.value.off(brandNodeListener.value)
  }
  if (modelNode.value && modelNodeListener.value) {
    modelNode.value.off(modelNodeListener.value)
  }
  if (yearNode.value && yearNodeListener.value) {
    yearNode.value.off(yearNodeListener.value)
  }
  if (performanceNode.value && performanceNodeListener.value) {
    performanceNode.value.off(performanceNodeListener.value)
  }
  if (ccmNode.value && ccmNodeListener.value) {
    ccmNode.value.off(ccmNodeListener.value)
  }
})
</script>
