<template>
  <FormKitMessages
    :node
    class="bg-[#ffcfcf] text-[#750e0e] p-2.5 rounded-lg mb-4 text-center font-medium text-sm"
  />
</template>
<script setup lang="ts">
import { FormKitMessages } from '@formkit/vue'
import type { FormKitNode } from '@formkit/core'
defineProps<{ node: FormKitNode }>()
</script>
