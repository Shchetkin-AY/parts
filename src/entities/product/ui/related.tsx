import {
  PropType,
  defineComponent,
  nextTick,
  watch
} from 'vue'

import { useHorizontalCarousel } from '@/composables'
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

    const {
      viewportRef,
      canScrollPrev,
      canScrollNext,
      updateScrollState,
      scrollPrev,
      scrollNext
    } = useHorizontalCarousel()

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
