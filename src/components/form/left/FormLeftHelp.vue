<template>
  <div class="flex flex-col gap-1">
    <span class="text-base font-medium text-[#13171a]">{{ $t('Nevíte si rady?') }}</span>
    <span class="text-base font-medium text-[#13171a]">{{ $t('Potřebujete poradit?') }}</span>
    <div class="flex flex-col text-content text-sm leading-[1.3]">
      <span>
        {{ $t('Zavolejte na') }}
        <a class="underline text-primary" href="tel:+420704180497">704 180 497</a>
      </span>
      <span>{{ $t('Rádi Vám pomůžeme s rezervací') }}</span>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
