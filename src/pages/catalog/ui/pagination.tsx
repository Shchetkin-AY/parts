import { PropType, computed, defineComponent } from 'vue'

import { UiButton } from '@/ui'
import { ButtonMode, Color, Size } from '@/utils'
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

    const rangeOptions = computed<PaginationRangeOptions>(() => {
      const width = viewportStore.size.width

      if (width < 380) {
        return {
          siblingCount: 0,
          boundaryCount: 1
        }
      }
      if (width < 640) {
        return {
          siblingCount: 1,
          boundaryCount: 1
        }
      }

      return {
        siblingCount: 1,
        boundaryCount: 1
      }
    })

    const totalPages = computed<number>(() => Math.ceil(props.total / props.perPage))
    const currentPage = computed<number>(() => {
      return Math.min(Math.max(props.page, 1), totalPages.value)
    })
    const pages = computed<PageItem[]>(() => {
      return paginationRange(currentPage.value, totalPages.value, rangeOptions.value)
    })

    const setPage = (page: number): void => {
      if (page !== currentPage.value) {
        props.onChange?.(page)
      }
    }

    const renderPageItem = (item: PageItem, index: number) => {
      if (item === 'ellipsis') {
        return (
          <span class="pagination__item pagination__item--ellipsis" key={`ellipsis-${index}`}>
            ...
          </span>
        )
      }

      const isActive = item === currentPage.value

      return (
        <UiButton
          label={item}
          size={Size.small}
          color={isActive ? Color.primary : Color.muted}
          mode={isActive ? undefined : ButtonMode.outline}
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
            color={Color.muted}
            mode={ButtonMode.outline}
            disabled={currentPage.value === 1}
            onClick={() => setPage(currentPage.value - 1)}
          />

          <div class="pagination__pages">
            {pages.value.map(renderPageItem)}
          </div>

          <UiButton
            class="pagination__nav"
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
