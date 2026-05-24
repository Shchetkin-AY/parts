import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import catalog, { type CatalogItem } from '@/data/catalog'
import { CatalogFilterField, type CatalogFilterParams, type CatalogFilterSubmitPayload } from '@/utils'
import { Button } from '@/components/main/button'
import { CatalogProductCard } from '@/components/product-card'
import Filter from '@/components/filter'

const placeholderImage = '/public/kit.png'

const normalize = (value: number | string): string => {
  return String(value).trim()
}

const emptyFilterParams: CatalogFilterParams = {
  [CatalogFilterField.diameter]: '',
  [CatalogFilterField.mark]: '',
  [CatalogFilterField.model]: '',
  [CatalogFilterField.wheelDiameter]: ''
}

export default defineComponent({
  name: 'CatalogPage',

  setup() {
    const route = useRoute()
    const router = useRouter()
    const filterVersion = ref(0)
    const filteredItems = ref<CatalogItem[]>([])
    const filterParams = ref<CatalogFilterParams>({
      ...emptyFilterParams
    })

    const sourceItems = computed<CatalogItem[]>(() => {
      return catalog.filter(item => {
        const hasVehicleBrand = Boolean(normalize(item.vehicleBrand))
        const hasVehicleModel = Boolean(normalize(item.vehicleModel))
        const hasDiscDiameter = Boolean(normalize(item.discDiameterMm))
        const hasDiameter = Boolean(normalize(item.wheelDiameterInch))

        return hasVehicleBrand && hasVehicleModel && hasDiscDiameter && hasDiameter
      })
    })
    const resultTitle = computed(() => {
      const result = [ 'Тормозные системы' ]
      result.push([ filterParams.value.mark, filterParams.value.model ].filter(Boolean).join(' / '))

      return result.join('  ')
    })
    const routeFilterParams = computed<CatalogFilterParams>(() => {
      const getRouteQueryValue = (field: CatalogFilterField): string => {
        const value = route.query[field]

        if (Array.isArray(value)) {
          return value[0] ?? ''
        }

        return value ? String(value).trim() : ''
      }

      return {
        [CatalogFilterField.diameter]: getRouteQueryValue(CatalogFilterField.diameter),
        [CatalogFilterField.mark]: getRouteQueryValue(CatalogFilterField.mark),
        [CatalogFilterField.model]: getRouteQueryValue(CatalogFilterField.model)
      }
    })

    watch(
      () => sourceItems.value,
      items => {
        filteredItems.value = [ ...items ]
      },
      { immediate: true }
    )

    const handleFilterPayload = (payload: CatalogFilterSubmitPayload<CatalogItem>): void => {
      filterParams.value = {
        ...payload.params
      }
      filteredItems.value = [ ...payload.items ]
    }
    const handleFilterReset = (): void => {
      filterVersion.value += 1
      filterParams.value = {
        ...emptyFilterParams
      }
      filteredItems.value = [ ...sourceItems.value ]
      router.push({ name: 'catalog' })
    }

    const renderFilter = () => {
      return (
        <aside class="catalog__sidebar">
          <div class="catalog__sidebar-header">
            <h2 class="catalog__sidebar-title">Фильтр по параметрам</h2>
          </div>

          <Filter
            key={filterVersion.value}
            initialParams={routeFilterParams.value}
            items={sourceItems.value}
            orientation="vertical"
            onChange={handleFilterPayload}
            onSubmit={handleFilterPayload}
          />

          <div class="catalog__sidebar-actions">
            <Button color="light" label="Сбросить фильтры" onClick={handleFilterReset} />
          </div>
        </aside>
      )
    }
    const renderGridHeader = () => {
      return (
        <div class="catalog__header">
          <div class="catalog__title-group">
            <p class="catalog__title">{resultTitle.value}</p>
          </div>

          <div class="catalog__meta">
            <span class="catalog__meta-label">Позиций: {filteredItems.value.length}</span>
          </div>
        </div>
      )
    }
    const renderCard = (item: CatalogItem) => {
      return (
        <CatalogProductCard
          value={item}
          image={placeholderImage}
          key={item.id}
        />
      )
    }
    const renderEmptyState = () => {
      return (
        <div class="catalog__empty">
          По текущим параметрам ничего не найдено.
        </div>
      )
    }
    const renderProducts = () => {
      if (filteredItems.value.length === 0) {
        return renderEmptyState()
      }

      return (
        <div class="catalog__grid">
          {filteredItems.value.map(renderCard)}
        </div>
      )
    }
    const renderContent = () => {
      return (
        <section class="catalog__content">
          {renderGridHeader()}
          {renderProducts()}
        </section>
      )
    }

    return () =>
      <div class="catalog">
        <div class="catalog__layout">
          {renderFilter()}
          {renderContent()}
        </div>
      </div>
  }
})
