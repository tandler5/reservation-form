<template>
  <GoogleLogin
    popup-type="TOKEN"
    class="h-[40px] w-32 border !flex justify-center items-center rounded-[4px] px-3 cursor-pointer group hover:border-primary"
    :callback="callback"
  >
    <div class="flex gap-2">
      <AppImage
        class="size-[18px]"
        src="https://btautoservis.cz/wp-content/plugins/latepoint/public/images/google-logo-compact.png"
        alt="google-logo"
      />
      <span class="group-hover:text-primary text-[#3c4043] text-sm">{{ $t('Google') }}</span>
    </div></GoogleLogin
  >
</template>
<script setup lang="ts">
import { GoogleLogin, type CallbackTypes } from 'vue3-google-login'

const emit = defineEmits(['login'])

const callback: CallbackTypes.TokenResponseCallback = (response) => {
  emit('login', response.access_token)
}
</script>
