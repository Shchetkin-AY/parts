import { type CatalogItem } from '@/utils'
import { computed, defineComponent, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import Accessories from '@/components/accessories/list'
import { Breadcrumbs, ProductHero, ProductRelated, ProductTabs, Purchase } from '@/components/product'
import ProductGallery from '@/components/product-gallery'
import { Page } from '@/components'

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

    const renderGallery = (item: CatalogItem) => {
      return <ProductGallery value={item.series} />
    }
    const renderHero = (item: CatalogItem) => {
      return <ProductHero item={item} />
    }
    const renderPurchase = (item: CatalogItem) => {
      return <Purchase item={item} />
    }

    const renderHeaderContent = () => {
      const item = currentItem.value

      if (item) {
        return (
          <div class="product-page__header">
            {renderGallery(item)}
            {renderHero(item)}
            {renderPurchase(item)}
          </div>
        )
      }
    }

    const renderHeader = () => {
      return (
        <section class="page__section page__section--contained product-page__section--hero">
          {renderHeaderContent()}
        </section>
      )
    }

    const renderTabsSection = () => {
      const item = currentItem.value

      if (item) {
        return (
          <section class="page__section page__section--contained product-page__section--tabs">
            <ProductTabs value={item} />
          </section>
        )
      }
    }

    const renderCatalog = () => {
      return (
        <section class="page__section page__section--contained product-page__section--catalog">
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
        <section class="page__section page__section--contained product-page__section--breadcrumbs">
          <Breadcrumbs item={item} />
        </section>
      )
    }

    return () => {
      if (!currentItem.value) {
        return renderEmptyState()
      }

      return (
        <Page class="product-page">
          {renderBreadcrumbsSection()}
          {renderHeader()}
          {renderTabsSection()}
          {renderCatalog()}
        </Page>
      )
    }
  }
})
