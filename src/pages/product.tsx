import { useRoute } from 'vue-router'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'

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
import { Page } from '@/ui'
import Feedback from '@/features/feedback'
import { Breadcrumbs, ProductGallery, ProductHero, ProductRelated, Purchase, PurchaseOption } from '@/entities/product'
import Palette from '@/entities/product/ui/palette'
import RotorCenter from '@/entities/product/ui/rotor'
import Specs from '@/entities/product/ui/specs'
import Compatibility from '@/entities/product/ui/compatibility'

export default defineComponent({
  name: 'ProductPage',

  setup() {
    const route = useRoute()

    const catalogStore = useCatalogStore()
    const showFeedback = ref(false)
    const selectedPalette = ref<PaletteSelection | undefined>()
    const selectedRotor = ref<RotorCenterSelection | undefined>()

    const filterLabels: Record<CatalogFilterField, string> = {
      [CatalogFilterField.mark]: 'Марка',
      [CatalogFilterField.model]: 'Модель',
      [CatalogFilterField.series]: 'Серия',
      [CatalogFilterField.wheelDiameter]: 'Диаметр колёс'
    }

    const routeId = computed(() => {
      const rawId = route.params.id
      const value = Array.isArray(rawId) ? rawId[0] : rawId

      return Number(value)
    })

    const currentItem = computed<CatalogItem | undefined>(() => {
      const item = catalogStore.getById(routeId.value)

      return item ?? undefined
    })

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

    const getQueryValue = (field: CatalogFilterField): string => {
      const value = route.query[field]

      return String(Array.isArray(value) ? value[0] ?? '' : value ?? '').trim()
    }

    const removeOptionsHandler = (option: string): void => {
      if (option === 'palette') {
        selectedPalette.value = undefined
      }
      if (option === 'rotor') {
        selectedRotor.value = undefined
      }
    }

    onBeforeMount(() => {
      catalogStore.load()
      catalogStore.loadCompatibility()
    })

    const renderEmptyState = () => {
      const message = catalogStore.isLoading ? 'Загрузка товара...' : 'Товар не найден'

      return (
        <div class="product-page__empty">
          {message}
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
        <Purchase
          item={item}
          options={purchaseOptions.value}
          onOrder={() => showFeedback.value = true}
          onRemove={removeOptionsHandler}
        />
      )
    }

    const renderPaletteSection = () => {
      return <Palette onSelect={(selection: PaletteSelection) => selectedPalette.value = selection} />
    }

    const renderRotorCenterSection = () => {
      return <RotorCenter onSelect={(selection: RotorCenterSelection) => selectedRotor.value = selection} />
    }

    const renderSpecs = () => {
      if (!currentItem.value) {
        return null
      }

      return <Specs value={currentItem.value} />
    }

    const renderCompatibility = () => {
      const item = currentItem.value
      if (!item) {
        return null
      }

      return (
        <Compatibility
          value={item.id}
          productName={item.model}
        />
      )
    }

    const renderHeroProductSection = () => {
      const item = currentItem.value

      if (!item) {
        return null
      }

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
              {renderSpecs()}
              {renderCompatibility()}
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
          filter={route.query as Record<CatalogFilterField, string>}
          id={routeId.value}
          category={CatalogCategories.kit}
          topic={orderTopic.value}
        />
      )
    }

    return () => {
      if (!currentItem.value) {
        return renderEmptyState()
      }

      return (
        <Page class="product-page">
          {renderHeroProductSection()}
          {renderCatalog()}
          {renderFeedback()}
        </Page>
      )
    }
  }
})
