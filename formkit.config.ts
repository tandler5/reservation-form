import { cs } from '@formkit/i18n'
import { defaultConfig, createInput } from '@formkit/vue'
import { createMultiStepPlugin } from '@formkit/addons'
import {
  FormkitDropdownOptions,
  FormkitInputTextOptions,
  FormkitCalendarOptions,
  FormkitNumberOptions,
  FormkitPhoneOptions
} from '@/components/formkit/FormkitOptions'
import { defineAsyncComponent, markRaw } from 'vue'
import { clone, extend } from '@formkit/utils'

const FormMessage = defineAsyncComponent(() => import('@/components/form/messages/FormMessage.vue'))

const FormkitDropdown = defineAsyncComponent(
  () => import('@/components/formkit/FormkitDropdown.vue')
)
const FormkitInputText = defineAsyncComponent(
  () => import('@/components/formkit/FormkitInputText.vue')
)
const FormkitCalendar = defineAsyncComponent(
  () => import('@/components/formkit/FormkitCalendar.vue')
)
const FormkitInputNumber = defineAsyncComponent(
  () => import('@/components/formkit/FormkitInputNumber.vue')
)

const FormkitPhone = defineAsyncComponent(() => import('@/components/formkit/FormkitPhone.vue'))

const removeLabelFromInputs = (node) => {
  if (['button', 'submit', 'hidden', 'group', 'list', 'meta', 'step'].includes(node.props.type))
    return
  node.on('created', () => {
    const searchDefinition = clone(node.props.definition)
    const originalSchema = searchDefinition.schema
    searchDefinition.library = markRaw({
      ...searchDefinition.library,
      FormMessage
    })
    searchDefinition.schema = (extensions) => {
      return originalSchema(
        extend(extensions, {
          tabs: null,
          label: null,
          tab: null,
          step: null,
          steps: {
            children: ['$slots.default']
          },
          messages: {
            attrs: {
              class: '$classes.messages + " mt-2 flex flex-col gap-2"'
            }
          },
          message: {
            $el: undefined,
            $cmp: 'FormMessage',
            props: { type: '$message.type', messages: '$message' }
          }
        })
      )
    }

    node.props.definition = searchDefinition
  })
}

const inputs = {
  dropdown: createInput(FormkitDropdown, FormkitDropdownOptions),
  input: createInput(FormkitInputText, FormkitInputTextOptions),
  calendar: createInput(FormkitCalendar, FormkitCalendarOptions),
  numbers: createInput(FormkitInputNumber, FormkitNumberOptions),
  phone: createInput(FormkitPhone, FormkitPhoneOptions)
}

export default defaultConfig({
  locales: { cs },
  locale: 'cs',
  inputs,
  plugins: [createMultiStepPlugin(), removeLabelFromInputs]
})
