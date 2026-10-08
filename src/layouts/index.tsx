import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { Footer, Navigation } from '@/widgets'

export const Layout = defineComponent({
  name: 'Layout',

  setup() {
    return () =>
      <div class="layout">
        <Navigation />

        <main class="layout__content">
          <RouterView />
        </main>

        <Footer />
      </div>
  }
})

export default Layout
