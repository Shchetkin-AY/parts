import { PropType, computed, defineComponent } from 'vue'

import { useCatalogStore, useViewportStore } from '@/stores'

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
    const viewportStore = useViewportStore()
    const catalogStore = useCatalogStore()

    const items = computed(() => {
      if (!props.item) {
        return []
      }

      let itemsCount = 4

      if (viewportStore.size.width < 1520) {
        itemsCount = 3
      }
      if (viewportStore.size.width < 1100) {
        itemsCount = 2
      }

      return catalogStore.getRelatedItems(props.item, itemsCount)
    })

    const renderRelatedHeader = () => {
      if (!props.item) {
        return null
      }

      return (
        <div class="related-header">
          <h3 class="related-title">
            Другие комплекты {props.item.series}
          </h3>
        </div>
      )
    }

    const renderRelatedCard = (item: CatalogItem) => {
      return (
        <div class="related-item">
          <ProductCard
            value={item}
          />
        </div>
      )
    }

    const renderRelatedCards = () => {
      return (
        <div class="related-cards">
          {items.value.map(item => renderRelatedCard(item))}
        </div>
      )
    }

    return () => {
      return (
        <section class="related">
          {renderRelatedHeader()}
          {renderRelatedCards()}
        </section>
      )
    }
  }
})
