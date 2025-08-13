<template>
  <div class="flex flex-column h-full w-full gap-1">
    <div
      class="w-full h-full"
      :class="{
        'p-input-icon-left': context.icon,
        'p-input-icon-right': [context?.help || context.rightButton]
      }"
      :style="context?.help || context.rightButton ? 'position: relative;display:inline-block' : ''"
    >
      <i v-if="context.icon" :class="['fal', context.icon, 'z-2']" />

      <InputGroup>
        <InputGroupAddon v-if="context.leftAddon"> {{ context.leftAddon }} </InputGroupAddon>
        <FloatLabel>
          <InputText
            :id="context?.id"
            v-bind="context.attrs"
            class="w-full h-[42px] border border-[#cad2e0] text-input text-sm font-medium px-3 py-2"
            :class="[
              {
                'p-invalid': context?.state.dirty && !context?.state.valid,
                'pr-[90px]': context.rightButton
              },
              context?.attrs?.class
            ]"
            :type="context?.inputType"
            :disabled="context?.disabled"
            :placeholder="context.placeholder"
            :model-value="context?.value"
            @update:model-value="update"
            @blur="props.context.handlers.blur"
          />
          <label :for="context?.id"
            >{{ context.label }}
            <span class="text-red-400" v-if="context.state.required">*</span></label
          >
        </FloatLabel>

        <InputGroupAddon v-if="context.rightAddon" class="border-l">
          <span class="white-space-nowrap" :style="`width: ${context.addonWidth ?? 'auto'}`">
            {{ context.rightAddon }}
          </span>
        </InputGroupAddon>
      </InputGroup>

      <span v-if="context.rightButton" class="h-full flex py-1 pr-1 absolute top-0 right-0 z-[999]">
        <Button
          :label="context.rightButton"
          :disabled="context.disabledRightButton"
          class="py-0 h-full text-primary px-2 text-sm"
          @click="context.node.emit('buttonClick', $event)"
        />
      </span>
      <span v-if="context.rightIcon" class="h-full flex py-1 pr-1 absolute top-0 right-0 z-5">
        <i class="far" :class="context.rightIcon" v-bind="context.rightIconParams"></i>
      </span>
    </div>
    <div v-if="context.node.store.checkDuplicate">
      <template
        v-if="context.slots.duplicate || context.node.store.checkDuplicate.meta.customMessage"
      >
        <span
          class="font-bold"
          :class="[context.node.store.checkDuplicate.blocking ? 'text-danger' : 'text-warning']"
          v-bind="context.node.store.checkDuplicate.meta.attrs"
          >{{
            context.node.store.checkDuplicate.meta.customMessage ??
            `${$t('Byly nalezeny možné shody')}:`
          }}</span
        >
        <component
          :is="context.slots.duplicate"
          v-if="context.slots.duplicate"
          :data="context.node.store.checkDuplicate.meta.data"
        />
      </template>
      <span v-else class="text-danger font-bold">{{ $t('Chybí vyplněný slot') }} 'duplicate'</span>
    </div>
  </div>
</template>

<script lang="ts">
type FormKitInputTextProps = {
  rightButton?: string
  rightIcon?: string
  rightAddon?: string
  leftAddon?: string
  disabledRightButton?: boolean
  disabledRightIcon?: boolean
  disabled?: boolean
  icon?: string
  inputType?: string
  placeholder?: string
  rightIconParams?: object
}

declare module '@formkit/inputs' {
  import { FormKitInputs } from '@formkit/inputs'
  interface FormKitInputProps<Props extends FormKitInputs<Props>> {
    input: {
      type: 'input'
      value?: string
    } & FormKitInputTextProps
  }
}
</script>

<script setup lang="ts">
import type { FormKitFrameworkContext } from '@formkit/core'

const props = defineProps<{
  context: FormKitFrameworkContext<string> & FormKitInputTextProps
}>()

const update = async (value: string) => {
  await props.context.node.input(value)
  props.context.node.emit('updateValue', value)
}
</script>
