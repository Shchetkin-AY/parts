import { PropType, computed, defineComponent } from 'vue'

import { useCatalogStore } from '@/stores'

import { type CatalogItem } from '@/utils'
import { ProductCard } from './card'

export const ProductRelated = defineComponent({
  name: 'ProductRelated',

  props: {
    item: {
      type: Object as PropType<CatalogItem | null>,
      default: null
    }
  },

  setup(props) {
    const catalogStore = useCatalogStore()

    const className = 'related'

    const items = computed(() => {
      if (!props.item) {
        return []
      }

      return catalogStore.getRelatedItems(props.item, 4)
    })

    const renderRelatedHeader = () => {
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

    const renderRelatedCard = (item: CatalogItem) => {
      return (
        <div class={`${className}-item`}>
          <ProductCard
            value={item}
          />
        </div>
      )
    }

    const renderRelatedCards = () => {
      return (
        <div class={`${className}-cards`}>
          {items.value.map(item => renderRelatedCard(item))}
        </div>
      )
    }

    return () => {
      return (
        <section class={className}>
          {renderRelatedHeader()}
          {renderRelatedCards()}
        </section>
      )
    }
  }
})
