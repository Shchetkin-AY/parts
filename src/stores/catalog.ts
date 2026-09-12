import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  CatalogFilterField,
  CatalogFilterParams,
  CatalogItem,
  SelectOption
} from '@/utils'
import { CatalogFilterField as FilterField } from '@/utils'

const normalize = (value: number | string | null | undefined): string =>
  String(value ?? '').trim()

const getFilterParam = (
  params: CatalogFilterParams,
  field: CatalogFilterField
): string => normalize(params[field] ?? '')

const getOptionLabel = (field: CatalogFilterField, value: string): string => {
  if (field === FilterField.wheelDiameter) {
    return `R${value}`
  }

  return value
}

const sortOptions = (
  field: CatalogFilterField,
  options: SelectOption[]
): SelectOption[] => {
  const sorted = [ ...options ]
  if (field === FilterField.wheelDiameter) {
    return sorted.sort((a, b) => Number(a.value) - Number(b.value))
  }

  return sorted.sort((a, b) =>
    a.label.localeCompare(b.label, 'ru', {
      numeric: true,
      sensitivity: 'base'
    }))
}

const sortStrings = (values: string[]): string[] =>
  [ ...values ].sort((a, b) =>
    a.localeCompare(b, 'ru', {
      numeric: true,
      sensitivity: 'base'
    }))

const sortNumbers = (values: number[]): number[] =>
  [ ...values ].sort((a, b) => a - b)

const getWheelDiameterValues = (value: number | string): number[] => {
  const source = String(value)
  const rangeMatch = source.match(/(\d+)\s*-\s*(\d+)/)
  if (rangeMatch) {
    const from = Number(rangeMatch[1])
    const to = Number(rangeMatch[2])
    const result: number[] = []
    for (let d = from; d <= to; d++) {
      result.push(d)
    }

    return result
  }

  return (source.match(/\d+(?:[.,]\d+)?/g) ?? [])
    .map(v => Number(v.replace(',', '.')))
    .filter(Number.isFinite)
}

const getUniqueWheelDiameters = (items: readonly CatalogItem[]): number[] => {
  const values = new Set<number>()
  items.forEach(item => {
    getWheelDiameterValues(item.wheelDiameter).forEach(v => values.add(v))
  })

  return sortNumbers([ ...values ])
}

const getUniqueSeries = (items: readonly CatalogItem[]): string[] => {
  const values = new Set<string>()
  items.forEach(item => {
    const v = normalize(item.series)
    if (v) {
      values.add(v)
    }
  })

  return sortStrings([ ...values ])
}

export const withZeroPriceLast = (items: readonly CatalogItem[]): CatalogItem[] => {
  const regular: CatalogItem[] = []
  const zeroPrice: CatalogItem[] = []

  for (const item of items) {
    if (item.price === 0) {
      zeroPrice.push(item)
    } else {
      regular.push(item)
    }
  }

  return [ ...regular, ...zeroPrice ]
}

export enum CatalogSortField {
  popularity = 'popularity',
  priceAsc = 'priceAsc',
  priceDesc = 'priceDesc',
  discDiameter = 'discDiameter'
}

interface CompatibilityEntry {
  brand: string
  model: string
  platform?: string
  yearFrom: number | null
  yearTo: number | null
  wheelInch: number | null
}

type CompatibilityByGoodsId = Record<number, CompatibilityEntry[]>

interface CompatibilityIndices {
  brands: string[]
  allModels: string[]
  modelsByBrand: Map<string, string[]>
  goodsIdsByBrandModel: Map<string, Set<number>>
  goodsIdsByBrand: Map<string, Set<number>>
}

const buildCompatibilityIndices = (
  data: CompatibilityByGoodsId
): CompatibilityIndices => {
  const brandsSet = new Set<string>()
  const allModelsSet = new Set<string>()
  const modelsByBrand = new Map<string, Set<string>>()
  const goodsIdsByBrandModel = new Map<string, Set<number>>()
  const goodsIdsByBrand = new Map<string, Set<number>>()

  for (const [ goodsIdStr, list ] of Object.entries(data)) {
    const goodsId = Number(goodsIdStr)

    for (const item of list) {
      const brand = normalize(item.brand)
      const model = normalize(item.model)
      if (!brand || !model) {
        continue
      }

      const key = `${brand}::${model}`

      brandsSet.add(brand)
      allModelsSet.add(model)

      if (!goodsIdsByBrand.has(brand)) {
        goodsIdsByBrand.set(brand, new Set())
      }
      goodsIdsByBrand.get(brand)!.add(goodsId)

      if (!goodsIdsByBrandModel.has(key)) {
        goodsIdsByBrandModel.set(key, new Set())
      }
      goodsIdsByBrandModel.get(key)!.add(goodsId)

      if (!modelsByBrand.has(brand)) {
        modelsByBrand.set(brand, new Set())
      }
      modelsByBrand.get(brand)!.add(model)
    }
  }

  return {
    brands: sortStrings([ ...brandsSet ]),
    allModels: sortStrings([ ...allModelsSet ]),
    modelsByBrand: new Map(
      [ ...modelsByBrand ].map(([ brand, models ]) => [
        brand,
        sortStrings([ ...models ])
      ])
    ),
    goodsIdsByBrandModel,
    goodsIdsByBrand
  }
}

export const useCatalogStore = defineStore('catalog', () => {
  const items = ref<CatalogItem[]>([])
  const compatibilityByGoodsId = ref<CompatibilityByGoodsId>({})
  const isLoading = ref(false)
  const isCompatibilityLoading = ref(false)
  const loadError = ref<unknown>(null)

  let pendingCatalogLoad: Promise<void> | null = null
  let pendingCompatibilityLoad: Promise<void> | null = null

  const isLoaded = computed(() => items.value.length > 0)
  const isCompatibilityLoaded = computed(
    () => Object.keys(compatibilityByGoodsId.value).length > 0
  )

  const itemsById = computed(
    () => new Map(items.value.map(item => [ item.id, item ]))
  )

  const compatibilityIndices = computed(() =>
    buildCompatibilityIndices(compatibilityByGoodsId.value))

  const compatibleItems = computed(() => {
    const ids = new Set(
      Object.keys(compatibilityByGoodsId.value).map(Number)
    )
    if (ids.size === 0) {
      return items.value
    }

    return items.value.filter(item => ids.has(item.id))
  })

  const series = computed(() => getUniqueSeries(compatibleItems.value))
  const wheelDiameters = computed(() =>
    getUniqueWheelDiameters(compatibleItems.value))
  const brands = computed(() => compatibilityIndices.value.brands)

  // ---------- загрузка ----------
  const loadCatalog = async (): Promise<void> => {
    if (isLoaded.value) {
      return
    }
    if (pendingCatalogLoad) {
      return pendingCatalogLoad
    }

    isLoading.value = true
    loadError.value = null

    pendingCatalogLoad = import('@/data/catalog')
      .then(mod => {
        items.value = [ ...mod.default ] as CatalogItem[]
      })
      .catch((error: unknown) => {
        loadError.value = error
        throw error
      })
      .finally(() => {
        isLoading.value = false
        pendingCatalogLoad = null
      })

    return pendingCatalogLoad
  }

  const loadCompatibility = async (): Promise<void> => {
    if (isCompatibilityLoaded.value) {
      return
    }
    if (pendingCompatibilityLoad) {
      return pendingCompatibilityLoad
    }

    isCompatibilityLoading.value = true

    pendingCompatibilityLoad = import('@/data/compatibility')
      .then(mod => {
        compatibilityByGoodsId.value =
          mod.default as unknown as CompatibilityByGoodsId
      })
      .catch((error: unknown) => {
        loadError.value = error
        throw error
      })
      .finally(() => {
        isCompatibilityLoading.value = false
        pendingCompatibilityLoad = null
      })

    return pendingCompatibilityLoad
  }

  /** Обратная совместимость: load() = только каталог */
  const load = async (): Promise<void> => loadCatalog()

  // ---------- API ----------
  const getById = (id: number): CatalogItem | undefined =>
    itemsById.value.get(id)

  const getCompatibilityByGoodsId = (
    goodsId: number
  ): CompatibilityEntry[] => compatibilityByGoodsId.value[goodsId] ?? []

  const getRelatedItems = (item: CatalogItem, count?: number): CatalogItem[] => {
    const sameSeries = items.value.filter(
      entry => entry.series === item.series && entry.id !== item.id
    )

    const ordered = withZeroPriceLast(sameSeries)

    if (count == null) {
      return ordered
    }

    return ordered.slice(0, count)
  }

  const filterItems = (
    params: CatalogFilterParams,
    sourceItems: readonly CatalogItem[] = compatibleItems.value,
    excludedField?: CatalogFilterField
  ): CatalogItem[] => {
    const markParam = getFilterParam(params, FilterField.mark)
    const modelParam = getFilterParam(params, FilterField.model)
    const seriesParam = getFilterParam(params, FilterField.series)
    const wheelDiameterParam = getFilterParam(params, FilterField.wheelDiameter)
    const wheelDiameterValue = Number(wheelDiameterParam)

    // 1. Фильтр по марке/модели через индексы совместимости
    let candidateIds: Set<number> | null = null

    if (
      excludedField !== FilterField.mark &&
      excludedField !== FilterField.model
    ) {
      const { goodsIdsByBrandModel, goodsIdsByBrand } =
        compatibilityIndices.value

      if (markParam && modelParam) {
        candidateIds =
          goodsIdsByBrandModel.get(`${markParam}::${modelParam}`) ?? new Set()
      } else if (markParam) {
        candidateIds = goodsIdsByBrand.get(markParam) ?? new Set()
      }
    }

    // 2. Фильтр по series + wheelDiameter (diameter больше не используется)
    return sourceItems.filter(item => {
      if (candidateIds && !candidateIds.has(item.id)) {
        return false
      }

      const isSeriesMatched =
        excludedField === FilterField.series ||
        !seriesParam ||
        normalize(item.series) === seriesParam

      const isWheelDiameterMatched =
        excludedField === FilterField.wheelDiameter ||
        !wheelDiameterParam ||
        getWheelDiameterValues(item.wheelDiameter).includes(wheelDiameterValue)

      return isSeriesMatched && isWheelDiameterMatched
    })
  }

  const sortItems = (
    sourceItems: readonly CatalogItem[],
    sort: CatalogSortField
  ): CatalogItem[] => {
    const zeroPriceItems = sourceItems.filter(item => item.price === 0)
    const regularItems = sourceItems.filter(item => item.price !== 0)

    const shuffleItems = (itemsToShuffle: readonly CatalogItem[]): CatalogItem[] => {
      const shuffled = [ ...itemsToShuffle ]

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[ shuffled[i], shuffled[j] ] = [ shuffled[j], shuffled[i] ]
      }

      return shuffled
    }

    switch (sort) {
      case CatalogSortField.priceAsc:
        return [ ...regularItems.sort((a, b) => a.price - b.price), ...zeroPriceItems ]
      case CatalogSortField.priceDesc:
        return [ ...regularItems.sort((a, b) => b.price - a.price), ...zeroPriceItems ]
      case CatalogSortField.discDiameter:
        return [ ...regularItems.sort((a, b) => a.discDiameter - b.discDiameter), ...zeroPriceItems ]
      default:
        return [ ...shuffleItems(regularItems), ...zeroPriceItems ]
    }
  }

  const getFilterOptions = (
    field: CatalogFilterField,
    params: CatalogFilterParams,
    sourceItems: readonly CatalogItem[] = compatibleItems.value
  ): SelectOption[] => {
    const markParam = getFilterParam(params, FilterField.mark)
    const modelParam = getFilterParam(params, FilterField.model)

    if (field === FilterField.mark) {
      const { brands, goodsIdsByBrandModel } = compatibilityIndices.value

      if (modelParam) {
        return brands
          .filter(brand =>
            goodsIdsByBrandModel.has(`${brand}::${modelParam}`))
          .map(brand => ({
            label: getOptionLabel(field, brand),
            value: brand
          }))
      }

      return brands.map(brand => ({
        label: getOptionLabel(field, brand),
        value: brand
      }))
    }

    if (field === FilterField.model) {
      if (markParam) {
        const models =
          compatibilityIndices.value.modelsByBrand.get(markParam) ?? []

        return models.map(model => ({
          label: getOptionLabel(field, model),
          value: model
        }))
      }

      return compatibilityIndices.value.allModels.map(model => ({
        label: getOptionLabel(field, model),
        value: model
      }))
    }

    if (field === FilterField.series) {
      const optionsMap = new Map<string, SelectOption>()
      const filteredItems =
        markParam || modelParam
          ? filterItems(params, sourceItems, field)
          : sourceItems

      filteredItems.forEach(item => {
        const value = normalize(item.series)
        if (!value || optionsMap.has(value)) {
          return
        }
        optionsMap.set(value, {
          label: getOptionLabel(field, value),
          value
        })
      })

      return sortOptions(field, [ ...optionsMap.values() ])
    }

    if (field === FilterField.wheelDiameter) {
      const optionsMap = new Map<string, SelectOption>()
      const filteredItems =
        markParam || modelParam
          ? filterItems(params, sourceItems, field)
          : sourceItems

      filteredItems.forEach(item => {
        getWheelDiameterValues(item.wheelDiameter).forEach(d => {
          const value = String(d)
          if (optionsMap.has(value)) {
            return
          }
          optionsMap.set(value, {
            label: getOptionLabel(field, value),
            value
          })
        })
      })

      return sortOptions(field, [ ...optionsMap.values() ])
    }

    return []
  }

  return {
    brands,
    compatibleItems,
    compatibilityByGoodsId,
    filterItems,
    getById,
    getCompatibilityByGoodsId,
    getFilterOptions,
    getRelatedItems,
    isCompatibilityLoaded,
    isCompatibilityLoading,
    isLoaded,
    isLoading,
    items,
    load,
    loadCatalog,
    loadCompatibility,
    loadError,
    series,
    sortItems,
    wheelDiameters
  }
})
