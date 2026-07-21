import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CatalogFilterField, type CatalogFilterParams, type CatalogFilterSubmitPayload, type CatalogItem } from '@/utils'
import { CatalogPagination } from '@/components/catalog-pagination'
import { Page } from '@/components'
import Filter from '@/components/filter'
import ProductCard from '@/components/product-card'
import { useCatalogStore } from '@/stores/catalog'

const catalogItemsPerPage = 12
const emptyFilterParams: CatalogFilterParams = {
  [CatalogFilterField.diameter]: '',
  [CatalogFilterField.mark]: '',
  [CatalogFilterField.model]: '',
  [CatalogFilterField.series]: '',
  [CatalogFilterField.wheelDiameter]: ''
}

const normalizeFilterParams = (params: Partial<CatalogFilterParams> = {}): CatalogFilterParams => {
  return {
    [CatalogFilterField.diameter]: params[CatalogFilterField.diameter] ?? '',
    [CatalogFilterField.mark]: params[CatalogFilterField.mark] ?? '',
    [CatalogFilterField.model]: params[CatalogFilterField.model] ?? '',
    [CatalogFilterField.series]: params[CatalogFilterField.series] ?? '',
    [CatalogFilterField.wheelDiameter]: params[CatalogFilterField.wheelDiameter] ?? ''
  }
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
    const filterVersion = ref(0)
    const filteredItems = ref<CatalogItem[]>([])
    const currentPage = ref(1)
    const filterParams = ref<CatalogFilterParams>({
      ...emptyFilterParams
    })

    const sourceItems = computed<CatalogItem[]>(() => {
      return catalogStore.items
    })
    const resultTitle = computed(() => {
      const result = [ 'Тормозные системы' ]
      const subtitle = [ filterParams.value.mark, filterParams.value.model ].filter(Boolean).join(' / ')

      if (subtitle) {
        result.push(subtitle)
      }

      return result.join('  ')
    })
    const routeFilterParams = computed<CatalogFilterParams>(() => {
      return normalizeFilterParams({
        [CatalogFilterField.diameter]: getRouteQueryValue(route.query, CatalogFilterField.diameter),
        [CatalogFilterField.mark]: getRouteQueryValue(route.query, CatalogFilterField.mark),
        [CatalogFilterField.model]: getRouteQueryValue(route.query, CatalogFilterField.model),
        [CatalogFilterField.series]: getRouteQueryValue(route.query, CatalogFilterField.series),
        [CatalogFilterField.wheelDiameter]: getRouteQueryValue(route.query, CatalogFilterField.wheelDiameter)
      })
    })
    const paginatedItems = computed<CatalogItem[]>(() => {
      const start = (currentPage.value - 1) * catalogItemsPerPage

      return filteredItems.value.slice(start, start + catalogItemsPerPage)
    })

    const applyFilterParams = (params: CatalogFilterParams): void => {
      filterParams.value = normalizeFilterParams(params)
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
      params => {
        applyFilterParams(params)
      },
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
    }

    const renderFilter = () => {
      return (
        <aside class="catalog__sidebar">
          <Filter
            key={filterVersion.value}
            initialParams={routeFilterParams.value}
            items={sourceItems.value}
            orientation="vertical"
            onChange={handleFilterPayload}
            onSubmit={handleFilterPayload}
          />
        </aside>
      )
    }
    const renderGridHeader = () => {
      return (
        <div class="catalog__header">
          <div class="catalog__title-group">
            <h1 class="catalog__title">
              {resultTitle.value}
            </h1>

            <div class="catalog__description">
              Комплекты Savanini для гражданских автомобилей,
              трековых автомобилей и спортивного использования.
            </div>
          </div>

          <div class="catalog__meta">
            {filteredItems.value.length} товаров
          </div>
        </div>
      )
    }
    const renderProductCard = (item: CatalogItem) => {
      return (
        <ProductCard
          value={item}
          key={item.id}
        />
      )
    }
    const renderEmptyState = () => {
      const message = catalogStore.isLoading ? 'Загрузка каталога...' : 'По текущим параметрам ничего не найдено.'

      return (
        <div class="catalog__empty">
          {message}
        </div>
      )
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
        <CatalogPagination
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
          {renderGridHeader()}
          {renderProducts()}
          {renderPagination()}
        </section>
      )
    }

    return () => {
      return (
        <Page class="catalog">
          <section class="page__section page__section--contained catalog__section--main">
            <div class="catalog__layout">
              {renderFilter()}
              {renderContent()}
            </div>
          </section>
        </Page>
      )
    }
  }
})
