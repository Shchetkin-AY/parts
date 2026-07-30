import { defineComponent } from 'vue'
import { SystemCardItem, systemCardItems } from '@/utils'
import Card from '@/widgets/systems/card'

export default defineComponent({
  name: 'systemCardItems',

  setup() {
    const className = 'systems'

    const renderTitle = () => {
      return <span class={`${className}__title`}>Серии комплектов</span>
    }

    const renderCard = (card: SystemCardItem) => {
      return (
        <Card
          value={card}
          key={card.type}
        />
      )
    }

    const renderCards = () => {
      return systemCardItems.map(card => {
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
