import { type CatalogItem } from '@/utils'
import { PropType, defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

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
          {renderBreadcrumbItem(`${props.item.series} ${props.item.model}`)}
        </div>
      )
    }
  }
})
