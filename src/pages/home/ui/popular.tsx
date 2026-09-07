import { RouterLink } from 'vue-router'
import { computed, defineComponent, onBeforeMount } from 'vue'

import { useCatalogStore } from '@/stores/catalog'
import type { CatalogItem } from '@/utils'
import { ProductCard } from '@/entities/product'

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
      const items = catalogStore.items.filter(item => item.price !== 0)

      return pickRandom(items, 5)
    })

    const renderCatalogLink = () => {
      return (
        <RouterLink
          class={`${className}__header-link`}
          to={'/catalog'}
        >
          Смотреть все →
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
