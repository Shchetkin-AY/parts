import { computed, defineComponent, onBeforeMount } from 'vue'

import type { CatalogItem } from '@/utils'
import { useCatalogStore } from '@/stores/catalog'
import ProductCard from './product-card'

function uniqueById(items: CatalogItem[]): CatalogItem[] {
  const map = new Map<number, CatalogItem>()

  for (const item of items) {
    map.set(item.id, item)
  }

  return Array.from(map.values())
}

function pickWeightedFromBucket(items: CatalogItem[]): CatalogItem | undefined {
  if (items.length === 0) {
    return undefined
  }

  if (items.length === 1) {
    return items[0]
  }

  const sorted = [ ...items ].sort((a, b) => a.priceUsd - b.priceUsd)

  const min = sorted[0].priceUsd
  const max = sorted[sorted.length - 1].priceUsd
  const range = Math.max(max - min, 1)

  const weighted = sorted.map(item => {
    const normalized = (item.priceUsd - min) / range
    const distanceFromMiddle = Math.abs(normalized - 0.5)

    return {
      item,
      weight: 1 - distanceFromMiddle + 0.2
    }
  })

  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0)

  let roll = Math.random() * total

  for (const entry of weighted) {
    roll -= entry.weight

    if (roll <= 0) {
      return entry.item
    }
  }

  return weighted[weighted.length - 1].item
}

function pickPopularSystems(items: CatalogItem[], count = 5) {
  const uniqItems = uniqueById(items)

  if (!uniqItems.length) {
    return []
  }

  const bucketSize = Math.ceil(uniqItems.length / count)

  const selected: CatalogItem[] = []
  const usedIds = new Set<number>()

  for (let index = 0; index < count; index += 1) {
    const bucket = uniqItems.slice(index * bucketSize, (index + 1) * bucketSize)

    const picked = pickWeightedFromBucket(bucket)

    if (picked && !usedIds.has(picked.id)) {
      selected.push(picked)

      usedIds.add(picked.id)
    }
  }

  if (selected.length < count) {
    for (const item of uniqItems) {
      if (selected.length >= count) {
        break
      }

      if (usedIds.has(item.id)) {
        continue
      }

      selected.push(item)

      usedIds.add(item.id)
    }
  }

  return selected.slice(0, count)
}

export default defineComponent({
  name: 'PopularSystems',

  setup() {
    const catalogStore = useCatalogStore()

    onBeforeMount(() => {
      void catalogStore.load()
    })

    const systems = computed(() => {
      return pickPopularSystems(catalogStore.items, 5)
    })

    const renderTitle = () => {
      return (
        <div class="popular-systems__title">Популярные комплекты</div>
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
        <div class="popular-systems-content" >
          {renderTitle()}
          <div class="popular-systems__grid">
            {renderCards()}
          </div>
        </div>
      )
    }

    return () => {
      return (
        <section class="popular-systems">
          {renderContent()}
        </section>
      )
    }
  }
})
