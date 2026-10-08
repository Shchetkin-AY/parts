import { RouterLink } from 'vue-router'
import { computed, defineComponent, nextTick, onBeforeMount, watch } from 'vue'

import { useHorizontalCarousel } from '@/composables'
import { useCatalogStore } from '@/stores/catalog'
import { CatalogItem } from '@/utils'
import { ProductCard } from '@/entities/product'

export default defineComponent({
  name: 'Popular',

  setup() {
    const catalogStore = useCatalogStore()

    const className = 'popular'

    const {
      viewportRef,
      canScrollPrev,
      canScrollNext,
      updateScrollState,
      scrollPrev,
      scrollNext
    } = useHorizontalCarousel()

    onBeforeMount(() => {
      void catalogStore.load()
    })

    function pickRandom(items: CatalogItem[], count = 5): CatalogItem[] {
      if (!items.length) {
        return []
      }

      const shuffled = [ ...items ].sort(() => Math.random() - 0.5)

      return shuffled.slice(0, count)
    }

    const systems = computed(() => {
      const items = catalogStore.items.filter(item => item.price !== 0)

      return pickRandom(items, 8)
    })

    watch(systems, () => {
      void nextTick(updateScrollState)
    })

    const renderCatalogLink = () => {
      return (
        <RouterLink
          class={`${className}__header-link`}
          to={'/catalog'}
        >
          Смотреть все →
        </RouterLink>
      )
    }

    const renderTitle = () => {
      return (
        <div class={`${className}__header-title`}>Популярные комплекты</div>
      )
    }

    const renderHeader = () => {
      return (
        <div class={`${className}__header`}>
          {renderTitle()}
          {renderCatalogLink()}
        </div>
      )
    }

    const renderCards = () => {
      return systems.value.map(system => {
        return (
          <div class={`${className}__item`} key={system.id}>
            <ProductCard value={system} />
          </div>
        )
      })
    }

    const renderContent = () => {
      return (
        <div class={`${className}__carousel`}>
          <div
            class={{
              [`${className}__cards`]: true,
              [`${className}__cards--fade-left`]: canScrollPrev.value,
              [`${className}__cards--fade-right`]: canScrollNext.value
            }}
            ref={viewportRef}
            onScroll={updateScrollState}
          >
            {renderCards()}
          </div>
          {renderArrow('prev', scrollPrev, !canScrollPrev.value)}
          {renderArrow('next', scrollNext, !canScrollNext.value)}
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

    return () => {
      return (
        <section class={className}>
          {renderHeader()}
          {renderContent()}
        </section>
      )
    }
  }
})
