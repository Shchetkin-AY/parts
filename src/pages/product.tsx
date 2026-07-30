import { useRoute } from 'vue-router'
import { computed, defineComponent, onBeforeMount } from 'vue'

import { useCatalogStore } from '@/stores'

import { CatalogItem } from '@/utils'
import { Page } from '@/ui'
import { Breadcrumbs, ProductDetails, ProductGallery, ProductHero, ProductRelated, Purchase } from '@/entities/product'
import { Accessories } from '@/entities/accessory'

export default defineComponent({
  name: 'ProductPage',

  setup() {
    const route = useRoute()

    const catalogStore = useCatalogStore()

    onBeforeMount(() => {
      void catalogStore.load()
    })

    const routeId = computed(() => {
      const rawId = route.params.id
      const value = Array.isArray(rawId) ? rawId[0] : rawId

      return Number(value)
    })

    const currentItem = computed<CatalogItem | null>(() => {
      const item = catalogStore.getById(routeId.value)

      return item ?? null
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
      return <Purchase item={item} />
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
        </Page>
      )
    }
  }
})
