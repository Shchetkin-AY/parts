import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { CatalogFilterField, type CatalogFilterParams, type CatalogItem, type SelectOption } from '@/utils'

const normalize = (value: number | string): string => {
  return String(value).trim()
}

const isCompatibleItem = (item: CatalogItem): boolean => {
  return Boolean(
    normalize(item.vehicleBrand)
    && normalize(item.vehicleModel)
    && normalize(item.discDiameterMm)
    && normalize(item.wheelDiameterInch)
  )
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

const getUniqueStrings = (
  items: readonly CatalogItem[],
  getValue: (item: CatalogItem) => number | string
): string[] => {
  const values = new Set<string>()

  items.forEach(item => {
    const value = normalize(getValue(item))

    if (value) {
      values.add(value)
    }
  })

  return sortStrings([ ...values ])
}

const getUniqueNumbers = (
  items: readonly CatalogItem[],
  getValue: (item: CatalogItem) => number
): number[] => {
  const values = new Set<number>()

  items.forEach(item => {
    const value = getValue(item)

    if (Number.isFinite(value)) {
      values.add(value)
    }
  })

  return sortNumbers([ ...values ])
}

const getWheelDiameterValues = (value: string): number[] => {
  const diameterValues = value.match(/\d+(?:[.,]\d+)?/g) ?? []

  return diameterValues
    .map(diameterValue => Number(diameterValue.replace(',', '.')))
    .filter(Number.isFinite)
}

const getUniqueWheelDiameters = (items: readonly CatalogItem[]): number[] => {
  const values = new Set<number>()

  items.forEach(item => {
    getWheelDiameterValues(item.wheelDiameterInch).forEach(value => values.add(value))
  })

  return sortNumbers([ ...values ])
}

const getItemFieldValue = (item: CatalogItem, field: CatalogFilterField): string => {
  if (field === CatalogFilterField.mark) {
    return normalize(item.vehicleBrand)
  }

  if (field === CatalogFilterField.model) {
    return normalize(item.vehicleModel)
  }

  if (field === CatalogFilterField.wheelDiameter) {
    return normalize(item.wheelDiameterInch)
  }

  return normalize(item.discDiameterMm)
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

export const useCatalogStore = defineStore('catalog', () => {
  const items = ref<CatalogItem[]>([])
  const isLoading = ref(false)
  const loadError = ref<unknown>(null)
  let pendingLoad: Promise<CatalogItem[]> | null = null

  const isLoaded = computed(() => items.value.length > 0)
  const compatibleItems = computed(() => items.value.filter(isCompatibleItem))
  const categories = computed(() => getUniqueStrings(items.value, item => item.category))
  const series = computed(() => getUniqueStrings(items.value, item => item.series))
  const vehicleBrands = computed(() => getUniqueStrings(compatibleItems.value, item => item.vehicleBrand))
  const discDiameters = computed(() => getUniqueNumbers(compatibleItems.value, item => item.discDiameterMm))
  const wheelDiameters = computed(() => getUniqueWheelDiameters(compatibleItems.value))
  const errorMessage = computed(() => {
    if (!loadError.value) {
      return ''
    }

    if (loadError.value instanceof Error) {
      return loadError.value.message
    }

    if (typeof loadError.value === 'string') {
      return loadError.value
    }

    return 'Unknown catalog load error'
  })

  const load = async (): Promise<CatalogItem[]> => {
    if (isLoaded.value) {
      return items.value
    }

    if (pendingLoad) {
      return pendingLoad
    }

    isLoading.value = true
    loadError.value = null

    pendingLoad = import('@/data/catalog')
      .then(module => {
        items.value = [ ...module.default ] as CatalogItem[]

        return items.value
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
    return items.value.find(item => item.id === id)
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
    return sourceItems.filter(item => {
      const isMarkMatched = excludedField === CatalogFilterField.mark
        || !params[CatalogFilterField.mark]
        || getItemFieldValue(item, CatalogFilterField.mark) === params[CatalogFilterField.mark]

      const isModelMatched = excludedField === CatalogFilterField.model
        || !params[CatalogFilterField.model]
        || getItemFieldValue(item, CatalogFilterField.model) === params[CatalogFilterField.model]

      const isDiameterMatched = excludedField === CatalogFilterField.diameter
        || !params[CatalogFilterField.diameter]
        || getItemFieldValue(item, CatalogFilterField.diameter) === params[CatalogFilterField.diameter]

      const wheelDiameterParam = Number(params[CatalogFilterField.wheelDiameter])
      const isWheelDiameterMatched = excludedField === CatalogFilterField.wheelDiameter
        || !params[CatalogFilterField.wheelDiameter]
        || getWheelDiameterValues(item.wheelDiameterInch).includes(wheelDiameterParam)

      return isMarkMatched && isModelMatched && isDiameterMatched && isWheelDiameterMatched
    })
  }

  const getFilterOptions = (
    field: CatalogFilterField,
    params: CatalogFilterParams,
    sourceItems: readonly CatalogItem[] = compatibleItems.value
  ): SelectOption[] => {
    const optionsMap = new Map<string, SelectOption>()

    filterItems(params, sourceItems, field).forEach(item => {
      const values = field === CatalogFilterField.wheelDiameter
        ? getWheelDiameterValues(item.wheelDiameterInch).map(String)
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
    categories,
    compatibleItems,
    discDiameters,
    errorMessage,
    filterItems,
    getById,
    getFilterOptions,
    getRelatedItems,
    isLoaded,
    isLoading,
    items,
    load,
    loadError,
    series,
    vehicleBrands,
    wheelDiameters
  }
})
