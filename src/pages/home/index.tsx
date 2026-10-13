import { defineComponent } from 'vue'

import { useScrollReveal } from '@/composables'

import { Page } from '@/components'
import {
  HomeBenefits,
  HomeBrands,
  HomeFilter,
  HomeHero,
  HomePopular,
  HomeSystems
} from '@/pages/home/ui'

export default defineComponent({
  name: 'HomePage',

  setup() {
    useScrollReveal()

    const renderLead = () => {
      return (
        <section class="isk-page__section isk-page__section--contained home__group home__group--lead" data-reveal>
          <HomeHero />
          <HomeFilter />
        </section>
      )
    }

    const renderBenefits = () => {
      return (
        <section class="isk-page__section isk-page__section--contained">
          <HomeBenefits />
        </section>
      )
    }

    const renderSystems = () => {
      return (
        <section class="isk-page__section isk-page__section--contained" data-reveal>
          <HomeSystems />
        </section>
      )
    }

    const renderPopular = () => {
      return (
        <section class="isk-page__section isk-page__section--contained" data-reveal>
          <HomePopular />
        </section>
      )
    }

    const renderBrands = () => {
      return (
        <section class="isk-page__section isk-page__section--contained" data-reveal>
          <HomeBrands />
        </section>
      )
    }

    return () => {
      return (
        <Page class="home">
          {renderLead()}
          {renderBenefits()}
          {renderSystems()}
          {renderPopular()}
          {renderBrands()}
        </Page>
      )
    }
  }
})
