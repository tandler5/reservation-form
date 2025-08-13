<template>
  <FormKit preserve type="group" name="customer" v-slot="{ value }" @node="setCustomerNode">
    <FormKit type="meta" name="id" />
    <div class="flex flex-col gap-y-5">
      <div class="flex flex-col gap-y-10">
        <header class="w-full border-b transition-all">
          <div class="mb-1 flex justify-between h-5 rel">
            <span
              class="relative transition-all flex items-end font-medium cursor-pointer select-none"
              :class="{
                'text-input text-sm': type === 'login',
                'font-medium after:content-[\'\'] after:absolute after:w-28 after:h-[1px] after:bottom-[-5px] after:border after:border-primary':
                  type === 'create'
              }"
              @click="type = 'create'"
              >{{ value?.id ? $t('Kontaktní informace') : $t('Nový zákazník') }}</span
            >
            <div class="flex gap-2">
              <span
                :class="{
                  'cursor-pointer': !value?.id,
                  'text-input': type === 'create' && !value?.id,
                  'text-[#898c98]': type === 'create' && value?.id,
                  'text-sm': type === 'create',
                  'after:content-[\'\'] after:absolute after:w-28 after:h-[1px] after:bottom-[-5px] after:border after:border-primary':
                    type === 'login'
                }"
                class="relative transition-all flex items-end font-medium select-none"
                @click="
                  () => {
                    if (!value?.id) {
                      type = 'login'
                    }
                  }
                "
                >{{ value?.id ? $t('Nejste to vy?') : $t('Máte již účet?') }}
              </span>
              <span
                v-if="value?.id"
                class="text-primary underline text-sm relative transition-all flex items-end font-medium cursor-pointer select-none"
                @click="logOut()"
              >
                {{ $t('Odhlásit se') }}
              </span>
            </div>
          </div>
        </header>
        <div class="grid grid-cols-2 gap-3 gap-y-8">
          <FormKit
            type="input"
            :label="$t('Jméno')"
            :validation="inStep ? 'required' : undefined"
            name="firstName"
            autocomplete="given-name"
          />
          <FormKit
            type="input"
            :label="$t('Přijmení')"
            :validation="inStep ? 'required' : undefined"
            name="lastName"
            autocomplete="family-name"
          />
          <FormKit
            type="phone"
            :label="$t('Telefon')"
            :validation="inStep ? 'required' : undefined"
            name="phone"
            outer-class="col-span-2"
          />
          <FormKit
            type="input"
            :label="$t('Email')"
            :validation="inStep ? 'required' : undefined"
            name="email"
            outer-class="col-span-2"
            :disabled="!!value?.id"
          />
        </div>
      </div>
      <div v-if="!value?.id" class="flex flex-col items-center gap-2 justify-center">
        <span
          class="relative uppercase text-primary text-sm before:content-[ ] before:absolute before:right-[120%] before:top-1/2 before:w-4 before:h-[1px] before:border after:content-[ ] after:absolute after:left-[120%] after:top-1/2 after:w-4 after:h-[1px] after:border"
          >{{ $t('nebo') }}</span
        >
        <div class="flex gap-2">
          <FormUserFacebookLoginButton
            v-if="data?.socialLogin?.facebook_app_id"
            :app-id="data?.socialLogin?.facebook_app_id"
            @login="(token) => $emit('facebook-login', token)"
          />
          <FormUserGoogleLoginButton
            v-if="data?.socialLogin?.google_client_id"
            :client-id="data?.socialLogin?.google_client_id"
            @login="(token) => $emit('google-login', token)"
          />
        </div>
      </div>
    </div>
  </FormKit>
</template>
<script setup lang="ts">
import { shallowRef, type ShallowRef, inject, type Ref } from 'vue'
import FormUserGoogleLoginButton from '@/components/form/content/user/FormUserGoogleLoginButton.vue'
import FormUserFacebookLoginButton from '@/components/form/content/user/FormUserFacebookLoginButton.vue'
import type { User } from '@/types/User'
import type { FormKitNode } from '@formkit/core'
import type { GET_INITIAL_DATA_TS } from '@/api/queries/initialQuery'

defineProps<{ inStep?: boolean }>()

const type: ShallowRef<'create' | 'login'> = shallowRef('create')
const user = inject<ShallowRef<User | null>>('user')
const customerNode = shallowRef<FormKitNode>()

const setCustomerNode = (node: FormKitNode) => {
  customerNode.value = node
}
const data = inject<Ref<GET_INITIAL_DATA_TS>>('config')

const logOut = () => {
  if (!user) {
    throw new Error('No User injected')
  }
  user.value = null
  customerNode?.value?.at('$self.id')?.input(undefined)
}
</script>
