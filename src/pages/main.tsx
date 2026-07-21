import { defineComponent } from 'vue'

import { Page } from '@/components'
import Filter from '@/components/filter'
import Systems from '@/components/systems'
import Benefits from '@/components/main/benefits'
import Hero from '@/components/main/hero'
import Popular from '@/components/main/popular'
import Brands from '@/components/main/brands'

export default defineComponent({
  name: 'MainPage',

  setup() {
    const renderLead = () => {
      return (
        <section class="page__section page__section--contained home__group home__group--lead">
          <Hero />
          <Filter />
        </section>
      )
    }

    const renderBenefits = () => {
      return (
        <section class="page__section page__section--contained">
          <Benefits />
        </section>
      )
    }

    const renderSystems = () => {
      return (
        <section class="page__section page__section--contained">
          <Systems />
        </section>
      )
    }

    const renderPopular = () => {
      return (
        <section class="page__section page__section--contained">
          <Popular />
        </section>
      )
    }

    const renderBrands = () => {
      return (
        <section class="page__section page__section--contained">
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
