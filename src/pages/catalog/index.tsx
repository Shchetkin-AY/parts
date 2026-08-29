import { useRoute, useRouter } from 'vue-router'
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue'
import { CatalogFilterField, CatalogFilterParams, CatalogFilterSubmitPayload, CatalogItem, Color, Size, pluralize } from '@/utils'
import { CatalogSortField, useCatalogStore, useViewportStore } from '@/stores'
import { Page, UiChip, UiDivider, UiSelect } from '@/ui'
import { Pagination } from '@/pages/catalog/ui/pagination'
import ProductCatalogCard from '@/entities/product/ui/catalog-card'
import Filter from '@/pages/catalog/ui/filter'

const catalogItemsPerPage = 12
const mobileBreakpoint = 1024

const sortOptions = [
  {
    label: 'По популярности',
    value: CatalogSortField.popularity
  },
  {
    label: 'Сначала дешевле',
    value: CatalogSortField.priceAsc
  },
  {
    label: 'Сначала дороже',
    value: CatalogSortField.priceDesc
  },
  {
    label: 'По диаметру диска',
    value: CatalogSortField.discDiameter
  }
]

const filterFieldLabels: Record<CatalogFilterField, string> = {
  [CatalogFilterField.mark]: 'Марка',
  [CatalogFilterField.model]: 'Модель',
  [CatalogFilterField.series]: 'Серия',
  [CatalogFilterField.wheelDiameter]: 'Диаметр колёс'
}

const emptyFilterParams: CatalogFilterParams = {
  [CatalogFilterField.mark]: '',
  [CatalogFilterField.model]: '',
  [CatalogFilterField.series]: '',
  [CatalogFilterField.wheelDiameter]: ''
}

const getRouteQueryValue = (routeQuery: Record<string, unknown>, field: CatalogFilterField): string => {
  const value = routeQuery[field]

  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  if (typeof value === 'string') {
    return value.trim()
  }

  return ''
}

export default defineComponent({
  name: 'CatalogPage',

  setup() {
    const route = useRoute()
    const router = useRouter()
    const catalogStore = useCatalogStore()
    const viewportStore = useViewportStore()

    const filteredItems = ref<CatalogItem[]>([])
    const currentPage = ref(1)
    const sortField = ref<CatalogSortField>(CatalogSortField.popularity)
    const filterParams = ref<CatalogFilterParams>({ ...emptyFilterParams })

    // --- вьюпорт ---
    const isMobile = computed(() => viewportStore.size.width < mobileBreakpoint)

    // --- источник данных ---
    const sourceItems = computed<CatalogItem[]>(() => catalogStore.items)

    // --- фильтр: route <-> params ---
    const routeFilterParams = computed<CatalogFilterParams>(() => {
      return {
        [CatalogFilterField.mark]: getRouteQueryValue(route.query, CatalogFilterField.mark),
        [CatalogFilterField.model]: getRouteQueryValue(route.query, CatalogFilterField.model),
        [CatalogFilterField.series]: getRouteQueryValue(route.query, CatalogFilterField.series),
        [CatalogFilterField.wheelDiameter]: getRouteQueryValue(route.query, CatalogFilterField.wheelDiameter)
      }
    })

    const activeFilterChips = computed(() => {
      return Object.entries(filterParams.value)
        .filter(([ , value ]) => Boolean(value))
        .map(([ field, value ]) => ({
          field: field as CatalogFilterField,
          label: filterFieldLabels[field as CatalogFilterField],
          value
        }))
    })

    // --- сортировка и пагинация ---
    const sortedItems = computed(() => catalogStore.sortItems(filteredItems.value, sortField.value))

    const paginatedItems = computed<CatalogItem[]>(() => {
      const start = (currentPage.value - 1) * catalogItemsPerPage

      return sortedItems.value.slice(start, start + catalogItemsPerPage)
    })

    const itemsCountLabel = computed<string>(() => {
      return [
        filteredItems.value.length,
        pluralize(filteredItems.value.length, 'товар', 'товара', 'товаров')
      ].join(' ')
    })

    // --- методы ---
    const applyFilterParams = (params: CatalogFilterParams): void => {
      filterParams.value = params
      filteredItems.value = [ ...catalogStore.filterItems(filterParams.value, sourceItems.value) ]
      currentPage.value = 1
    }

    const syncRouteFromFilterParams = (params: CatalogFilterParams): void => {
      const query = Object.entries(params).reduce<Record<string, string>>((result, [ field, value ]) => {
        if (value) {
          result[field] = value
        }

        return result
      }, {})

      const currentQuery = Object.entries(route.query).reduce<Record<string, string>>((result, [ field, value ]) => {
        if (Array.isArray(value)) {
          result[field] = value[0] ?? ''
        } else if (typeof value === 'string') {
          result[field] = value
        }

        return result
      }, {})

      const hasSameQuery = Object.keys(query).length === Object.keys(currentQuery).length
        && Object.entries(query).every(([ field, value ]) => currentQuery[field] === value)

      if (hasSameQuery) {
        return
      }

      void router.replace({
        name: 'catalog',
        query
      })
    }

    watch(
      () => sourceItems.value,
      items => {
        filteredItems.value = [ ...catalogStore.filterItems(filterParams.value, items) ]
      },
      { immediate: true }
    )
    watch(
      () => routeFilterParams.value,
      params => applyFilterParams(params),
      {
        immediate: true,
        deep: true
      }
    )
    watch(
      () => filteredItems.value.length,
      () => {
        currentPage.value = 1
      }
    )

    onBeforeMount(() => {
      catalogStore.load()
    })

    const handleFilterPayload = (payload: CatalogFilterSubmitPayload<CatalogItem>): void => {
      applyFilterParams(payload.params)
      syncRouteFromFilterParams(payload.params)
    }

    const handlePageChange = (page: number): void => {
      currentPage.value = page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const removeChip = (field: CatalogFilterField): void => {
      handleFilterPayload({
        items: [],
        params: {
          ...filterParams.value,
          [field]: ''
        }
      })
    }

    // ============ RENDER: дерево функций строго по порядку вывода ============

    // --- сайдбар (десктоп) / фильтр переиспользуется и в mobile toolbar ---
    const renderFilter = () => {
      return (
        <Filter
          initialParams={routeFilterParams.value}
          items={sourceItems.value}
          onSubmit={handleFilterPayload}
        />
      )
    }

    const renderSidebar = () => {
      if (!isMobile.value) {
        return (
          <aside class="catalog__sidebar">
            {renderFilter()}
          </aside>
        )
      }
    }

    // --- заголовок ---
    const renderHeaderTitle = () => {
      return (
        <div class="catalog__header-title">
          {'Тормозные комплекты SAVANINI'}
        </div>
      )
    }

    // --- тулбар: счётчик + сортировка (+ фильтр-триггер на мобильном) ---
    const renderFilteredItemsCount = () => {
      return <div class="catalog__toolbar-count">{itemsCountLabel.value}</div>
    }

    const renderSort = () => {
      return (
        <UiSelect
          v-model={sortField.value}
          ariaLabel="Сортировка"
          size={Size.small}
          options={sortOptions}
        />
      )
    }

    const renderToolbar = () => {
      return (
        <div class="catalog__toolbar">
          {renderFilteredItemsCount()}
          {renderSort()}
        </div>
      )
    }

    // --- чипы активных фильтров ---
    const renderChips = () => {
      if (isMobile.value) {
        return renderFilter()
      }

      if (activeFilterChips.value.length === 0) {
        return null
      }

      return (
        <div class="catalog__chips">
          {
            activeFilterChips.value.map(chip =>
              <UiChip
                label={`${chip.label}: ${chip.value}`}
                size={Size.large}
                color={Color.muted}
                remove
                onRemove={() => removeChip(chip.field)}
              />)
          }
        </div>
      )
    }

    const renderChipsRow = () => {
      return <div class="catalog__chips-row">{renderChips()}</div>
    }

    const renderHeaderActions = () => {
      return (
        <div class="catalog__header-actions">
          {renderChipsRow()}
          {renderToolbar()}
        </div>
      )
    }

    const renderHeader = () => {
      return (
        <div class="catalog__header">
          {renderHeaderTitle()}
          <UiDivider />
          {renderHeaderActions()}
        </div>
      )
    }

    // --- сетка товаров ---
    const renderProductCard = (item: CatalogItem) => {
      return <ProductCatalogCard value={item} key={item.id} />
    }

    const renderEmptyState = () => {
      const message = catalogStore.isLoading ? 'Загрузка каталога...' : 'По текущим параметрам ничего не найдено.'

      return <div class="catalog__empty">{message}</div>
    }

    const renderProducts = () => {
      if (filteredItems.value.length === 0) {
        return renderEmptyState()
      }

      return (
        <div class="catalog__grid">
          {paginatedItems.value.map(renderProductCard)}
        </div>
      )
    }

    const renderPagination = () => {
      return (
        <Pagination
          page={currentPage.value}
          total={filteredItems.value.length}
          perPage={catalogItemsPerPage}
          onChange={handlePageChange}
        />
      )
    }

    const renderContent = () => {
      return (
        <section class="catalog__content">
          {renderHeader()}
          {renderProducts()}
          {renderPagination()}
        </section>
      )
    }

    const renderLayout = () => {
      return (
        <div class="catalog__layout">
          {renderSidebar()}
          {renderContent()}
        </div>
      )
    }

    return () =>
      <Page class="catalog">
        <section class="isk-page__section isk-page__section--contained catalog__section--main">
          {renderLayout()}
        </section>
      </Page>
  }
})
