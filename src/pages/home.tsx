import { defineComponent } from 'vue'
import Hero from '@/components/hero'
import Filter from '@/components/filter'
import ProductionRoute from '@/components/production-route'
import Advantages from '@/components/advantages'
import Systems from '@/components/systems'

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

    const renderProductionRoute = () => {
      return (
        <ProductionRoute class="home__section home__section--production-route" />
      )
    }

    return () =>
      <div class="home">
        {renderLead()}
        {renderAdvantages()}
        {renderSystems()}
        {renderProductionRoute()}
      </div>
  }
})
