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
import { Breadcrumbs, ProductDetails, ProductGallery, ProductHero, ProductRelated, Purchase, PurchaseOption } from '@/entities/product'
import { Accessories } from '@/entities/accessory'
import Palette from '@/entities/product/ui/palette'
import RotorCenter from '@/entities/product/ui/rotor'

export default defineComponent({
  name: 'ProductPage',

  setup() {
    const route = useRoute()

    const catalogStore = useCatalogStore()
    const showFeedback = ref(false)
    const selectedPalette = ref<PaletteSelection | undefined>()
    const selectedRotor = ref<RotorCenterSelection | undefined>()

    onBeforeMount(() => {
      catalogStore.load()
      catalogStore.loadCompatibility()
    })

    const routeId = computed(() => {
      const rawId = route.params.id
      const value = Array.isArray(rawId) ? rawId[0] : rawId

      return Number(value)
    })

    const currentItem = computed<CatalogItem | undefined>(() => {
      const item = catalogStore.getById(routeId.value)

      return item ?? undefined
    })

    const filterLabels: Record<CatalogFilterField, string> = {
      [CatalogFilterField.mark]: 'Марка',
      [CatalogFilterField.model]: 'Модель',
      [CatalogFilterField.series]: 'Серия',
      [CatalogFilterField.wheelDiameter]: 'Диаметр колёс'
    }

    const getQueryValue = (field: CatalogFilterField): string => {
      const value = route.query[field]

      return String(Array.isArray(value) ? value[0] ?? '' : value ?? '').trim()
    }

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

    const orderTopic = computed(() => {
      const item = currentItem.value

      if (!item) {
        return ''
      }

      return [ item.model, ...filterValues.value ].join('; ')
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
      const options: PurchaseOption[] = []
      const palette = selectedPalette.value
      const rotor = selectedRotor.value?.item

      if (palette) {
        options.push({
          id: 'palette',
          label: `цвет суппорта: ${palette.item.title}`,
          price: paletteGroupPrices[palette.group]
        })
      }
      if (rotor) {
        options.push({
          id: 'rotor',
          label: `цвет ротора: ${rotor.title}`,
          price: rotor.price
        })
      }

      return (
        <Purchase
          item={item}
          options={options}
          onOrder={() => showFeedback.value = true}
          onRemove={(id: string) => {
            if (id === 'palette') {
              selectedPalette.value = undefined
            }
            if (id === 'rotor') {
              selectedRotor.value = undefined
            }
          }}
        />
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

    const renderPaletteSection = () => {
      return <Palette onSelect={(selection: PaletteSelection) => selectedPalette.value = selection} />
    }

    const renderRotorCenterSection = () => {
      return <RotorCenter onSelect={(selection: RotorCenterSelection) => selectedRotor.value = selection} />
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
              <div class="product-page__section--tabs">
                <ProductDetails value={item} />
              </div>

            </div>
            {renderPurchase(item)}
          </div>
        </section>
      )
    }

    const renderCatalog = () => {
      return (
        <section class="isk-page__section isk-page__section--contained product-page__section--catalog">
          <div class="product-page__catalog">
            <div class="product-page__catalog-products">
              <ProductRelated item={currentItem.value} />
            </div>

            <aside class="product-page__catalog-accessories">
              <Accessories />
            </aside>
          </div>
        </section>
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
