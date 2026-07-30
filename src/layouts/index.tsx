import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import Navigation from '@/widgets/navigation'
import Footer from '@/widgets/footer'

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
