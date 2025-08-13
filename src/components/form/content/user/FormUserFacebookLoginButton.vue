<template>
  <HFaceBookLogin
    class="h-[40px] w-32 border flex justify-center items-center rounded-[4px] px-3 cursor-pointer group hover:border-primary"
    v-slot="fbLogin"
    @onSuccess="onSuccess"
    @onFailure="onFailure"
    scope="email,public_profile"
    fields="id,name,email,first_name,last_name,birthday"
  >
    <div class="flex gap-2">
      <AppImage
        class="size-[18px]"
        src="https://btautoservis.cz/wp-content/plugins/latepoint/public/images/facebook-logo-compact.png"
        alt="facebook-logo"
      />
      <span @click="fbLogin.initFBLogin" class="text-[#3c4043] group-hover:text-primary text-sm">{{
        $t('Facebook')
      }}</span>
    </div>
  </HFaceBookLogin>
</template>
<script setup lang="ts">
import { HFaceBookLogin } from '@healerlab/vue3-facebook-login'

const emit = defineEmits(['login'])

const onSuccess = ({ authResponse }: { authResponse: { accessToken: string } }) => {
  emit('login', authResponse.accessToken)
}

const onFailure = (e: any) => {
  throw new Error(e)
}
</script>
