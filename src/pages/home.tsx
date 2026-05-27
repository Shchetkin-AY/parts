import { defineComponent } from 'vue'

import Hero from '@/components/hero'
import Filter from '@/components/filter'
import Advantages from '@/components/advantages'
import Systems from '@/components/systems'
import PopularSystems from '@/components/popular'
import Brands from '@/components/brands'

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
        <Advantages class="home__section home__section--advantages" />
      )
    }

    const renderSystems = () => {
      return (
        <Systems class="home__section home__section--systems" />
      )
    }

    const renderPopular = () => {
      return (
        <PopularSystems class="home__section home__section--popular" />
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
