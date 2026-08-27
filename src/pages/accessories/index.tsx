import { defineComponent, ref } from 'vue'

import { Page } from '@/ui'
import { Feedback } from '@/features'
import { AccessoriesCcb, AccessoriesDiscs, AccessoriesHero, AccessoriesLines, AccessoriesPads, AccessoriesSubnav } from '@/pages/accessories/ui'
import { CatalogCategories } from '@/utils'

export default defineComponent({
  name: 'AccessoriesPage',

  setup() {
    const showFeedback = ref(false)
    const feedbackCategory = ref<CatalogCategories>()

    const orderHandler = (category: CatalogCategories) => {
      feedbackCategory.value = category
      showFeedback.value = true
    }

    const renderHero = () => {
      return (
        <section class="isk-page__section isk-page__section--contained">
          <AccessoriesHero />
        </section>
      )
    }

    const renderSubnav = () => {
      return <AccessoriesSubnav />
    }

    const renderDiscs = () => {
      return (
        <section id="discs" class="isk-page__section isk-page__section--contained">
          <AccessoriesDiscs onOrder={orderHandler} />
        </section>
      )
    }

    const renderCcb = () => {
      return (
        <section id="ccb" class="isk-page__section isk-page__section--contained">
          <AccessoriesCcb onOrder={orderHandler} />
        </section>
      )
    }

    const renderPads = () => {
      return (
        <section id="pads" class="isk-page__section isk-page__section--contained">
          <AccessoriesPads onOrder={orderHandler} />
        </section>
      )
    }

    const renderLines = () => {
      return (
        <section id="lines" class="isk-page__section isk-page__section--contained">
          <AccessoriesLines onOrder={orderHandler} />
        </section>
      )
    }

    const renderFeedback = () => {
      return (
        <Feedback
          v-model={showFeedback.value}
          category={feedbackCategory.value}
        />
      )
    }

    return () =>
      <Page class="accessories-page">
        {renderHero()}
        {renderSubnav()}
        {renderDiscs()}
        {renderCcb()}
        {renderPads()}
        {renderLines()}
        {renderFeedback()}
      </Page>
  }
})
