import { createApp } from 'vue'
import router from '@/router'

import { pinia } from '@/plugins'

import { useViewportStore } from './stores'

import '@/assets/styles/main.scss'

import App from '@/app'

const app = createApp(App)

app.use(router)
app.use(pinia)

const viewportStore = useViewportStore()

window.addEventListener('resize', () => {
  return viewportStore.update()
})

app.mount('#app')
