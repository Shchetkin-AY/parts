import { computed, defineComponent } from 'vue'

import catalog from '@/data/catalog'
import Card from '@/components/card'
import { CatalogItem } from '@/utils'

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
  const sorted = uniqueById(items).sort((a, b) => a.priceUsd - b.priceUsd)

  if (!sorted.length) {
    return []
  }

  const bucketSize = Math.ceil(sorted.length / count)

  const selected: CatalogItem[] = []
  const usedIds = new Set<number>()

  for (let index = 0; index < count; index += 1) {
    const bucket = sorted.slice(index * bucketSize, (index + 1) * bucketSize)

    const picked = pickWeightedFromBucket(bucket)

    if (picked && !usedIds.has(picked.id)) {
      selected.push(picked)

      usedIds.add(picked.id)
    }
  }

  if (selected.length < count) {
    for (const item of sorted) {
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
    const systems = computed(() => {
      return pickPopularSystems(catalog, 5)
    })

    const renderTitle = () => {
      return (
        <div class="popular-systems__title">Популярные системы</div>
      )
    }

    const renderCards = () => {
      return systems.value.map((system, index) => {
        return (
          <Card
            key={system.id}
            value={system}
            badge={index === 0}
          />
        )
      })
    }

    return () => {
      return (
        <section class="popular-systems">
          {renderTitle()}

          <div class="popular-systems__grid">
            {renderCards()}
          </div>
        </section>
      )
    }
  }
})
