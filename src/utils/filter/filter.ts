import { computed, reactive, watch } from 'vue'
import { useCatalogStore } from '../../stores'
import { CatalogItem } from '../catalog'
import { SelectOption } from '../ui'
import { CatalogFilterField } from './field'

export type CatalogFilterItem = Pick<
  CatalogItem,
  'discDiameter' | 'series' | 'wheelDiameter'
>

export interface CatalogFilterParams {
  [CatalogFilterField.diameter]?: string
  [CatalogFilterField.mark]?: string
  [CatalogFilterField.model]?: string
  [CatalogFilterField.series]?: string
  [CatalogFilterField.wheelDiameter]?: string
}

export interface CatalogFilterSubmitPayload<Item = CatalogFilterItem> {
  items: Item[]
  params: CatalogFilterParams
}

export interface FilterFieldConfig {
  field: CatalogFilterField
  label: string
  ariaLabel: string
  placeholder: string
}

const emptyFilterParams: CatalogFilterParams = {
  [CatalogFilterField.diameter]: '',
  [CatalogFilterField.mark]: '',
  [CatalogFilterField.model]: '',
  [CatalogFilterField.series]: '',
  [CatalogFilterField.wheelDiameter]: ''
}

export const buildCatalogFilterQuery = (params: CatalogFilterParams): Record<string, string> => {
  return Object.entries(params).reduce<Record<string, string>>((result, [ field, value ]) => {
    if (value) {
      result[field] = value
    }

    return result
  }, {})
}

export const useCatalogFilterFields = (
  fieldsConfig: FilterFieldConfig[],
  sourceItems: () => CatalogItem[],
  initial?: () => Partial<CatalogFilterParams>
) => {
  const catalogStore = useCatalogStore()
  const params = reactive<CatalogFilterParams>({ ...emptyFilterParams })

  if (initial) {
    watch(initial, value => {
      fieldsConfig.forEach(config => {
        params[config.field] = String(value?.[config.field] ?? '').trim()
      })
    }, {
      deep: true,
      immediate: true
    })
  }

  const optionsByField = computed(() => {
    const result = {} as Record<CatalogFilterField, SelectOption[]>

    fieldsConfig.forEach(config => {
      result[config.field] = catalogStore.getFilterOptions(config.field, params, sourceItems())
    })

    return result
  })

  const filteredItems = computed(() => catalogStore.filterItems(params, sourceItems()))

  fieldsConfig.forEach(config => {
    watch(
      () => optionsByField.value[config.field],
      options => {
        const hasCurrent = options.some(option => option.value === params[config.field])

        if (params[config.field] && !hasCurrent) {
          params[config.field] = ''
        }
      },
      { immediate: true }
    )
  })

  const reset = (): void => {
    fieldsConfig.forEach(config => {
      params[config.field] = ''
    })
  }

  return {
    params,
    optionsByField,
    filteredItems,
    reset
  }
}
