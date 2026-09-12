import {
  PropType,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import { CatalogItem } from '@/utils'
import { ProductCard } from './card'

export const ProductRelated = defineComponent({
  name: 'ProductRelated',

  props: {
    item: {
      type: Object as PropType<CatalogItem | null>,
      default: null
    },
    items: {
      type: Array as PropType<CatalogItem[]>,
      default: () => []
    }
  },

  setup(props) {
    const className = 'related'

    const viewportRef = ref<HTMLElement | null>(null)
    const canScrollPrev = ref(false)
    const canScrollNext = ref(false)

    const updateScrollState = () => {
      const el = viewportRef.value

      if (!el) {
        canScrollPrev.value = false
        canScrollNext.value = false

        return
      }

      canScrollPrev.value = el.scrollLeft > 0
      canScrollNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    }

    const getScrollStep = (): number => {
      const el = viewportRef.value

      if (!el) {
        return 0
      }

      const card = el.firstElementChild as HTMLElement | null

      if (!card) {
        return el.clientWidth
      }

      const gap = parseFloat(getComputedStyle(el).columnGap) || 0

      return card.getBoundingClientRect().width + gap
    }

    const scrollPrev = () => {
      viewportRef.value?.scrollBy({
        left: -getScrollStep(),
        behavior: 'smooth'
      })
    }

    const scrollNext = () => {
      viewportRef.value?.scrollBy({
        left: getScrollStep(),
        behavior: 'smooth'
      })
    }

    onMounted(() => {
      updateScrollState()
      window.addEventListener('resize', updateScrollState)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateScrollState)
    })

    watch(
      () => props.items,
      () => {
        void nextTick(updateScrollState)
      }
    )

    const renderHeader = () => {
      if (!props.item) {
        return null
      }

      return (
        <div class={`${className}-header`}>
          <h3 class={`${className}-title`}>
            Другие комплекты {props.item.series}
          </h3>
        </div>
      )
    }

    const renderCard = (item: CatalogItem) => {
      return (
        <div class={`${className}-item`}>
          <ProductCard value={item} />
        </div>
      )
    }

    const renderCards = () => {
      return (
        <div
          class={{
            [`${className}-cards`]: true,
            [`${className}-cards--fade-left`]: canScrollPrev.value,
            [`${className}-cards--fade-right`]: canScrollNext.value
          }}
          ref={viewportRef}
          onScroll={updateScrollState}
        >
          {props.items.map(renderCard)}
        </div>
      )
    }

    const renderArrowIcon = (direction: 'prev' | 'next') => {
      const points = direction === 'prev' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'

      return (
        <svg
          class={`${className}-arrow-icon`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points={points} />
        </svg>
      )
    }

    const renderArrow = (
      direction: 'prev' | 'next',
      handler: () => void,
      hidden: boolean
    ) => {
      return (
        <button
          class={{
            [`${className}-arrow`]: true,
            [`${className}-arrow--${direction}`]: true,
            [`${className}-arrow--hidden`]: hidden
          }}
          type="button"
          aria-label={direction === 'prev' ? 'Прокрутить назад' : 'Прокрутить вперёд'}
          aria-hidden={hidden}
          onClick={handler}
        >
          {renderArrowIcon(direction)}
        </button>
      )
    }

    const renderCarousel = () => {
      return (
        <div class={`${className}-carousel`}>
          {renderCards()}
          {renderArrow('prev', scrollPrev, !canScrollPrev.value)}
          {renderArrow('next', scrollNext, !canScrollNext.value)}
        </div>
      )
    }

    return () => {
      return (
        <section class={className}>
          {renderHeader()}
          {renderCarousel()}
        </section>
      )
    }
  }
})
