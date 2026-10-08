import { useRoute } from 'vue-router'
import { computed, defineComponent, ref, watch } from 'vue'

import { useCatalogStore } from '@/stores'

import {
  CatalogCategories,
  CatalogFilterField,
  CatalogItem,
  FeedbackTypes,
  PaletteSelection,
  RotorCenterSelection,
  formatWheelDiameter,
  paletteGroupPrices
} from '@/utils'
import { Page, UiButton } from '@/components'
import { Feedback } from '@/features'
import {
  Breadcrumbs,
  ProductCompatibility,
  ProductGallery,
  ProductHero,
  ProductKit,
  ProductPalette,
  ProductPurchase,
  ProductRelated,
  ProductRotorCenter,
  ProductSpecs,
  PurchaseOption
} from '@/entities/product'

export default defineComponent({
  name: 'ProductPage',

  setup() {
    const route = useRoute()

    const catalogStore = useCatalogStore()
    const showFeedback = ref(false)
    const selectedPalette = ref<PaletteSelection | undefined>()
    const selectedRotor = ref<RotorCenterSelection | undefined>()
    const pageState = ref<'loading' | 'error' | 'not-found' | 'ready'>('loading')
    let loadRequestId = 0

    const filterLabels: Record<CatalogFilterField, string> = {
      [CatalogFilterField.mark]: 'Марка',
      [CatalogFilterField.model]: 'Модель',
      [CatalogFilterField.series]: 'Серия',
      [CatalogFilterField.wheelDiameter]: 'Диаметр колёс'
    }

    const getRouteParam = (value: string | string[] | undefined): string => {
      return Array.isArray(value) ? value[0] ?? '' : value ?? ''
    }

    const getQueryValue = (field: CatalogFilterField): string => {
      const value = route.query[field]

      return String(Array.isArray(value) ? value[0] ?? '' : value ?? '').trim()
    }

    const routeId = computed(() => {
      const id = getRouteParam(route.params.id)

      if (!/^\d+$/.test(id)) {
        return undefined
      }

      const parsedId = Number(id)

      return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : undefined
    })

    const currentItem = computed<CatalogItem | undefined>(() => {
      if (routeId.value === undefined) {
        return undefined
      }

      const item = catalogStore.getById(routeId.value)

      return item ?? undefined
    })

    const feedbackFilter = computed<Record<CatalogFilterField, string>>(() => ({
      [CatalogFilterField.mark]: getQueryValue(CatalogFilterField.mark),
      [CatalogFilterField.model]: getQueryValue(CatalogFilterField.model),
      [CatalogFilterField.series]: getQueryValue(CatalogFilterField.series),
      [CatalogFilterField.wheelDiameter]: getQueryValue(CatalogFilterField.wheelDiameter)
    }))

    const relatedItems = computed<CatalogItem[]>(() => {
      if (!currentItem.value) {
        return []
      }

      return catalogStore.getRelatedItems(currentItem.value)
    })

    const filterValues = computed(() => {
      const result: string[] = []

      for (const field of Object.values(CatalogFilterField)) {
        const value = getQueryValue(field)
        switch (field) {
          case CatalogFilterField.wheelDiameter: {
            if (value) {
              result.push(`${filterLabels[field]}: ${formatWheelDiameter(value)}`)
            }
            break
          }
          default: {
            if (value) {
              result.push(`${filterLabels[field]}: ${value}`)
            }
            break
          }
        }
      }

      return result
    })

    const orderTopic = computed<string>(() => {
      const item = currentItem.value

      if (!item) {
        return ''
      }

      return [ item.model, ...filterValues.value ].join('; ')
    })

    const purchaseOptions = computed<PurchaseOption[]>(() => {
      const result = []
      const palette = selectedPalette.value
      const rotor = selectedRotor.value?.item

      if (palette) {
        result.push({
          id: 'palette',
          label: `цвет суппорта: ${palette.item.title}`,
          price: paletteGroupPrices[palette.group]
        })
      }
      if (rotor) {
        result.push({
          id: 'rotor',
          label: `цвет ротора: ${rotor.title}`,
          price: rotor.price
        })
      }

      return result
    })

    const removeOptionsHandler = (option: string): void => {
      if (option === 'palette') {
        selectedPalette.value = undefined
      }
      if (option === 'rotor') {
        selectedRotor.value = undefined
      }
    }

    async function loadProductPage(): Promise<void> {
      const requestId = ++loadRequestId
      const category = getRouteParam(route.params.category)

      showFeedback.value = false
      selectedPalette.value = undefined
      selectedRotor.value = undefined

      if (category !== 'kits' || routeId.value === undefined) {
        pageState.value = 'not-found'

        return
      }

      pageState.value = 'loading'

      try {
        await Promise.all([
          catalogStore.load(),
          catalogStore.loadCompatibility()
        ])

        if (requestId !== loadRequestId) {
          return
        }

        pageState.value = currentItem.value ? 'ready' : 'not-found'
      } catch (error) {
        if (requestId !== loadRequestId) {
          return
        }

        console.error(error)
        pageState.value = 'error'
      }
    }

    watch(
      () => [ route.params.category, route.params.id ],
      () => {
        void loadProductPage()
      },
      { immediate: true }
    )

    const renderEmptyState = () => {
      if (pageState.value === 'loading') {
        return <div class="product-page__empty">Загрузка товара...</div>
      }

      if (pageState.value === 'error') {
        return (
          <div class="product-page__empty">
            <p>Не удалось загрузить товар. Проверьте соединение и попробуйте ещё раз.</p>
            <UiButton
              label="Повторить"
              onClick={() => void loadProductPage()}
            />
          </div>
        )
      }

      return (
        <div class="product-page__empty">
          Товар не найден
        </div>
      )
    }

    const renderGallery = (item: CatalogItem) => {
      return <ProductGallery value={item.series} />
    }
    const renderHero = (item: CatalogItem) => {
      return <ProductHero item={item} />
    }
    const renderPurchase = (item: CatalogItem) => {
      return (
        <ProductPurchase
          item={item}
          options={purchaseOptions.value}
          onOrder={() => showFeedback.value = true}
          onRemove={removeOptionsHandler}
        />
      )
    }

    const renderPaletteSection = () => {
      return <ProductPalette onSelect={(selection: PaletteSelection) => selectedPalette.value = selection} />
    }

    const renderRotorCenterSection = () => {
      return <ProductRotorCenter onSelect={(selection: RotorCenterSelection) => selectedRotor.value = selection} />
    }

    const renderHeroProductSection = (item: CatalogItem) => {
      return (
        <section class="isk-page__section isk-page__section--contained">
          <div class="product-page__hero-product">
            <div class="product-page__hero-main">
              <Breadcrumbs item={item} />
              <div class="product-page__header">
                {renderGallery(item)}
                {renderHero(item)}
              </div>
              {renderPaletteSection()}
              {renderRotorCenterSection()}
              <ProductSpecs value={item} />
              <ProductKit item={item} />
              <ProductCompatibility
                value={item.id}
                productName={item.model}
              />
            </div>
            {renderPurchase(item)}
          </div>
        </section>
      )
    }

    const renderRelated = () => {
      if (relatedItems.value.length === 0) {
        return null
      }

      return (
        <ProductRelated
          item={currentItem.value}
          items={relatedItems.value}
        />
      )
    }
    const renderCatalog = () => {
      return (
        <section class="isk-page__section isk-page__section--contained product-page__section--catalog">
          {renderRelated()}
        </section>
      )
    }

    const renderFeedback = () => {
      return (
        <Feedback
          v-model={showFeedback.value}
          type={FeedbackTypes.order}
          filter={feedbackFilter.value}
          id={routeId.value}
          category={CatalogCategories.kit}
          topic={orderTopic.value}
        />
      )
    }

    return () => {
      if (pageState.value !== 'ready' || !currentItem.value) {
        return renderEmptyState()
      }

      return (
        <Page class="product-page">
          {renderHeroProductSection(currentItem.value)}
          {renderCatalog()}
          {renderFeedback()}
        </Page>
      )
    }
  }
})
