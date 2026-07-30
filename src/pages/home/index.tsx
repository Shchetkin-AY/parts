import { defineComponent } from 'vue'

import { Page } from '@/ui'
import Filter from '@/pages/home/ui/filter'
import Systems from '@/widgets/systems'
import Benefits from '@/pages/home/ui/benefits'
import Hero from '@/pages/home/ui/hero'
import Popular from '@/pages/home/ui/popular'
import Brands from '@/pages/home/ui/brands'

export default defineComponent({
  name: 'HomePage',

  setup() {
    const renderLead = () => {
      return (
        <section class="isk-page__section isk-page__section--contained home__group home__group--lead">
          <Hero />
          <Filter />
        </section>
      )
    }

    const renderBenefits = () => {
      return (
        <section class="isk-page__section isk-page__section--contained">
          <Benefits />
        </section>
      )
    }

    const renderSystems = () => {
      return (
        <section class="isk-page__section isk-page__section--contained">
          <Systems />
        </section>
      )
    }

    const renderPopular = () => {
      return (
        <section class="isk-page__section isk-page__section--contained">
          <Popular />
        </section>
      )
    }

    const renderBrands = () => {
      return (
        <section class="isk-page__section isk-page__section--contained">
          <Brands />
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
