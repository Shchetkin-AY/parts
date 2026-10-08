import { PropType, computed, defineComponent } from 'vue'

import { UiButton } from '@/components'
import { Color, Size } from '@/utils'
import { useViewportStore } from '@/stores'

type PageItem = number | 'ellipsis'

interface PaginationRangeOptions {
  siblingCount?: number
  boundaryCount?: number
}

const paginationRange = (
  currentPage: number,
  totalPages: number,
  { siblingCount = 1, boundaryCount = 1 }: PaginationRangeOptions = {}
): PageItem[] => {
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

// Компактный "скользящий" вид: currentPage, currentPage+1, ..., totalPages
const minimalRange = (currentPage: number, totalPages: number): PageItem[] => {
  const windowStart = currentPage
  const windowEnd = Math.min(currentPage + 1, totalPages)

  const items: PageItem[] = windowStart === windowEnd
    ? [ windowStart ]
    : [ windowStart, windowEnd ]

  if (windowEnd === totalPages) {
    // последняя страница уже в окне — больше ничего не нужно
  } else if (windowEnd === totalPages - 1) {
    // последняя страница вплотную к окну — ellipsis не нужен
    items.push(totalPages)
  } else {
    items.push('ellipsis')
    items.push(totalPages)
  }

  return items
}

type ViewMode = 'full' | 'compact' | 'minimal'

export const Pagination = defineComponent({
  name: 'Pagination',

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
    const viewportStore = useViewportStore()

    const viewMode = computed<ViewMode>(() => {
      const width = viewportStore.size.width

      if (width < 380) {
        return 'minimal'
      }
      if (width < 600) {
        return 'compact'
      }

      return 'full'
    })

    const totalPages = computed<number>(() => Math.ceil(props.total / props.perPage))
    const currentPage = computed<number>(() => {
      return Math.min(Math.max(props.page, 1), totalPages.value)
    })

    const pages = computed<PageItem[]>(() => {
      switch (viewMode.value) {
        case 'minimal':
          return minimalRange(currentPage.value, totalPages.value)
        case 'compact':
          return paginationRange(currentPage.value, totalPages.value, {
            siblingCount: 0,
            boundaryCount: 1
          })
        default:
          return paginationRange(currentPage.value, totalPages.value, {
            siblingCount: 1,
            boundaryCount: 1
          })
      }
    })

    const setPage = (page: number): void => {
      if (page !== currentPage.value) {
        props.onChange?.(page)
      }
    }

    const renderPageItem = (item: PageItem, index: number) => {
      if (item === 'ellipsis') {
        return (
          <span key={`ellipsis-${index}`}>...</span>
        )
      }

      const isActive = item === currentPage.value

      return (
        <UiButton
          label={item}
          size={Size.small}
          color={isActive ? Color.primary : Color['surface-3']}
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
        <nav class="pagination" aria-label="Пагинация каталога">
          <UiButton
            label="<"
            size={Size.small}
            color={Color['surface-3']}
            disabled={currentPage.value === 1}
            onClick={() => setPage(currentPage.value - 1)}
          />

          <div class="pagination__pages">
            {pages.value.map(renderPageItem)}
          </div>

          <UiButton
            label=">"
            size={Size.small}
            disabled={currentPage.value === totalPages.value}
            color={Color.primary}
            onClick={() => setPage(currentPage.value + 1)}
          />
        </nav>
      )
    }
  }
})
