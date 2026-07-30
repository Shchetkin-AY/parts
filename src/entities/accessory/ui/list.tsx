import { defineComponent } from 'vue'
import { AccessoryItem } from '@/utils'

import Item from '@/entities/accessory/ui/item'

const accessories: AccessoryItem[] = [
  {
    id: 1,
    title: 'Тормозные колодки',
    description: 'Performance',
    image: '/images/accessories/pads.webp'
  },
  {
    id: 2,
    title: 'Тормозные диски',
    description: 'Steel Core',
    image: '/images/accessories/discs.webp'
  },
  {
    id: 3,
    title: 'Тормозные шланги',
    description: 'Армированные',
    image: '/images/accessories/hoses.webp'
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

    const renderItem = (item: AccessoryItem) => {
      return <Item value={item} />
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
