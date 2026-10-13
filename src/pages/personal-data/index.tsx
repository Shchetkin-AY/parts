import { Page } from '@/components'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PersonalDataPage',

  setup() {
    const className = 'personal-data'

    const renderContent = () => {
      return (
        <section class="isk-page__section isk-page__section--contained">
          <div class={`${className}__content`}>
            <h1 class={`${className}__title`}>Персональные данные</h1>
            <p class={`${className}__text`}>В работе</p>
          </div>
        </section>
      )
    }

    return () =>
      <Page class={className}>
        {renderContent()}
      </Page>
  }
})
