import { PropType, defineComponent } from 'vue'

import { CatalogItem } from '@/utils'
import { ProductCard } from './card'

export const ProductRelated = defineComponent({
  name: 'ProductRelated',

  props: {
    item: {
      type: Object as PropType<CatalogItem | null>,
      default: null
    },
    items: {
      type: Array as PropType<CatalogItem[]>,
      default: () => []
    }
  },

  setup(props) {
    const className = 'related'

    const renderHeader = () => {
      if (!props.item) {
        return null
      }

      return (
        <div class={`${className}-header`}>
          <h3 class={`${className}-title`}>
            Другие комплекты {props.item.series}
          </h3>
        </div>
      )
    }

    const renderCard = (item: CatalogItem) => {
      return (
        <div class={`${className}-item`}>
          <ProductCard value={item} />
        </div>
      )
    }

    const renderCards = () => {
      return (
        <div class={`${className}-cards`}>
          {props.items.map(renderCard)}
        </div>
      )
    }

    return () => {
      return (
        <section class={className}>
          {renderHeader()}
          {renderCards()}
        </section>
      )
    }
  }
})
