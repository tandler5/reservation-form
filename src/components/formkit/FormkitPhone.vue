<template>
  <FloatLabel>
    <MazPhoneNumberInput
      :id="context.id"
      class="w-full rounded-lg p-inputwrapper-filled"
      ref="input"
      :no-use-browser-locale="true"
      country-code="CZ"
      :model-value="context.value"
      :disabled="context.disabled ?? false"
      :translations="{
        countrySelector: {
          placeholder: '',
          searchPlaceholder: $t('Vyhledejte zemi'),
          error: $t('Error')
        },
        phoneInput: { example: `${$t('Příklad')}:`, placeholder: $t('Telefoní číslo') }
      }"
      :preferred-countries="['CZ', 'SK']"
      @update:model-value="update"
      @blur="context.handlers.blur"
      @update="validate"
    />
    <label :for="context.id">{{ context.label }}</label>
  </FloatLabel>
</template>

<script lang="ts">
export const FormkitPhoneOptions = {
  type: 'phone',
  props: {}
}

declare module '@formkit/inputs' {
  import { FormKitInputs, FormKitBaseSlots } from '@formkit/inputs'
  interface FormKitInputProps<Props extends FormKitInputs<Props>> {
    phone: {
      type: 'phone'
      value?: string
    }
  }
  interface FormKitInputSlots<Props extends FormKitInputs<Props>> {
    phone: FormKitBaseSlots<Props>
  }
}
</script>

<script setup lang="ts">
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'
import type { Result } from 'maz-ui/components/MazPhoneNumberInput'
import { createMessage } from '@formkit/core'
import type { FormKitFrameworkContext } from '@formkit/core'
import { useI18n } from 'vue-i18n'
import { ref, type Ref } from 'vue'

const { t } = useI18n()

const props = defineProps<{
  context: FormKitFrameworkContext<string>
}>()

const input: Ref = ref()

const validate = (input: Result) => {
  if (props.context.node.value) {
    if (!input.isValid) {
      props.context.node.store.set(
        createMessage({
          key: 'invalid-phone-number',
          blocking: true, // If true this blocks form submission, otherwise it wont
          type: 'validation',
          value: t('Toto není validní telefonní číslo.')
        })
      )
    } else {
      props.context.node.store.remove('invalid-phone-number')
    }
  } else {
    props.context.node.store.remove('invalid-phone-number')
  }
}

const update = (value: string | undefined) => {
  const inputValue = input.value?.$refs?.PhoneInputRef.$refs.PhoneInputRef.$refs.input.value
  if (!value && inputValue) {
    props.context.node.input(inputValue)
  } else {
    props.context.node.input(value)
  }
}
</script>

<style>
.m-input-wrapper {
  border: 1px solid #cad2e0 !important;
}
.m-country-selector__select .m-input-wrapper {
  border-top-left-radius: 8px !important;
  border-top-right-radius: 0px !important;
  border-bottom-left-radius: 8px !important;
  border-right: 0 !important;
}
.m-phone-input .m-input-wrapper {
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}
.m-input {
  height: 2.6rem !important;
}
.m-input-label:not(.maz-text-danger-600):not(.maz-text-success-600) {
  color: #cecece;
}
.m-phone-number-input {
  border-radius: 6px;
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}
.m-phone-number-input__country-flag {
  top: 50%;
  bottom: auto !important;
  transform: translate(0, -50%);
}
.m-phone-number-input:not(.--no-flags)
  .m-phone-number-input__select[data-v-aa2cec29]
  .m-select-input
  input {
  padding-left: 2.7rem !important;
}
.m-input-input,
.m-select-input__toggle-button {
  font-size: 1rem;
  @apply !text-input;
}
.m-phone-number-input:has(.--is-focused) .m-input-wrapper {
  border-color: var(--primary-color) !important;
}
.m-country-selector {
  @apply flex items-center !border-r-0;
}
.m-phone-number-input:has(.--is-focused) {
  box-shadow: 0;
}
</style>
