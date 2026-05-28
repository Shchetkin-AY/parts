import { CatalogItem, Colors, getString } from '@/utils'
import { PropType, computed, defineComponent } from 'vue'
import { GChip } from '@/components'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'PopularSystemsCard',

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
        'popular-systems-card': true,
        'popular-systems-card--hit': props.badge
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
        <div class="popular-systems-card__media">
          {renderBadge()}
          <img
            class="popular-systems-card__image"
            src={`${props.value.series.toLowerCase()}.webp`}
            alt={title.value}
            loading="lazy"
          />
        </div>
      )
    }

    const renderHeader = () => {
      return (
        <div class="popular-systems-card__header">
          <div class="popular-systems-card__title">
            {title.value}
          </div>
          <div class="popular-systems-card__subtitle">
            {subtitle.value}
          </div>
        </div>
      )
    }

    const renderFooter = () => {
      return (
        <div class="popular-systems-card__footer">
          <div class="popular-systems-card__price">
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
        <div class="popular-systems-card__content">
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
            params: { id: props.value.id }
          }}
        >
          {renderImage()}
          {renderContent()}
        </RouterLink>
      )
    }
  }
})
