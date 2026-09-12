import type { SelectOption } from '@/utils'
import { ComputedRef, Ref } from 'vue'

export interface CompatibilityEntry {
  brand: string
  model: string
  platform?: string
  yearFrom: number | null
  yearTo: number | null
  wheelInch: number | null
}

export interface BrandStat {
  brand: string
  count: number
}

export interface YearOption extends SelectOption {
  entry: CompatibilityEntry
}

export interface UseCompatibilityBrowseReturn {
  listOpen: Ref<boolean>
  brandStats: ComputedRef<BrandStat[]>
  resultRows: ComputedRef<CompatibilityEntry[]>
  resolvedActiveBrand: ComputedRef<string | null>
  toggleList: () => void
  selectBrand: (brand: string | null) => void
}
