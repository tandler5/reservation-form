<template>
  <img v-bind="attrs" v-show="imageLoaded" :src @load="imageLoaded = true" />
  <Skeleton v-if="!imageLoaded" v-bind="attrs" class="w-full h-full" />
</template>
<script setup lang="ts">
import { shallowRef, useAttrs, watch } from 'vue'

const props = defineProps<{ src: string }>()

const attrs = useAttrs()
const imageLoaded = shallowRef(false)

watch(
  () => props.src,
  () => {
    imageLoaded.value = false
  }
)
</script>
