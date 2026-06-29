import { CatalogItem, Colors, getString } from '@/utils'
import { PropType, computed, defineComponent } from 'vue'
import { GChip } from './g'
import { RouterLink } from 'vue-router'

export default defineComponent({

  name: 'ProductCard',

  props: {
    value: {
      type: Object as PropType<CatalogItem>,
      required: true
    },

    badge: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },

  setup(props) {
    const title = computed(() => {
      return [ props.value.series, props.value.model ].join('  ')
    })

    const subtitle = computed(() => {
      const disc = getString(props.value.discDiameterMm)
      const piston = getString(props.value.pistonCount)
      const parts = [ piston ? `${piston} порш.` : '', disc ? `${disc} мм` : '' ].filter(Boolean)

      return parts.join(' · ')
    })

    const classes = computed(() => {
      return {

        'product-card': true,
        'product-card--hit': props.badge
      }
    })

    const renderBadge = () => {
      if (props.badge) {
        return (
          <GChip
            label={'ХИТ'}
            color={Colors.primary}
            position={'absolute'}
            coordinates={{
              top: 15,
              left: 15
            }}
          />
        )
      }
    }

    const renderImage = () => {
      return (

        <div class="product-card__media">
          {renderBadge()}
          <img

            class="product-card__image"
            src={`/images/products/${props.value.series.toLowerCase()}.webp`}
            alt={title.value}
            loading="lazy"
            decoding="async"
          />
        </div>
      )
    }

    const renderHeader = () => {
      return (

        <div class="product-card__header">
          <div class="product-card__title">
            {title.value}
          </div>

          <div class="product-card__subtitle">
            {subtitle.value}
          </div>
        </div>
      )
    }

    const renderFooter = () => {
      return (

        <div class="product-card__footer">
          <div class="product-card__price">
            {props.value.priceUsd.toLocaleString('ru-RU', {
              style: 'currency',
              currency: 'USD'
            })}
          </div>
        </div>
      )
    }

    const renderContent = () => {
      return (

        <div class="product-card__content">
          {renderHeader()}
          {renderFooter()}
        </div>
      )
    }

    return () => {
      return (
        <RouterLink
          class={classes.value}
          to={{
            name: 'catalog.single',
            params: {
              category: 'kits',
              id: props.value.id
            }
          }}
        >
          {renderImage()}
          {renderContent()}
        </RouterLink>
      )
    }
  }
})
