// catalog-page.tsx — оркестратор
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CatalogFilterField, type CatalogFilterParams, type CatalogFilterSubmitPayload, type CatalogItem, Color } from '@/utils'
import { CatalogPagination } from '@/pages/catalog/ui/pagination'
import { Page, UiChip, UiSelect } from '@/ui'
import { useCatalogStore, useViewportStore } from '@/stores'
import Filter from '@/pages/catalog/ui/filter'
import ProductCatalogCard from '@/entities/product/ui/catalog-card'

const catalogItemsPerPage = 12
const mobileBreakpoint = 1024
const catalogDescription = 'Комплекты Savanini для гражданских автомобилей, трековых автомобилей и спортивного использования.'

enum SortField {
  popularity = 'popularity',
  priceAsc = 'priceAsc',
  priceDesc = 'priceDesc',
  discDiameter = 'discDiameter'
}

const sortOptions = [
  {
    label: 'По популярности',
    value: SortField.popularity
  },
  {
    label: 'Сначала дешевле',
    value: SortField.priceAsc
  },
  {
    label: 'Сначала дороже',
    value: SortField.priceDesc
  },
  {
    label: 'По диаметру диска',
    value: SortField.discDiameter
  }
]

const filterFieldLabels: Record<CatalogFilterField, string> = {
  [CatalogFilterField.mark]: 'Марка',
  [CatalogFilterField.model]: 'Модель',
  [CatalogFilterField.series]: 'Серия',
  [CatalogFilterField.wheelDiameter]: 'Диаметр колёс',
  [CatalogFilterField.diameter]: 'Диаметр диска'
}

const emptyFilterParams: CatalogFilterParams = {
  [CatalogFilterField.diameter]: '',
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

const sortItems = (items: CatalogItem[], sort: SortField): CatalogItem[] => {
  const sorted = [ ...items ]

  switch (sort) {
    case SortField.priceAsc:
      return sorted.sort((a, b) => a.priceUsd - b.priceUsd)
    case SortField.priceDesc:
      return sorted.sort((a, b) => b.priceUsd - a.priceUsd)
    case SortField.discDiameter:
      return sorted.sort((a, b) => a.discDiameter - b.discDiameter)
    default:
      return sorted
  }
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
    const sortField = ref<SortField>(SortField.popularity)
    const filterParams = ref<CatalogFilterParams>({ ...emptyFilterParams })

    const isMobile = computed(() => viewportStore.size.width < mobileBreakpoint)
    const sourceItems = computed<CatalogItem[]>(() => catalogStore.items)

    const resultTitle = computed(() => {
      const result = [ 'Тормозные системы' ]
      const subtitle = [ filterParams.value.mark, filterParams.value.model ].filter(Boolean).join(' / ')

      if (subtitle) {
        result.push(subtitle)
      }

      return result.join(' — ')
    })

    const routeFilterParams = computed<CatalogFilterParams>(() => {
      return {
        [CatalogFilterField.diameter]: getRouteQueryValue(route.query, CatalogFilterField.diameter),
        [CatalogFilterField.mark]: getRouteQueryValue(route.query, CatalogFilterField.mark),
        [CatalogFilterField.model]: getRouteQueryValue(route.query, CatalogFilterField.model),
        [CatalogFilterField.series]: getRouteQueryValue(route.query, CatalogFilterField.series),
        [CatalogFilterField.wheelDiameter]: getRouteQueryValue(route.query, CatalogFilterField.wheelDiameter)
      }
    })

    const sortedItems = computed(() => sortItems(filteredItems.value, sortField.value))

    const paginatedItems = computed<CatalogItem[]>(() => {
      const start = (currentPage.value - 1) * catalogItemsPerPage

      return sortedItems.value.slice(start, start + catalogItemsPerPage)
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

    const resetAllChips = (): void => {
      handleFilterPayload({
        items: [],
        params: { ...emptyFilterParams }
      })
    }

    // isMobile здесь решает только РАЗМЕЩЕНИЕ (сайдбар vs строка тулбара),
    // не то, как Filter должен выглядеть — это его собственная забота
    const renderSidebar = () => {
      if (isMobile.value) {
        return null
      }

      return (
        <aside class="catalog__sidebar">
          <Filter
            initialParams={routeFilterParams.value}
            items={sourceItems.value}
            onChange={handleFilterPayload}
            onSubmit={handleFilterPayload}
          />
        </aside>
      )
    }

    const renderSort = () => {
      return (
        <UiSelect
          class="catalog__sort"
          ariaLabel="Сортировка"
          modelValue={sortField.value}
          options={sortOptions}
          onUpdate:modelValue={(value: SortField) => sortField.value = value}
        />
      )
    }

    const renderMobileToolbar = () => {
      if (!isMobile.value) {
        return null
      }

      return (
        <div class="catalog__mobile-toolbar">
          <Filter
            initialParams={routeFilterParams.value}
            items={sourceItems.value}
            onChange={handleFilterPayload}
            onSubmit={handleFilterPayload}
          />
          {renderSort()}
        </div>
      )
    }

    const renderChips = () => {
      if (activeFilterChips.value.length === 0) {
        return null
      }

      return (
        <div class="catalog__chips">
          {activeFilterChips.value.map(chip =>
            <button class="catalog__chip" key={chip.field} onClick={() => removeChip(chip.field)}>
              {chip.label}: {chip.value}
              <span class="catalog__chip-remove">×</span>
            </button>)}
          <button class="catalog__chip catalog__chip--reset" onClick={resetAllChips}>
            Сбросить всё
          </button>
        </div>
      )
    }

    const renderGridHeader = () => {
      return (
        <div class="catalog__header">
          <h1 class="sr-only">{resultTitle.value}</h1>

          <p class="catalog__description">{catalogDescription}</p>

          {!isMobile.value &&
            <div class="catalog__toolbar">
              <UiChip label={`${filteredItems.value.length} товаров`} color={Color.muted} />
              {renderSort()}
            </div>
          }

          {renderMobileToolbar()}

          <div class="catalog__chips-row">
            {renderChips()}
          </div>
        </div>
      )
    }

    const renderProductCard = (item: CatalogItem) => <ProductCatalogCard value={item} key={item.id} />

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

    const renderPagination = () =>
      <CatalogPagination
        page={currentPage.value}
        total={filteredItems.value.length}
        perPage={catalogItemsPerPage}
        onChange={handlePageChange}
      />

    const renderContent = () => {
      return (
        <section class="catalog__content">
          {renderGridHeader()}
          {renderProducts()}
          {renderPagination()}
        </section>
      )
    }

    return () =>
      <Page class="catalog">
        <section class="isk-page__section isk-page__section--contained catalog__section--main">
          <div class="catalog__layout">
            {renderSidebar()}
            {renderContent()}
          </div>
        </section>
      </Page>
  }
})
