import { RouterLink } from 'vue-router'
import {
  PropType,
  computed,
  defineComponent,
  nextTick,
  watch
} from 'vue'

import { useHorizontalCarousel } from '@/composables'
import { CatalogItem } from '@/utils'

interface KitItem {
  id: string
  name: string
  description: string
  qty: string
  image: string
  hash: string
}

const buildKitItems = (item: CatalogItem | null): KitItem[] => {
  const series = item?.series?.toLowerCase() ?? ''
  const pistons = item?.pistonCount ?? 0
  const construction = item?.constructionType?.toLowerCase() ?? ''
  const coating = item?.coating?.toLowerCase() ?? ''

  const caliperParts = [
    `${pistons}-поршневые`,
    construction,
    coating
  ].filter(Boolean)

  return [
    {
      id: 'calipers',
      name: 'Суппорты',
      description: caliperParts.join(', '),
      qty: '2 шт',
      image: series ? `/images/products/${series}/1.webp` : '',
      hash: 'ccb'
    },
    {
      id: 'discs',
      name: 'Тормозные диски',
      description: 'Чугун или карбон-керамика, диаметр 282–400 мм',
      qty: '2 шт',
      image: '/images/accessories/disk.webp',
      hash: 'discs'
    },
    {
      id: 'pads',
      name: 'Колодки',
      description: 'Четыре состава F600–F1200. Штатный F600',
      qty: 'Комплект на ось',
      image: '/images/accessories/pads.webp',
      hash: 'pads'
    },
    {
      id: 'hoses',
      name: 'Магистрали',
      description: 'Тефлон, стальная оплётка. Подбор длины и фитингов',
      qty: 'Комплект на ось',
      image: '/images/accessories/hoses.webp',
      hash: 'lines'
    },
    {
      id: 'hardware',
      name: 'Крепёж',
      description: 'Болты, кронштейны, фиксаторы — под вашу конфигурацию',
      qty: 'Комплект на ось',
      image: '/images/accessories/adapters.webp',
      hash: 'discs'
    }
  ]
}

export default defineComponent({
  name: 'ProductKit',

  props: {
    item: {
      type: Object as PropType<CatalogItem | null>,
      default: null
    }
  },

  setup(props) {
    const className = 'product-kit'

    const items = computed<KitItem[]>(() => {
      return buildKitItems(props.item)
    })

    // ── Carousel ────────────────────────────────────────

    const {
      viewportRef,
      canScrollPrev,
      canScrollNext,
      updateScrollState,
      scrollPrev,
      scrollNext
    } = useHorizontalCarousel()

    watch(items, () => {
      void nextTick(updateScrollState)
    })

    // ── Header ──────────────────────────────────────────

    const renderHeader = () => {
      return (
        <header class={`${className}__header`}>
          <h2 class={`${className}__header-title`}>Состав комплекта</h2>
        </header>
      )
    }

    // ── Card ────────────────────────────────────────────

    const renderCardMedia = (kitItem: KitItem) => {
      return (
        <img
          class={`${className}__image`}
          src={kitItem.image}
          alt={kitItem.name}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )
    }

    const renderCard = (kitItem: KitItem) => {
      return (
        <RouterLink
          class={`${className}__card`}
          to={{
            path: '/accessories',
            hash: `#${kitItem.hash}`
          }}
          key={kitItem.id}
        >
          <div class={`${className}__media`}>
            {renderCardMedia(kitItem)}
          </div>
          <div class={`${className}__body`}>
            <div class={`${className}__name`}>{kitItem.name}</div>
            <div class={`${className}__desc`}>{kitItem.description}</div>
            <div class={`${className}__qty`}>{kitItem.qty}</div>
          </div>
        </RouterLink>
      )
    }

    // ── Arrows ──────────────────────────────────────────

    const renderArrow = (
      direction: 'prev' | 'next',
      handler: () => void,
      hidden: boolean
    ) => {
      const points = direction === 'prev'
        ? '15 18 9 12 15 6'
        : '9 18 15 12 9 6'

      return (
        <button
          class={{
            [`${className}__arrow`]: true,
            [`${className}__arrow--${direction}`]: true,
            [`${className}__arrow--hidden`]: hidden
          }}
          type="button"
          aria-label={direction === 'prev' ? 'Прокрутить назад' : 'Прокрутить вперёд'}
          disabled={hidden}
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
          >
            <polyline points={points} />
          </svg>
        </button>
      )
    }

    // ── Carousel / root ─────────────────────────────────

    const renderCarousel = () => {
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
            {items.value.map(renderCard)}
          </div>
          {renderArrow('prev', scrollPrev, !canScrollPrev.value)}
          {renderArrow('next', scrollNext, !canScrollNext.value)}
        </div>
      )
    }

    const renderContent = () => {
      return (
        <div class={`${className}__content`}>
          {renderCarousel()}
        </div>
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
