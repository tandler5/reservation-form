<template>
  <div class="step-description py-[50px] flex flex-col items-center">
    <component
      class="!size-20 mb-5"
      :is="loading ? 'Skeleton' : 'AppImage'"
      :src="step?.image?.replace('online', 'cz')"
    />
    <component
      :is="loading ? 'Skeleton' : 'h3'"
      class="pt-0 mb-2.5 text-[22px] leading-[1.2] text-[#13171a]"
    >
      {{ step?.title }}
    </component>
    <component
      :is="loading ? 'Skeleton' : 'div'"
      class="text-content text-sm"
      v-html="step?.description"
    />
  </div>
</template>
<script setup lang="ts">
import AppImage from '@/components/app/AppImage.vue'
import type { Step } from '@/types/Steps'

defineProps<{ step: Step; loading: boolean }>()
</script>
