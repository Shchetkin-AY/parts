import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { CatalogFilterField, CatalogFilterParams, CatalogItem, CompatibilityItem, SelectOption } from '@/utils'

const normalize = (value: number | string): string => {
  return String(value).trim()
}

const getFilterParam = (params: CatalogFilterParams, field: CatalogFilterField): string => {
  return normalize(params[field] ?? '')
}

const getOptionLabel = (field: CatalogFilterField, value: string): string => {
  if (field === CatalogFilterField.diameter) {
    return `${value} мм`
  }

  if (field === CatalogFilterField.wheelDiameter) {
    return `R${value}`
  }

  return value
}

const sortOptions = (field: CatalogFilterField, options: SelectOption[]): SelectOption[] => {
  const sortedOptions = [ ...options ]

  if (field === CatalogFilterField.diameter || field === CatalogFilterField.wheelDiameter) {
    return sortedOptions.sort((firstOption, secondOption) => {
      return Number(firstOption.value) - Number(secondOption.value)
    })
  }

  return sortedOptions.sort((firstOption, secondOption) => {
    return firstOption.label.localeCompare(secondOption.label, 'ru', {
      numeric: true,
      sensitivity: 'base'
    })
  })
}

const sortStrings = (values: string[]): string[] => {
  return [ ...values ].sort((firstValue, secondValue) => {
    return firstValue.localeCompare(secondValue, 'ru', {
      numeric: true,
      sensitivity: 'base'
    })
  })
}

const sortNumbers = (values: number[]): number[] => {
  return [ ...values ].sort((firstValue, secondValue) => firstValue - secondValue)
}

const getWheelDiameterValues = (value: number | string): number[] => {
  const diameterValues = String(value).match(/\d+(?:[.,]\d+)?/g) ?? []

  return diameterValues
    .map(diameterValue => Number(diameterValue.replace(',', '.')))
    .filter(Number.isFinite)
}

const getUniqueWheelDiameters = (items: readonly CatalogItem[]): number[] => {
  const values = new Set<number>()

  items.forEach(item => {
    getWheelDiameterValues(item.wheelDiameter).forEach(value => values.add(value))
  })

  return sortNumbers([ ...values ])
}

const getUniqueDiscDiameters = (items: readonly CatalogItem[]): number[] => {
  const values = new Set<number>()

  items.forEach(item => {
    if (Number.isFinite(item.discDiameter)) {
      values.add(item.discDiameter)
    }
  })

  return sortNumbers([ ...values ])
}

const getUniqueSeries = (items: readonly CatalogItem[]): string[] => {
  const values = new Set<string>()

  items.forEach(item => {
    const value = normalize(item.series)

    if (value) {
      values.add(value)
    }
  })

  return sortStrings([ ...values ])
}

const getItemFieldValue = (item: CatalogItem, field: CatalogFilterField): string => {
  if (field === CatalogFilterField.series) {
    return normalize(item.series)
  }

  if (field === CatalogFilterField.wheelDiameter) {
    return normalize(item.wheelDiameter)
  }

  return normalize(item.discDiameter)
}

interface CompatibilityIndices {
  brands: string[]
  allModels: string[]
  modelsByBrand: Map<string, string[]>
  goodsIdsByBrandModel: Map<string, Set<number>>
  goodsIdsByBrand: Map<string, Set<number>>
  itemsByGoodsId: Map<number, CompatibilityItem[]>
}

const buildCompatibilityIndices = (items: readonly CompatibilityItem[]): CompatibilityIndices => {
  const brandsSet = new Set<string>()
  const allModelsSet = new Set<string>()
  const modelsByBrand = new Map<string, Set<string>>()
  const goodsIdsByBrandModel = new Map<string, Set<number>>()
  const goodsIdsByBrand = new Map<string, Set<number>>()
  const itemsByGoodsId = new Map<number, CompatibilityItem[]>()

  for (const item of items) {
    const brand = normalize(item.brand)
    const model = normalize(item.model)

    if (!brand || !model) {
      continue
    }

    const key = `${brand}::${model}`

    // brands
    brandsSet.add(brand)

    // allModels
    allModelsSet.add(model)

    // byBrand
    if (!goodsIdsByBrand.has(brand)) {
      goodsIdsByBrand.set(brand, new Set())
    }
    goodsIdsByBrand.get(brand)!.add(item.goodsId)

    // byBrandModel
    if (!goodsIdsByBrandModel.has(key)) {
      goodsIdsByBrandModel.set(key, new Set())
    }
    goodsIdsByBrandModel.get(key)!.add(item.goodsId)

    // modelsByBrand
    if (!modelsByBrand.has(brand)) {
      modelsByBrand.set(brand, new Set())
    }
    modelsByBrand.get(brand)!.add(model)

    // byGoodsId
    if (!itemsByGoodsId.has(item.goodsId)) {
      itemsByGoodsId.set(item.goodsId, [])
    }
    itemsByGoodsId.get(item.goodsId)!.push(item)
  }

  return {
    brands: sortStrings([ ...brandsSet ]),
    allModels: sortStrings([ ...allModelsSet ]),
    modelsByBrand: new Map(
      [ ...modelsByBrand ].map(([ brand, models ]) => [ brand, sortStrings([ ...models ]) ])
    ),
    goodsIdsByBrandModel,
    goodsIdsByBrand,
    itemsByGoodsId
  }
}

export const useCatalogStore = defineStore('catalog', () => {
  const items = ref<CatalogItem[]>([])
  const compatibilityItems = ref<CompatibilityItem[]>([])
  const isLoading = ref(false)
  const loadError = ref<unknown>(null)
  let pendingLoad: Promise<void> | null = null

  const isLoaded = computed(() => items.value.length > 0)
  const itemsById = computed(() => new Map(items.value.map(item => [ item.id, item ])))

  const compatibilityIndices = computed(() => buildCompatibilityIndices(compatibilityItems.value))

  const compatibleItems = computed(() => {
    const hasCompatibility = compatibilityItems.value.length > 0

    if (!hasCompatibility) {
      return items.value
    }

    const compGoodsIds = new Set(compatibilityItems.value.map(item => item.goodsId))

    return items.value.filter(item => compGoodsIds.has(item.id))
  })

  const series = computed(() => getUniqueSeries(compatibleItems.value))
  const discDiameters = computed(() => getUniqueDiscDiameters(compatibleItems.value))
  const wheelDiameters = computed(() => getUniqueWheelDiameters(compatibleItems.value))
  const brands = computed(() => compatibilityIndices.value.brands)

  const load = async (): Promise<void> => {
    if (isLoaded.value) {
      return
    }

    if (pendingLoad) {
      return pendingLoad
    }

    isLoading.value = true
    loadError.value = null

    pendingLoad = Promise.all([
      import('@/data/catalog'),
      import('@/data/compatibility')
    ])
      .then(([ catalogModule, compatibilityModule ]) => {
        items.value = [ ...catalogModule.default ] as CatalogItem[]
        compatibilityItems.value = [ ...compatibilityModule.default ] as CompatibilityItem[]
      })
      .catch((error: unknown) => {
        loadError.value = error

        throw error
      })
      .finally(() => {
        isLoading.value = false
        pendingLoad = null
      })

    return pendingLoad
  }

  const getById = (id: number): CatalogItem | undefined => {
    return itemsById.value.get(id)
  }

  const getCompatibilityByGoodsId = (goodsId: number): CompatibilityItem[] => {
    return compatibilityIndices.value.itemsByGoodsId.get(goodsId) ?? []
  }

  const getRelatedItems = (item: CatalogItem, count = 5): CatalogItem[] => {
    const sameSeriesItems = items.value.filter(entry => entry.series === item.series && entry.id !== item.id)
    const sourceItems = sameSeriesItems.length > 0 ? sameSeriesItems : items.value.filter(entry => entry.id !== item.id)

    return sourceItems.slice(0, count)
  }

  const filterItems = (
    params: CatalogFilterParams,
    sourceItems: readonly CatalogItem[] = compatibleItems.value,
    excludedField?: CatalogFilterField
  ): CatalogItem[] => {
    const markParam = getFilterParam(params, CatalogFilterField.mark)
    const modelParam = getFilterParam(params, CatalogFilterField.model)
    const seriesParam = getFilterParam(params, CatalogFilterField.series)
    const diameterParam = getFilterParam(params, CatalogFilterField.diameter)
    const wheelDiameterParam = getFilterParam(params, CatalogFilterField.wheelDiameter)
    const wheelDiameterValue = Number(wheelDiameterParam)

    // Step 1: filter by brand+model via compatibility indices
    let candidateIds: Set<number> | null = null

    if (excludedField !== CatalogFilterField.mark && excludedField !== CatalogFilterField.model) {
      const { goodsIdsByBrandModel, goodsIdsByBrand } = compatibilityIndices.value

      if (markParam && modelParam) {
        candidateIds = goodsIdsByBrandModel.get(`${markParam}::${modelParam}`) ?? new Set()
      } else if (markParam) {
        candidateIds = goodsIdsByBrand.get(markParam) ?? new Set()
      }
    }

    // Step 2: filter source items by candidateIds + other fields
    return sourceItems.filter(item => {
      if (candidateIds && !candidateIds.has(item.id)) {
        return false
      }

      const isSeriesMatched = excludedField === CatalogFilterField.series
        || !seriesParam
        || getItemFieldValue(item, CatalogFilterField.series) === seriesParam

      const isDiameterMatched = excludedField === CatalogFilterField.diameter
        || !diameterParam
        || getItemFieldValue(item, CatalogFilterField.diameter) === diameterParam

      const isWheelDiameterMatched = excludedField === CatalogFilterField.wheelDiameter
        || !wheelDiameterParam
        || getWheelDiameterValues(item.wheelDiameter).includes(wheelDiameterValue)

      return isSeriesMatched && isDiameterMatched && isWheelDiameterMatched
    })
  }

  const getFilterOptions = (
    field: CatalogFilterField,
    params: CatalogFilterParams,
    sourceItems: readonly CatalogItem[] = compatibleItems.value
  ): SelectOption[] => {
    const markParam = getFilterParam(params, CatalogFilterField.mark)
    const modelParam = getFilterParam(params, CatalogFilterField.model)

    // mark/model options come from compatibility indices
    if (field === CatalogFilterField.mark) {
      const { brands, goodsIdsByBrandModel } = compatibilityIndices.value

      if (modelParam) {
        // only brands that have this model
        return brands
          .filter(brand => goodsIdsByBrandModel.has(`${brand}::${modelParam}`))
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

    if (field === CatalogFilterField.model) {
      if (markParam) {
        const models = compatibilityIndices.value.modelsByBrand.get(markParam) ?? []

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

    // series / diameter / wheelDiameter options come from catalog items
    const optionsMap = new Map<string, SelectOption>()
    const filteredItems = markParam || modelParam
      ? filterItems(params, sourceItems, field)
      : sourceItems

    filteredItems.forEach(item => {
      const values = field === CatalogFilterField.wheelDiameter
        ? getWheelDiameterValues(item.wheelDiameter).map(String)
        : [ getItemFieldValue(item, field) ]

      values.forEach(value => {
        if (!value || optionsMap.has(value)) {
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

  return {
    brands,
    compatibleItems,
    compatibilityItems,
    discDiameters,
    filterItems,
    getById,
    getCompatibilityByGoodsId,
    getFilterOptions,
    getRelatedItems,
    isLoaded,
    isLoading,
    items,
    load,
    series,
    wheelDiameters
  }
})
