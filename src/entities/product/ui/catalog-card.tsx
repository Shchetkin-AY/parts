import { useRouter } from 'vue-router'
import { PropType, computed, defineComponent, onMounted, ref } from 'vue'

import {
  ButtonMode, type CatalogItem, Color, Size,
  formatUsd,
  getWheelDiameterRange,
  pluralize
} from '@/utils'

import { UiButton, UiChip } from '@/ui'

export default defineComponent({

  name: 'ProductCatalogCard',

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

    const className = 'product-catalog-card'

    const hover = ref<boolean>(false)

    const title = computed(() => props.value.model)

    const pistonCount = computed<string>(() => {
      return pluralize(props.value.pistonCount, 'поршень', 'поршня', 'поршней')
    })
    const images = computed(() => {
      return [ 0, 1, 2 ].map(n => `/images/products/${seriesKey.value}/${n}.webp`)
    })
    const activeImage = ref(Math.floor(Math.random() * images.value.length))
    const subtitle = computed(() => {
      const parts = [
        getWheelDiameterRange(props.value.wheelDiameter),
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
          <UiChip
            label={'ХИТ'}
            color={Color.primary}
          />
        )
      }
    }

    const renderChips = () => {
      return (
        <div class="product-catalog-card__chips">
          <UiChip
            label={pistonCount.value}
            color={Color.muted}
          />
          {renderHitChip()}
        </div>
      )
    }
    const renderOrderTime = () => {
      return (
        <div class="product-catalog-card__lead-time">
          Под заказ
        </div>
      )
    }
    const renderMediaHeader = () => {
      return (
        <div class="product-catalog-card__media-header">
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
        <div class="product-catalog-card__gallery-dots">
          {images.value.map((_, i) =>
            <span
              key={i}
              class={[
                'product-catalog-card__dot',
                { 'product-catalog-card__dot--active': activeImage.value === i }
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
        <div class="product-catalog-card__media">
          {renderMediaHeader()}
          <img
            class="product-catalog-card__image"
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
        <div class="product-catalog-card__header">
          <div class="product-catalog-card__title">
            {title.value}
          </div>

          <div class="product-catalog-card__subtitle">
            {subtitle.value}
          </div>
        </div>
      )
    }

    const renderSpecs = () => {
      return (
        <div class="product-catalog-card__specs">
          <div class="product-catalog-card__spec">
            {props.value.features}
          </div>
        </div>
      )
    }

    const renderFooter = () => {
      return (
        <div class="product-catalog-card__footer">
          <div class="product-catalog-card__price">
            {formatUsd(props.value.priceUsd)}
          </div>
          <UiButton
            label={'Подробнее'}
            size={Size.small}
            color={hover.value ? Color.primary : Color['text-secondary']}
            mode={hover.value ? undefined : ButtonMode.flat }
          />
        </div>
      )
    }

    const renderContent = () => {
      return (
        <div class="product-catalog-card__content">
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
