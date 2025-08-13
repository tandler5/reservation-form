<template>
  <div class="progress">
    <ul class="flex gap-2.5 justify-center">
      <li
        v-for="{ name, title } in loading ? Array(5).fill({}) : steps"
        :key="name"
        class="block grow-0 shrink basis-0 m-0 p-0"
      >
        <Skeleton v-if="loading" class="rounded-lg !size-[10px]" />
        <Popper v-else placement="top" hover>
          <template #content>
            <span class="bg-primary py-[3px] px-1.5 rounded-lg text-white text-xs font-medium">
              {{ title }}
            </span>
          </template>
          <div
            class="rounded-lg size-[10px]"
            :class="
              name === activeStep
                ? 'bg-light hover:bg-primary'
                : 'bg-[#00000012] hover:bg-[#00000026]'
            "
          ></div>
        </Popper>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import type { Step } from '@/types/Steps'
defineProps<{
  steps: Step[]
  activeStep: string
  loading: boolean
}>()
</script>
