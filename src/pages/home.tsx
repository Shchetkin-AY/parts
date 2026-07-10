import { defineComponent } from 'vue'

import Filter from '@/components/filter'
import Systems from '@/components/systems'
import Benefits from '@/components/home/benefits'
import Hero from '@/components/home/hero'
import Popular from '@/components/home/popular'
import Brands from '@/components/home/brands'

export default defineComponent({
  name: 'HomePage',

  setup() {
    const renderLead = () => {
      return (
        <div class="home__group home__group--lead">
          <Hero class="home__section home__section--hero" />
          <Filter class="home__section home__section--filter" />
        </div>
      )
    }

    const renderAdvantages = () => {
      return (
        <Benefits class="home__section home__section--benefits" />
      )
    }

    const renderSystems = () => {
      return (
        <Systems class="home__section home__section--systems" />
      )
    }

    const renderPopular = () => {
      return (
        <Popular class="home__section home__section--popular" />
      )
    }

    const renderBrands = () => {
      return <Brands class="home__section home__section--brands"/>
    }

    return () =>
      <div class="home">
        {renderLead()}
        {renderAdvantages()}
        {renderSystems()}
        {renderPopular()}
        {renderBrands()}
      </div>
  }
})
