import { type CatalogItem } from '@/utils'
import { PropType, defineComponent } from 'vue'
import ProductCard from '@/components/product-card'

export const ProductRelated = defineComponent({
  name: 'ProductRelated',

  props: {
    item: {
      type: Object as PropType<CatalogItem | null>,
      default: null
    },
    relatedItems: {
      type: Array as PropType<CatalogItem[]>,
      default: () => []
    }
  },

  setup(props) {
    const renderRelatedHeader = () => {
      if (!props.item) {
        return null
      }

      return (
        <div class="product-page__related-header">
          <div class="product-page__related-title">
            Другие комплекты {props.item.series}
          </div>
        </div>
      )
    }

    const renderRelatedCard = (item: CatalogItem) => {
      return (
        <div class="product-page__related-item">
          <ProductCard
            value={item}
            badge={item.id === props.item?.id}
          />
        </div>
      )
    }

    const renderRelatedGrid = () => {
      return (
        <div class="product-page__related-grid">
          {props.relatedItems.map(item => renderRelatedCard(item))}
        </div>
      )
    }

    return () => {
      return (
        <section class="product-page__related">
          {renderRelatedHeader()}
          {renderRelatedGrid()}
        </section>
      )
    }
  }
})
