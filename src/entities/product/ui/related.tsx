import { type CatalogItem } from '@/utils'
import { PropType, computed, defineComponent } from 'vue'
import ProductCatalogCard from '@/entities/product/ui/catalog-card'
import { useCatalogStore, useViewportStore } from '@/stores'

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

    const className = 'related'

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
          <div class="related-title">
            Другие комплекты {props.item.series}
          </div>
        </div>
      )
    }

    const renderRelatedCard = (item: CatalogItem) => {
      return (
        <div class="related-item">
          <ProductCatalogCard
            value={item}
            badge={item.id === props.item?.id}
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
