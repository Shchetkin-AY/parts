import { defineComponent } from 'vue'

import { useHorizontalCarousel } from '@/composables'
import { systemCardItems } from '@/utils'
import { HomeSystemCard } from './home-system-card'

export const HomeSystems = defineComponent({
  name: 'HomeSystems',

  setup() {
    const className = 'home-systems'

    const {
      viewportRef,
      canScrollPrev,
      canScrollNext,
      updateScrollState,
      scrollPrev,
      scrollNext
    } = useHorizontalCarousel()

    const renderCard = (item: (typeof systemCardItems)[number]) => {
      return <HomeSystemCard item={item} key={item.type} />
    }

    const renderCards = () => {
      return (
        <div
          class={`${className}__cards`}
          ref={viewportRef}
          onScroll={updateScrollState}
        >
          {systemCardItems.map(renderCard)}
        </div>
      )
    }

    const renderArrow = (
      direction: 'prev' | 'next',
      handler: () => void,
      hidden: boolean
    ) => {
      const points = direction === 'prev' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'

      return (
        <button
          class={{
            [`${className}__arrow`]: true,
            [`${className}__arrow--${direction}`]: true,
            [`${className}__arrow--hidden`]: hidden
          }}
          type="button"
          aria-label={direction === 'prev' ? 'Прокрутить назад' : 'Прокрутить вперёд'}
          aria-hidden={hidden}
          onClick={handler}
        >
          <svg
            class={`${className}__arrow-icon`}
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
        </button>
      )
    }

    const renderCarousel = () => {
      return (
        <div class={`${className}__carousel`}>
          {renderCards()}
          {renderArrow('prev', scrollPrev, !canScrollPrev.value)}
          {renderArrow('next', scrollNext, !canScrollNext.value)}
        </div>
      )
    }

    return () => {
      return (
        <section class={className}>
          <div class={`${className}__content`}>
            <h2 class={`${className}__title`}>Серии комплектов</h2>
            {renderCarousel()}
          </div>
        </section>
      )
    }
  }
})
