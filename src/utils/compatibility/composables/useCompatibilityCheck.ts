import { type ComputedRef, type Ref, computed, ref } from 'vue'

import type { CompatibilityEntry, YearOption } from '../types'
import type { SelectOption } from '@/utils'

interface UseCompatibilityCheckReturn {
  selectedBrand: Ref<string>
  selectedModel: Ref<string>
  selectedYear: Ref<string>
  checkResult: Ref<CompatibilityEntry | null>
  brandOptions: ComputedRef<SelectOption[]>
  modelOptions: ComputedRef<SelectOption[]>
  yearOptions: ComputedRef<YearOption[]>
  canCheck: ComputedRef<boolean>
  updateBrand: (value: string) => void
  updateModel: (value: string) => void
  updateYear: (value: string) => void
  runCheck: () => void
  reset: () => void
}

/**
 * Возвращает диапазон лет для entry.
 * Если одна из границ null — используем вторую (одноточечный диапазон).
 * Если обе null — entry не участвует в списке годов.
 */
const getYearRange = (entry: CompatibilityEntry): [ number, number ] | null => {
  const from = entry.yearFrom ?? entry.yearTo
  const to = entry.yearTo ?? entry.yearFrom

  if (from == null || to == null) {
    return null
  }

  return [ from, to ]
}

export const useCompatibilityCheck = (
  entries: ComputedRef<CompatibilityEntry[]>
): UseCompatibilityCheckReturn => {
  const selectedBrand = ref('')
  const selectedModel = ref('')
  const selectedYear = ref('')
  const checkResult = ref<CompatibilityEntry | null>(null)

  const brandOptions = computed<SelectOption[]>(() => {
    const set = new Set<string>()

    for (const item of entries.value) {
      const brand = item.brand?.trim()
      if (brand) {
        set.add(brand)
      }
    }

    return Array.from(set)
      .sort((a, b) => a.localeCompare(b, 'ru'))
      .map(value => ({
        label: value,
        value
      }))
  })

  const modelOptions = computed<SelectOption[]>(() => {
    if (!selectedBrand.value) {
      return []
    }

    const set = new Set<string>()

    for (const item of entries.value) {
      const model = item.model?.trim()
      if (item.brand === selectedBrand.value && model) {
        set.add(model)
      }
    }

    return Array.from(set)
      .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }))
      .map(value => ({
        label: value,
        value
      }))
  })

  const yearOptions = computed<YearOption[]>(() => {
    if (!selectedBrand.value || !selectedModel.value) {
      return []
    }

    const matchingEntries = entries.value.filter(item =>
      item.brand === selectedBrand.value &&
      item.model === selectedModel.value)

    const yearToEntry = new Map<number, CompatibilityEntry>()

    for (const entry of matchingEntries) {
      const range = getYearRange(entry)
      if (!range) {
        continue
      }

      const [ from, to ] = range

      for (let year = from; year <= to; year++) {
        if (!yearToEntry.has(year)) {
          yearToEntry.set(year, entry)
        }
      }
    }

    return Array.from(yearToEntry.entries())
      .sort(([ a ], [ b ]) => a - b)
      .map(([ year, entry ]) => ({
        label: String(year),
        value: String(year),
        entry
      }))
  })

  const canCheck = computed(
    () =>
      Boolean(selectedBrand.value) &&
      Boolean(selectedModel.value) &&
      selectedYear.value !== ''
  )

  const updateBrand = (value: string) => {
    selectedBrand.value = value
    selectedModel.value = ''
    selectedYear.value = ''
    checkResult.value = null
  }

  const updateModel = (value: string) => {
    selectedModel.value = value
    selectedYear.value = ''
    checkResult.value = null
  }

  const updateYear = (value: string) => {
    selectedYear.value = value
    checkResult.value = null
  }

  const runCheck = () => {
    const option = yearOptions.value.find(
      item => item.value === selectedYear.value
    )

    checkResult.value = option?.entry ?? null
  }

  const reset = () => {
    selectedBrand.value = ''
    selectedModel.value = ''
    selectedYear.value = ''
    checkResult.value = null
  }

  return {
    selectedBrand,
    selectedModel,
    selectedYear,
    checkResult,
    brandOptions,
    modelOptions,
    yearOptions,
    canCheck,
    updateBrand,
    updateModel,
    updateYear,
    runCheck,
    reset
  }
}
