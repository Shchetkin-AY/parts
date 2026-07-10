import { type CatalogItem } from '@/utils'
import { computed, defineComponent, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import Accessories from '@/components/accessories'
import { Breadcrumbs, ProductHero, ProductPurchase, ProductRelated, ProductTabs } from '@/components/single'
import ProductGallery from '@/components/product-gallery'

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

    const relatedItems = computed(() => {
      const item = currentItem.value

      if (!item) {
        return []
      }

      return catalogStore.getRelatedItems(item, 4)
    })

    const renderEmptyState = () => {
      const message = catalogStore.isLoading ? 'Загрузка товара...' : 'Товар не найден'

      return (
        <div class="product-page__empty">
          {message}
        </div>
      )
    }

    const renderGallery = () => {
      const item = currentItem.value

      if (!item) {
        return null
      }

      return <ProductGallery value={item.series} />
    }
    const renderHero = () => {
      const item = currentItem.value

      if (!item) {
        return null
      }

      return (
        <section class="product-page__section product-page__section--hero">
          <div class="product-page__hero">
            {renderGallery()}
            <ProductHero item={item} />
            <ProductPurchase item={item} />
          </div>
        </section>
      )
    }

    const renderTabsSection = () => {
      const item = currentItem.value

      if (!item) {
        return null
      }

      return (
        <section class="product-page__section product-page__section--tabs">
          <ProductTabs item={item} />
        </section>
      )
    }

    const renderCatalog = () => {
      return (
        <section class="product-page__section product-page__section--catalog">
          <div class="product-page__catalog">
            <div class="product-page__catalog-products">
              <ProductRelated item={currentItem.value} relatedItems={relatedItems.value} />
            </div>

            <aside class="product-page__catalog-accessories">
              <Accessories />
            </aside>
          </div>
        </section>
      )
    }

    const renderBreadcrumbsSection = () => {
      const item = currentItem.value

      if (!item) {
        return null
      }

      return (
        <section class="product-page__section product-page__section--breadcrumbs">
          <Breadcrumbs item={item} />
        </section>
      )
    }

    return () => {
      if (!currentItem.value) {
        return renderEmptyState()
      }

      return (
        <div class="product-page">
          {renderBreadcrumbsSection()}
          {renderHero()}
          {renderTabsSection()}
          {renderCatalog()}
        </div>
      )
    }
  }
})
