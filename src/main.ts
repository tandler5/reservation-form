import './assets/main.css'
import { plugin } from '@formkit/vue'
import FormKitConfig from './../formkit.config.ts'
import Popper from 'vue3-popper'
import { createI18n } from 'vue-i18n'
import { createApp, provide, h } from 'vue'
import App from './App.vue'
import { ApolloClient } from '@/ApolloClient'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { DefaultApolloClient } from '@vue/apollo-composable'
import Button from 'primevue/button'
import Dropdown from 'primevue/Dropdown'
import InputGroupAddon from 'primevue/InputGroupAddon'
import Skeleton from 'primevue/skeleton'
import InputGroup from 'primevue/InputGroup'
import InputText from 'primevue/InputText'
import InputNumber from 'primevue/InputNumber'
import FloatLabel from 'primevue/FloatLabel'
import InputIcon from 'primevue/InputIcon'
import Calendar from 'primevue/Calendar'
import AvatarGroup from 'primevue/AvatarGroup'
import Avatar from 'primevue/Avatar'
import AppImage from '@/components/app/AppImage.vue'
import ConfirmationService from 'primevue/confirmationservice'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'

library.add(fas, far)

const app = createApp({
  setup() {
    provide(DefaultApolloClient, ApolloClient)
  },
  render: () => h(App)
})

const i18n = createI18n({
  legacy: false
})

const vueQuerySettings = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  }
}

app.use(plugin, FormKitConfig)
app.use(VueQueryPlugin, vueQuerySettings)
app.use(i18n)
app.use(ConfirmationService)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('AppImage', AppImage)
app.component('Skeleton', Skeleton)
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('Button', Button)
app.component('InputGroup', InputGroup)
app.component('InputText', InputText)
app.component('Calendar', Calendar)
app.component('InputGroupAddon', InputGroupAddon)
app.component('AvatarGroup', AvatarGroup)
app.component('Avatar', Avatar)
app.use(PrimeVue, {
  unstyled: false
})
app.component('FloatLabel', FloatLabel)
app.component('InputNumber', InputNumber)
app.component('Dropdown', Dropdown)
app.component('Popper', Popper)
app.component('InputIcon', InputIcon)
app.mount('#app')
