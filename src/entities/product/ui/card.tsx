import { useRoute, useRouter } from 'vue-router'
import { PropType, computed, defineComponent, onMounted, ref } from 'vue'

import {
  CatalogItem, Color,
  formatPrice,
  getWheelDiameterRange,
  pluralize
} from '@/utils'

import { UiChip } from '@/ui'

const SWIPE_THRESHOLD = 40

export const ProductCard = defineComponent({

  name: 'ProductCard',

  props: {
    value: {
      type: Object as PropType<CatalogItem>,
      required: true
    }
  },

  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const seriesKey = computed(() => props.value.series.toLowerCase())

    const className = 'product-card'

    const hover = ref<boolean>(false)

    const title = computed(() => props.value.model)

    const pistonCount = computed<string>(() => {
      return [
        props.value.pistonCount,
        pluralize(props.value.pistonCount, 'поршень', 'поршня', 'поршней')
      ].join(' ')
    })

    const images = computed(() => {
      return [ 0, 1, 2 ].map(n => `/images/products/${seriesKey.value}/${n}.webp`)
    })

    const activeImage = ref(Math.floor(Math.random() * images.value.length))

    const specs = computed(() => {
      const parts: string[] = [
        getWheelDiameterRange(props.value.wheelDiameter),
        props.value.discDiameter ? `${props.value.discDiameter} мм` : ''
      ]

      if (props.value.pistonArea) {
        parts.push(`${props.value.pistonArea} см²`)
      }

      return parts.filter(Boolean)
    })

    const feature = computed(() => props.value.features || '')

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
        },
        query: route.query
      })
    }

    // --- свайп ---
    const touchStartX = ref<number | null>(null)
    const touchStartY = ref<number | null>(null)
    const isSwiping = ref(false)

    const setActiveImage = (index: number): void => {
      const total = images.value.length
      activeImage.value = (index % total + total) % total
    }

    const touchStartHandler = (e: TouchEvent): void => {
      if (images.value.length <= 1) {
        return
      }

      const touch = e.touches[0]
      touchStartX.value = touch.clientX
      touchStartY.value = touch.clientY
      isSwiping.value = false
    }

    const touchMoveHandler = (e: TouchEvent): void => {
      if (touchStartX.value === null || touchStartY.value === null) {
        return
      }

      const touch = e.touches[0]
      const deltaX = touch.clientX - touchStartX.value
      const deltaY = touch.clientY - touchStartY.value

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        isSwiping.value = true
        e.preventDefault()
      }
    }

    const touchEndHandler = (e: TouchEvent): void => {
      if (touchStartX.value === null || !isSwiping.value) {
        touchStartX.value = null
        touchStartY.value = null

        return
      }

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartX.value

      if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
        e.stopPropagation()
        if (deltaX < 0) {
          setActiveImage(activeImage.value + 1)
        } else {
          setActiveImage(activeImage.value - 1)
        }
      }

      touchStartX.value = null
      touchStartY.value = null
      isSwiping.value = false
    }

    const renderPistonChip = () => {
      return (
        <UiChip
          label={pistonCount.value}
          color={Color.muted}
        />
      )
    }

    const renderMediaHeader = () => {
      return (
        <div class={`${className}__media-header`}>
          {renderPistonChip()}
        </div>
      )
    }

    const renderGalleryDots = () => {
      if (images.value.length <= 1) {
        return null
      }

      return (
        <div class={`${className}__gallery-dots`}>
          {images.value.map((_, i) =>
            <span
              key={i}
              class={[
                `${className}__dot`,
                { [`${className}__dot--active`]: activeImage.value === i }
              ]}
              onMouseenter={(e: Event) => {
                e.stopPropagation(); activeImage.value = i
              }}
              onClick={(e: Event) => {
                e.stopPropagation(); setActiveImage(i)
              }}
            />)}
        </div>
      )
    }

    const renderImage = () => {
      return (
        <div
          class={`${className}__media`}
          onTouchstart={touchStartHandler}
          onTouchmove={touchMoveHandler}
          onTouchend={touchEndHandler}
        >
          {renderMediaHeader()}
          <img
            class={`${className}__image`}
            src={images.value[activeImage.value]}
            alt={title.value}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={(e: Event) => (e.target as HTMLImageElement).style.display = 'none'}
          />
          {renderGalleryDots()}
        </div>
      )
    }

    const renderSpecs = () => {
      return (
        <div class={`${className}__specs`}>
          {specs.value.map((spec, index) =>
            <span
              key={index}
              class={`${className}__spec`}
            >
              {spec}
            </span>)}
        </div>
      )
    }

    const renderFeature = () => {
      if (!feature.value) {
        return null
      }

      return (
        <div class={`${className}__feature`}>
          {feature.value}
        </div>
      )
    }

    const renderFooter = () => {
      return (
        <div class={`${className}__footer`}>
          <div class={{
            [`${className}__price`]: true,
            [`${className}__price--empty`]: props.value.price === 0
          }}>
            {formatPrice(props.value.price)}
          </div>

          {/* // заготовка для отображения наличия */}
          {/* <div class={`${className}__lead-time`}>
            Под заказ
          </div> */}
        </div>
      )
    }

    const renderContent = () => {
      return (
        <div class={`${className}__content`}>
          <div class={`${className}__title`}>
            {title.value}
          </div>
          {renderSpecs()}
          {renderFeature()}
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
