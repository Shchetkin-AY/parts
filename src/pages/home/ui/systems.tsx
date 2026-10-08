import { defineComponent } from 'vue'

import { systemCardItems } from '@/data'
import { HomeSystemCard } from './home-system-card'

export const HomeSystems = defineComponent({
  name: 'HomeSystems',

  setup() {
    const className = 'home-systems'

    const renderCard = (item: (typeof systemCardItems)[number]) => {
      return <HomeSystemCard item={item} key={item.type} />
    }

    const renderCards = () => {
      return systemCardItems.map(renderCard)
    }

    return () => {
      return (
        <section class={className}>
          <div class={`${className}__content`}>
            <h2 class={`${className}__title`}>Серии комплектов</h2>
            <div class={`${className}__cards`}>
              {renderCards()}
            </div>
          </div>
        </section>
      )
    }
  }
})
