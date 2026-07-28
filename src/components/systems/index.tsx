import { defineComponent } from 'vue'
import { SystemCard, SystemCards } from '@/utils'
import SystemsCard from '@/components/systems/card'

export default defineComponent({
  name: 'SystemCards',

  setup() {
    const className = 'systems'

    const renderTitle = () => {
      return <span class={`${className}__title`}>Серии комплектов</span>
    }

    const renderCard = (card: SystemCard) => {
      return (
        <SystemsCard
          value={card}
          key={card.type}
        />
      )
    }

    const renderCards = () => {
      return SystemCards.map(card => {
        return renderCard(card)
      })
    }
    const renderContent = () => {
      return (
        <div class={`${className}__content`} >
          {renderTitle()}
          <div class={`${className}__cards`}>
            {renderCards()}
          </div>
        </div>
      )
    }

    return () => {
      return (
        <section class={className}>
          {renderContent()}
        </section>
      )
    }
  }
})
