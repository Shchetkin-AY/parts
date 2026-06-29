import { defineComponent } from 'vue'
import { AccessoryItem } from '@/utils'

const accessories: AccessoryItem[] = [
  {
    id: 1,
    title: 'Тормозные колодки',
    description: 'Performance',
    image: '/public/images/accessories/pads.webp'
  },
  {
    id: 2,
    title: 'Тормозные диски',
    description: 'Steel Core',
    image: '/public/images/accessories/discs.webp'
  },
  {
    id: 3,
    title: 'Тормозные шланги',
    description: 'Армированные',
    image: '/public/images/accessories/hoses.webp'
  }
]

export default defineComponent({
  name: 'Accessories',

  setup() {
    const renderHeader = () => {
      return (
        <div class="accessories__header">
          <div class="accessories__title">
            Рекомендуем
          </div>
        </div>
      )
    }
    const renderImage = (item: AccessoryItem) => {
      return (
        <div class="accessories__image">
          <img
            class="accessories__image-item"
            src={item.image}
            alt={item.title}
            loading="lazy"
          />
        </div>
      )
    }

    const renderContent = (item: AccessoryItem) => {
      return (
        <div class="accessories__content">
          <div class="accessories__name">
            {item.title}
          </div>

          <div class="accessories__description">
            {item.description}
          </div>
        </div>
      )
    }

    const renderItem = (item: AccessoryItem) => {
      return (
        <div class="accessories__item">
          {renderImage(item)}
          {renderContent(item)}
        </div>
      )
    }

    return () =>
      <aside class="accessories">
        {renderHeader()}

        <div class="accessories__list">
          {accessories.map(renderItem)}
        </div>
      </aside>
  }
})
