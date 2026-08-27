import { useRoute } from 'vue-router'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'

import { useCatalogStore } from '@/stores'

import { CatalogCategories, CatalogFilterField, CatalogItem, FeedbackTypes, formatWheelDiameter } from '@/utils'
import { Page } from '@/ui'
import Feedback from '@/features/feedback'
import { Breadcrumbs, ProductDetails, ProductGallery, ProductHero, ProductRelated, Purchase } from '@/entities/product'
import { Accessories } from '@/entities/accessory'

export default defineComponent({
  name: 'ProductPage',

  setup() {
    const route = useRoute()

    const catalogStore = useCatalogStore()
    const showFeedback = ref(false)

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
      return <Purchase item={item} onOrder={() => showFeedback.value = true} />
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
