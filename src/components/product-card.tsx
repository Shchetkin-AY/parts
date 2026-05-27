import { Fragment, PropType, computed, defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { CatalogItem, formatPrice, getString } from '@/utils'

export interface CatalogProductCardProps {
  value: CatalogItem,
  image: string
}

export const catalogProductCardProps = {
  value: {
    type: Object as PropType<CatalogItem>,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}

const baseClassName = 'product-card'

export const CatalogProductCard = defineComponent({

  name: 'CatalogProductCard',

  props: catalogProductCardProps,

  setup(props) {
    const resolvedItem = computed(() => {
      return props.value as CatalogItem
    })
    const title = computed(() => {
      return [ props.value?.model, props.value?.series ].filter(Boolean).join(' ')
    })
    const subtitle = computed(() => {
      const disc = getString(resolvedItem.value.discDiameterMm)
      const piston = getString(resolvedItem.value.pistonCount)
      const parts = [ piston ? `${piston} порш.` : '', disc ? `${disc} мм` : '' ].filter(Boolean)

      if (parts.length === 0) {
        return getString(resolvedItem.value.application)
      }

      return parts.join(' / ')
    })
    const meta = computed(() => {
      return [ getString(resolvedItem.value.vehicleBrand), getString(resolvedItem.value.vehicleModel) ].filter(Boolean).join(' / ')
    })
    const price = computed(() => {
      return formatPrice(resolvedItem.value.priceUsd)
    })

    const renderImage = () => {
      return (
        <div class={`${baseClassName}__media`}>
          <img
            alt={title.value}
            class={`${baseClassName}__image`}
            src={props.image}
          />
        </div>
      )
    }
    const renderHeader = () => {
      return (
        <Fragment>
          <h3 class={`${baseClassName}__title`}>{title.value}</h3>
          <p class={`${baseClassName}__subtitle`}>{subtitle.value}</p>
        </Fragment>
      )
    }
    const renderMeta = () => {
      return (
        <p class={`${baseClassName}__meta`}>{meta.value || 'Совместимость уточняется'}</p>
      )
    }
    const renderFooter = () => {
      return (
        <div class={`${baseClassName}__footer`}>
          <span class={`${baseClassName}__price`}>{price.value}</span>
        </div>
      )
    }
    const renderBody = () => {
      return (
        <div class={`${baseClassName}__body`}>
          {renderHeader()}
          {renderMeta()}
          {renderFooter()}
        </div>
      )
    }

    return () => {
      return (
        <RouterLink
          class={baseClassName}
          to={{
            name: 'catalog.single',
            params: { id: resolvedItem.value.id }
          }}
        >
          {renderImage()}
          {renderBody()}
        </RouterLink>
      )
    }
  }
})
