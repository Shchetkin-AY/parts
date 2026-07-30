import { PropType, computed, defineComponent } from 'vue'

import { UiButton } from '@/ui'
import { ButtonMode, Color, Size } from '@/utils'

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
            <UiButton
              label="..."
              size={Size.small}
              mode={ButtonMode.outline}
            />
          </span>
        )
      }

      const isActive = item === currentPage.value

      return (
        <UiButton
          label={item}
          size={Size.small}
          color={isActive ? Color.primary : undefined}
          mode={isActive ? ButtonMode.flat : ButtonMode.outline}
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
          <UiButton
            label="<"
            size={Size.small}
            color={Color.muted}
            mode={ButtonMode.outline}

            disabled={currentPage.value === 1}
            onClick={() => setPage(currentPage.value - 1)}
          />

          <div class="catalog-pagination__pages">
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
