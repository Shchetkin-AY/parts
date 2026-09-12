import { type ComputedRef, computed, ref } from 'vue'

import type { BrandStat, CompatibilityEntry, UseCompatibilityBrowseReturn } from '../types'

export const useCompatibilityBrowse = (
  entries: ComputedRef<CompatibilityEntry[]>
): UseCompatibilityBrowseReturn => {
  const listOpen = ref(false)
  const activeBrand = ref<string | null>(null)

  const brandStats = computed<BrandStat[]>(() => {
    const map = new Map<string, number>()

    for (const item of entries.value) {
      const brand = item.brand?.trim()
      if (!brand) {
        continue
      }

      map.set(brand, (map.get(brand) ?? 0) + 1)
    }

    return Array.from(map.entries())
      .map(([ brand, count ]) => ({
        brand,
        count
      }))
      .sort((a, b) => a.brand.localeCompare(b.brand, 'ru'))
  })

  const resolvedActiveBrand = computed<string | null>(() => {
    if (activeBrand.value === null) {
      return null
    }

    const stillVisible = brandStats.value.some(
      stat => stat.brand === activeBrand.value
    )

    return stillVisible ? activeBrand.value : null
  })

  const resultRows = computed<CompatibilityEntry[]>(() => {
    const brand = resolvedActiveBrand.value

    if (!brand) {
      return entries.value
    }

    return entries.value.filter(item => item.brand === brand)
  })

  const toggleList = () => {
    listOpen.value = !listOpen.value
  }

  const selectBrand = (brand: string | null) => {
    activeBrand.value = brand
  }

  return {
    listOpen,
    brandStats,
    resultRows,
    resolvedActiveBrand,
    toggleList,
    selectBrand
  }
}
