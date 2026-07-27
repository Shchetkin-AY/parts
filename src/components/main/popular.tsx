import { computed, defineComponent, onBeforeMount } from 'vue'

import { useCatalogStore } from '@/stores/catalog'
import type { CatalogItem } from '@/utils'
import ProductCard from '@/components/product-card'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'Popular',

  setup() {
    const catalogStore = useCatalogStore()

    const className = 'popular'

    onBeforeMount(() => {
      void catalogStore.load()
    })

    function pickRandom(items: CatalogItem[], count = 5): CatalogItem[] {
      if (!items.length) {
        return []
      }

      const shuffled = [ ...items ].sort(() => Math.random() - 0.5)

      return shuffled.slice(0, count)
    }

    const systems = computed(() => {
      return pickRandom(catalogStore.items, 5)
    })

    const renderCatalogLink = () => {
      return (
        <RouterLink
          class={`${className}__header-link`}
          to={'/catalog'}
        >
          Смотреть каталог →
        </RouterLink>
      )
    }

    const renderTitle = () => {
      return (
        <div class={`${className}__header-title`}>Популярные комплекты</div>
      )
    }

    const renderHeader = () => {
      return (
        <div class={`${className}__header`}>
          {renderTitle()}
          {renderCatalogLink()}
        </div>
      )
    }

    const renderCards = () => {
      return systems.value.map((system, index) => {
        return (
          <ProductCard
            key={system.id}
            value={system}
            badge={index === 0}
          />
        )
      })
    }

    const renderContent = () => {
      return (
        <div class={`${className}__cards`}>
          {renderCards()}
        </div>

      )
    }

    return () => {
      return (
        <section class={className}>
          {renderHeader()}
          {renderContent()}
        </section>
      )
    }
  }
})
