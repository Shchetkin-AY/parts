import { ButtonModes, type CatalogItem, Colors, Sizes, formatUsd, formatWheelDiameterRange, getString } from '@/utils'
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
      return props.value.model
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
            label={`${props.value.pistonCount} ${props.value.pistonCount < 5 ? 'поршня' : 'поршней'}`}
            color={Colors.muted}
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
            {formatUsd(props.value.priceUsd)}
          </div>
          <GButton
            label={'Подробнее'}
            size={Sizes.medium}
            color={Colors['text-secondary']}
            mode={ButtonModes.flat}
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
