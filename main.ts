import { createApp } from 'vue'
import App from '@/app'
import router from '@/router'

import '@/assets/styles/main.scss'

const app = createApp(App)

app.use(router)
app.mount('#app')
