import { useRouter } from 'vue-router'
import { PropType, computed, defineComponent, onMounted, ref } from 'vue'

import {
  ButtonModes, type CatalogItem, Colors, Sizes,
  formatUsd, formatWheelDiameterRange
} from '@/utils'

import { GButton, GChip } from '@/components'

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
    const seriesKey = computed(() => props.value.series.toLowerCase())

    const className = 'product-card'

    const images = computed(() =>
      [ 0, 1, 2 ].map(n => `/images/products/${seriesKey.value}/${n}.webp`))

    const activeImage = ref(Math.floor(Math.random() * images.value.length))
    const hover = ref<boolean>(false)

    const title = computed(() => props.value.model)

    const subtitle = computed(() => {
      const parts = [
        formatWheelDiameterRange(props.value.wheelDiameter),
        `${props.value.discDiameter} мм`
      ].filter(Boolean)

      return parts.join(' · ')
    })

    onMounted(() => {
      images.value.forEach(src => {
        const image = new Image()
        image.src = src
      })
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
    const renderOrderTime = () => {
      return (
        <div class="product-card__lead-time">
          Под заказ
        </div>
      )
    }
    const renderMediaHeader = () => {
      return (
        <div class="product-card__media-header">
          {renderChips()}
          {renderOrderTime()}
        </div>
      )
    }

    const renderGalleryDots = () => {
      if (images.value.length <= 1) {
        return null
      }

      return (
        <div class="product-card__gallery-dots">
          {images.value.map((_, i) =>
            <span
              key={i}
              class={[
                'product-card__dot',
                { 'product-card__dot--active': activeImage.value === i }
              ]}
              onMouseenter={(e: Event) => {
                e.stopPropagation(); activeImage.value = i
              }}
              onClick={(e: Event) => e.stopPropagation()}
            />)}
        </div>
      )
    }

    const renderImage = () => {
      return (
        <div class="product-card__media">
          {renderMediaHeader()}
          <img
            class="product-card__image"
            src={images.value[activeImage.value]}
            alt={title.value}
            loading="lazy"
            decoding="async"
            onError={(e: Event) => (e.target as HTMLImageElement).style.display = 'none'}
          />
          {renderGalleryDots()}
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

    const renderSpecs = () => {
      return (
        <div class="product-card__specs">
          <div class="product-card__spec">
            {props.value.features}
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
            size={Sizes.small}
            color={hover.value ? Colors.primary : Colors['text-secondary']}
            mode={ButtonModes.flat}
          />
        </div>
      )
    }

    const renderContent = () => {
      return (
        <div class="product-card__content">
          {renderHeader()}
          {renderSpecs()}
          {renderFooter()}
        </div>
      )
    }

    return () => {
      return (
        <div
          class={className}
          onMouseenter={() => hover.value = true}
          onMouseleave={() => hover.value = false}
          onClick={clickHandler}
        >
          {renderImage()}
          {renderContent()}
        </div>
      )
    }
  }
})
