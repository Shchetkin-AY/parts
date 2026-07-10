import { createApp } from 'vue'
import App from '@/app'

import { pinia } from '@/plugins'

import router from '@/router'

import '@/assets/styles/main.scss'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
