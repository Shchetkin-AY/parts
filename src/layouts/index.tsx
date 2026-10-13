import { defineComponent, ref } from 'vue'
import { RouterView } from 'vue-router'
import { Feedback } from '@/features'
import { Footer, Navigation } from '@/widgets'

export const Layout = defineComponent({
  name: 'Layout',

  setup() {
    const isFeedbackOpen = ref(false)

    const renderFeedback = () =>
      <Feedback
        v-model={isFeedbackOpen.value}
        topic="Нужна консультация по продукции"
      />

    return () =>
      <div class="layout">
        <Navigation />

        <main class="layout__content">
          <RouterView />
        </main>

        <Footer onConsult={() => isFeedbackOpen.value = true} />
        {renderFeedback()}
      </div>
  }
})

export default Layout
