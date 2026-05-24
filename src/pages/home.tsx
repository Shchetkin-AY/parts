import { defineComponent } from 'vue'
import Hero from '@/components/hero'
import Filter from '@/components/filter'
import ProductionRoute from '@/components/production-route'
import TechnicalExcellence from '@/components/technical-excellence'
import ProductHighlight from '@/components/product-highlight'

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

    const renderProductionRoute = () => {
      return (
        <ProductionRoute class="home__section home__section--production-route" />
      )
    }

    const renderTechnicalExcellence = () => {
      return (
        <TechnicalExcellence class="home__section home__section--technical-excellence" />
      )
    }

    const renderProductHighlight = () => {
      return (
        <ProductHighlight class="home__section home__section--product-highlight" />
      )
    }

    return () =>
      <div class="home">
        {renderLead()}
        {renderProductionRoute()}
        {renderTechnicalExcellence()}
        {renderProductHighlight()}
      </div>
  }
})
