<template>
  <AppImage
    class="object-contain"
    :src="`https://cdn.imagin.studio/getImage?&make=${car.model.brand.slug}&modelFamily=${car.model?.slug}&angle=23&fileType=webp&zoomType=fullscreen&zoomLevel=0&width=1200&dome=opq&steering=lhd&transmission=a&modelVariant=ha&bodySize=3&interiorId=unreleased-interior-id&trim=no-trim-at-all&rimId=bogus-rim-code&aspectRatio=1:1&groundPlaneAdjustment=-0.07&customer=b2l`"
  />
</template>
<script setup lang="ts">
import type { Car } from '@/types/Car'

defineProps<{ car: Car }>()
</script>
