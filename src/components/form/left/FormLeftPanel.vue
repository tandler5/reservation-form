<template>
  <div
    class="bg-white sm:flex hidden flex-col justify-between relative text-center rounded-l-lg flex-shrink-0 flex-grow-0 basis-[270px] w-[270px] border-r border-[rgba(0,0,0,.1)] pt-[15px] px-[30px] pb-[25px]"
  >
    <FormLeftProgress :steps="sortedSteps" :active-step :loading />
    <FormLeftDescription :step="steps?.[activeStep]" :loading />
    <FormLeftHelp />
  </div>
</template>
<script setup lang="ts">
import type { Step } from '@/types/Steps'
import FormLeftProgress from '@/components/form/left/FormLeftProgress.vue'
import FormLeftDescription from '@/components/form/left/FormLeftDescription.vue'
import FormLeftHelp from '@/components/form/left/FormLeftHelp.vue'

defineProps<{
  steps: {
    [key: string]: Step
  }
  sortedSteps: Step[]
  activeStep: string
  loading: boolean
}>()
</script>
