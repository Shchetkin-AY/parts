import { PropType, computed, defineComponent } from 'vue'

import { GButton } from '@/components/g'
import { ButtonModes, Colors, Sizes } from '@/utils'

type PageItem = number | 'ellipsis'

const paginationRange = (currentPage: number, totalPages: number): PageItem[] => {
  const siblingCount = 1
  const boundaryCount = 1
  const visibleSlots = boundaryCount * 2 + siblingCount * 2 + 3

  if (totalPages <= visibleSlots) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const startSibling = Math.max(currentPage - siblingCount, boundaryCount + 2)
  const endSibling = Math.min(currentPage + siblingCount, totalPages - boundaryCount - 1)
  const items: PageItem[] = [ 1 ]

  if (startSibling > boundaryCount + 2) {
    items.push('ellipsis')
  } else {
    for (let page = 2; page < startSibling; page += 1) {
      items.push(page)
    }
  }

  for (let page = startSibling; page <= endSibling; page += 1) {
    items.push(page)
  }

  if (endSibling < totalPages - boundaryCount - 1) {
    items.push('ellipsis')
  } else {
    for (let page = endSibling + 1; page < totalPages; page += 1) {
      items.push(page)
    }
  }

  items.push(totalPages)

  return items
}

export const CatalogPagination = defineComponent({
  name: 'CatalogPagination',

  props: {
    page: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      default: 12
    },
    onChange: {
      type: Function as PropType<(page: number) => void>,
      default: undefined
    }
  },

  setup(props) {
    const totalPages = computed<number>(() => Math.ceil(props.total / props.perPage))
    const currentPage = computed<number>(() => {
      return Math.min(Math.max(props.page, 1), totalPages.value)
    })
    const pages = computed<PageItem[]>(() => {
      return paginationRange(currentPage.value, totalPages.value)
    })

    const setPage = (page: number): void => {
      if (page !== currentPage.value) {
        props.onChange?.(page)
      }
    }
    const renderPageItem = (item: PageItem, index: number) => {
      if (item === 'ellipsis') {
        return (
          <span class="catalog-pagination__item catalog-pagination__item--ellipsis" key={`ellipsis-${index}`}>
            <GButton
              label="..."
              size={Sizes.small}
              mode={ButtonModes.outline}
            />
          </span>
        )
      }

      const isActive = item === currentPage.value

      return (
        <GButton
          label={item}
          size={Sizes.small}
          color={isActive ? Colors.primary : undefined}
          mode={isActive ? ButtonModes.flat : ButtonModes.outline}
          key={item}
          onClick={() => setPage(item)}
        />
      )
    }

    return () => {
      if (totalPages.value <= 1) {
        return null
      }

      return (
        <nav class="catalog-pagination" aria-label="Пагинация каталога">
          <GButton
            label="<"
            size={Sizes.small}
            color={Colors.muted}
            mode={ButtonModes.outline}

            disabled={currentPage.value === 1}
            onClick={() => setPage(currentPage.value - 1)}
          />

          <div class="catalog-pagination__pages">
            {pages.value.map(renderPageItem)}
          </div>

          <GButton
            label=">"
            size={Sizes.small}
            disabled={currentPage.value === totalPages.value}
            color={Colors.primary}
            onClick={() => setPage(currentPage.value + 1)}
          />
        </nav>
      )
    }
  }
})
