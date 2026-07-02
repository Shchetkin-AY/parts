import { type CatalogItem, Colors, Sizes, formatWheelDiameterRange, getString } from '@/utils'
import { PropType, computed, defineComponent } from 'vue'
import { GButton, GChip } from './g'
import { useRouter } from 'vue-router'

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
    const router = useRouter()

    const title = computed(() => {
      return [ props.value.series, props.value.model ].join('  ')
    })

    const subtitle = computed(() => {
      const piston = getString(props.value.pistonCount)
      const parts = [ props.value.wheelDiameter ? formatWheelDiameterRange(props.value.wheelDiameter) : '', piston ? `${piston} порш.` : '' ].filter(Boolean)

      return parts.join(' · ')
    })

    const classes = computed(() => {
      return {

        'product-card': true,
        'product-card--hit': props.badge
      }
    })

    const clickHandler = () => {
      router.push({
        name: 'catalog.single',
        params: {
          category: 'kits',
          id: props.value.id
        }
      })
    }

    const renderHitChip = () => {
      if (props.badge) {
        return (
          <GChip
            label={'ХИТ'}
            color={Colors.primary}
          />
        )
      }
    }

    const renderChips = () => {
      return (
        <div class="product-card__chips">
          <GChip
            label={`${props.value.pistonCount} поршней`}
            // color={Colors['text-secondary']}
          />
          {renderHitChip()}
        </div>
      )
    }

    const renderImage = () => {
      return (

        <div class="product-card__media">
          {renderChips()}
          <img
            class="product-card__image"
            src={`/images/products/${props.value.series.toLowerCase()}/1.webp`}
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
            {props.value.model}
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
          <GButton
            label={'Подробнее'}
            size={Sizes.small}
            outline
            onClick={clickHandler}
          />
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
        <div
          class={classes.value}
        >
          {renderImage()}
          {renderContent()}
        </div>
      )
    }
  }
})
