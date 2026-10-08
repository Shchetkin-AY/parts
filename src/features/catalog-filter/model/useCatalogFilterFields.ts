import { computed, reactive, watch } from 'vue'

import { useCatalogStore } from '@/stores'
import { CatalogFilterField, CatalogFilterParams, CatalogItem, FilterFieldProps, SelectOption } from '@/utils'

const emptyFilterParams: CatalogFilterParams = {
  [CatalogFilterField.mark]: '',
  [CatalogFilterField.model]: '',
  [CatalogFilterField.series]: '',
  [CatalogFilterField.wheelDiameter]: ''
}

export const useCatalogFilterFields = (
  fieldsConfig: FilterFieldProps[],
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
        if (!catalogStore.isLoaded) {
          return
        }
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
