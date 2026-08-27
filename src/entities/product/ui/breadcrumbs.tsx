import { RouterLink, useRoute } from 'vue-router'
import { PropType, defineComponent } from 'vue'

import { CatalogFilterField, CatalogFilterParams, CatalogItem, buildCatalogFilterQuery } from '@/utils'

export const Breadcrumbs = defineComponent({
  name: 'Breadcrumbs',

  props: {
    item: {
      type: Object as PropType<CatalogItem>,
      required: true
    }
  },

  setup(props) {
    const route = useRoute()

    const className = 'breadcrumbs'

    const getCatalogLink = (params: CatalogFilterParams = {}) => {
      return {
        name: 'catalog',
        query: buildCatalogFilterQuery(params)
      }
    }

    const renderBreadcrumbItem = (label: string, params: CatalogFilterParams = {}) => {
      return (
        <RouterLink
          class={`${className}-link`}
          to={getCatalogLink(params)}
        >
          {label}
        </RouterLink>
      )
    }

    const renderSeparator = () => {
      return (
        <span
          class={`${className}-separator`}
          innerHTML={'/'}
        />
      )
    }

    return () => {
      const result = [
        renderBreadcrumbItem('Главная'),
        renderSeparator(),
        renderBreadcrumbItem('Каталог'),
        renderSeparator(),
        renderBreadcrumbItem('Комплекты')
      ]

      const { mark, model, wheelDiameter } = route.query

      if (mark) {
        result.push(renderSeparator())
        result.push(renderBreadcrumbItem(String(mark), { [CatalogFilterField.mark]: String(mark) }))
      }

      if (model) {
        result.push(renderSeparator())
        result.push(renderBreadcrumbItem(String(model), { [CatalogFilterField.model]: String(model) }))
      }

      if (wheelDiameter) {
        result.push(renderSeparator())
        result.push(renderBreadcrumbItem(`R${String(wheelDiameter)}`, { [CatalogFilterField.wheelDiameter]: String(wheelDiameter) }))
      }

      result.push(renderSeparator())
      result.push(renderBreadcrumbItem(props.item.series, { [CatalogFilterField.series]: props.item.series }))
      result.push(renderSeparator())
      result.push(renderBreadcrumbItem(props.item.model))

      return (
        <div class={className}>
          {...result}
        </div>
      )
    }
  }
})
