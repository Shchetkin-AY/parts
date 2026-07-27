import { type CatalogItem } from '@/utils'
import { PropType, computed, defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'

export const Breadcrumbs = defineComponent({
  name: 'Breadcrumbs',

  props: {
    item: {
      type: Object as PropType<CatalogItem>,
      required: true
    }
  },

  setup(props) {
    const className = 'breadcrumbs'
    const catalogStore = useCatalogStore()

    const compatibilityBrand = computed(() => {
      const records = catalogStore.getCompatibilityByGoodsId(props.item.id)

      return records.length > 0 ? records[0].brand : ''
    })

    const title = computed(() => {
      const brand = compatibilityBrand.value

      if (brand) {
        return `${props.item.series} ${brand} ${props.item.model}`
      }

      return `${props.item.series} ${props.item.model}`
    })

    const renderBreadcrumbItem = (label: string, to?: string) => {
      if (to) {
        return (
          <RouterLink
            class={`${className}-link`}
            to={to}
          >
            {label}
          </RouterLink>
        )
      }

      return (
        <span class={`${className}-current`}>
          {label}
        </span>
      )
    }

    const renderSeparator = () => {
      return <span class={`${className}-separator`}>›</span>
    }

    return () => {
      return (
        <div class={className}>
          {renderBreadcrumbItem('Главная', '/')}
          {renderSeparator()}
          {renderBreadcrumbItem('Каталог', '/catalog')}
          {renderSeparator()}
          {renderBreadcrumbItem(props.item.category)}
          {renderSeparator()}
          {renderBreadcrumbItem(title.value)}
        </div>
      )
    }
  }
})
