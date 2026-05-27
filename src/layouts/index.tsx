import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

export default defineComponent({
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
