import { PropType, computed, defineComponent, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import catalog from '@/data/catalog'
import { CatalogFilterField, CatalogFilterItem, CatalogFilterParams, CatalogFilterSubmitPayload, CatalogItem, Colors, SelectOption } from '@/utils'
import { GButton, GDivider, GSelect } from '@/components'

type FilterOrientation = 'horizontal' | 'vertical'

const defaultFilterItems = [ ...catalog ] as CatalogItem[]
const emptyFilterParams: CatalogFilterParams = {
  [CatalogFilterField.diameter]: '',
  [CatalogFilterField.mark]: '',
  [CatalogFilterField.model]: ''
}

const normalizeFilterValue = (value: number | string): string => {
  return String(value).trim()
}

const getItemFieldValue = (item: CatalogFilterItem, field: CatalogFilterField): string => {
  if (field === CatalogFilterField.mark) {
    return normalizeFilterValue(item.vehicleBrand)
  }

  if (field === CatalogFilterField.model) {
    return normalizeFilterValue(item.vehicleModel)
  }

  return normalizeFilterValue(item.discDiameterMm)
}

const getOptionLabel = (field: CatalogFilterField, value: string): string => {
  if (field === CatalogFilterField.diameter) {
    return `${value} мм`
  }

  return value
}

const sortOptions = (field: CatalogFilterField, options: SelectOption[]): SelectOption[] => {
  const sortedOptions = [ ...options ]

  if (field === CatalogFilterField.diameter) {
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

export default defineComponent({
  name: 'Filter',
  props: {
    initialParams: {
      type: Object as PropType<Partial<CatalogFilterParams>>,
      required: false,
      default: () => ({})
    },
    items: {
      type: Array as PropType<CatalogItem[]>,
      required: false,
      default: () => defaultFilterItems
    },
    orientation: {
      type: String as PropType<FilterOrientation>,
      required: false,
      default: 'horizontal'
    }
  },
  emits: [ 'change', 'submit' ],

  setup(props, { emit }) {
    const router = useRouter()
    const params = reactive<CatalogFilterParams>({
      ...emptyFilterParams
    })

    const resolveInitialParams = (): CatalogFilterParams => {
      return {
        [CatalogFilterField.diameter]: normalizeFilterValue(props.initialParams?.[CatalogFilterField.diameter] ?? ''),
        [CatalogFilterField.mark]: normalizeFilterValue(props.initialParams?.[CatalogFilterField.mark] ?? ''),
        [CatalogFilterField.model]: normalizeFilterValue(props.initialParams?.[CatalogFilterField.model] ?? '')
      }
    }

    const getFilteredItems = (excludedField?: CatalogFilterField): CatalogItem[] => {
      return props.items.filter(item => {
        const isMarkMatched = excludedField === CatalogFilterField.mark
          || !params[CatalogFilterField.mark]
          || getItemFieldValue(item, CatalogFilterField.mark) === params[CatalogFilterField.mark]

        const isModelMatched = excludedField === CatalogFilterField.model
          || !params[CatalogFilterField.model]
          || getItemFieldValue(item, CatalogFilterField.model) === params[CatalogFilterField.model]

        const isDiameterMatched = excludedField === CatalogFilterField.diameter
          || !params[CatalogFilterField.diameter]
          || getItemFieldValue(item, CatalogFilterField.diameter) === params[CatalogFilterField.diameter]

        return isMarkMatched && isModelMatched && isDiameterMatched
      })
    }

    const getUniqueOptions = (field: CatalogFilterField): SelectOption[] => {
      const optionsMap = new Map<string, SelectOption>()

      getFilteredItems(field).forEach(item => {
        const value = getItemFieldValue(item, field)

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

    const markOptions = computed(() => {
      return getUniqueOptions(CatalogFilterField.mark)
    })
    const modelOptions = computed(() => {
      return getUniqueOptions(CatalogFilterField.model)
    })
    const diameterOptions = computed(() => {
      return getUniqueOptions(CatalogFilterField.diameter)
    })
    const filteredItems = computed(() => {
      return getFilteredItems()
    })
    const isSubmitDisabled = computed(() => {
      return filteredItems.value.length === 0
    })

    const hasOption = (options: SelectOption[], value: string): boolean => {
      return options.some(option => {
        return option.value === value
      })
    }

    const syncParamByOptions = (field: CatalogFilterField, options: SelectOption[]): void => {
      const currentValue = params[field]

      if (!currentValue || hasOption(options, currentValue)) {
        return
      }

      params[field] = ''
    }

    const syncParamsFromInitial = (): void => {
      const resolvedParams = resolveInitialParams()

      params[CatalogFilterField.diameter] = resolvedParams[CatalogFilterField.diameter]
      params[CatalogFilterField.mark] = resolvedParams[CatalogFilterField.mark]
      params[CatalogFilterField.model] = resolvedParams[CatalogFilterField.model]
    }

    watch(
      () => props.initialParams,
      syncParamsFromInitial,
      {
        deep: true,
        immediate: true
      }
    )
    watch(
      () => markOptions.value,
      options => syncParamByOptions(CatalogFilterField.mark, options),
      { immediate: true }
    )
    watch(
      () => modelOptions.value,
      options => syncParamByOptions(CatalogFilterField.model, options),
      { immediate: true }
    )
    watch(
      () => diameterOptions.value,
      options => syncParamByOptions(CatalogFilterField.diameter, options),
      { immediate: true }
    )

    const filterPayload = computed<CatalogFilterSubmitPayload<CatalogItem>>(() => {
      return {
        items: [ ...filteredItems.value ],
        params: {
          ...params
        }
      }
    })

    watch(
      () => filterPayload.value,
      payload => {
        emit('change', payload)
      },
      { immediate: true }
    )

    const getCatalogQueryParams = (): Record<string, string> => {
      const query: Record<string, string> = {}

      if (params[CatalogFilterField.mark]) {
        query[CatalogFilterField.mark] = params[CatalogFilterField.mark]
      }
      if (params[CatalogFilterField.model]) {
        query[CatalogFilterField.model] = params[CatalogFilterField.model]
      }
      if (params[CatalogFilterField.diameter]) {
        query[CatalogFilterField.diameter] = params[CatalogFilterField.diameter]
      }

      return query
    }

    const submitHandler = (): void => {
      emit('submit', filterPayload.value)

      const query = getCatalogQueryParams()

      if (Object.keys(query).length === 0) {
        void router.push({ name: 'catalog' })

        return
      }

      void router.push({
        name: 'catalog',
        query
      })
    }

    const callHandler = () => {
      window.location.href = 'tel:+79138135522'
    }

    const renderMarkSelect = () => {
      return (
        <div class="filter__field">
          <GSelect
            v-model={params[CatalogFilterField.mark]}
            ariaLabel="Марка автомобиля"
            clearable
            label="Марка"
            modelValue={params[CatalogFilterField.mark]}
            placeholder="Выберите марку"
            options={markOptions.value}
          />
        </div>
      )
    }
    const renderModelSelect = () => {
      return (
        <div class="filter__field">
          <GSelect
            v-model={params[CatalogFilterField.model]}
            ariaLabel="Модель автомобиля"
            clearable
            label="Модель"
            modelValue={params[CatalogFilterField.model]}
            placeholder="Выберите модель"
            options={modelOptions.value}
          />
        </div>
      )
    }
    const renderDiameterSelect = () => {
      return (
        <div class="filter__field">
          <GSelect
            v-model={params[CatalogFilterField.diameter]}
            ariaLabel="Диаметр диска"
            clearable
            label="Диаметр диска"
            modelValue={params[CatalogFilterField.diameter]}
            placeholder="Выберите диаметр диска"
            options={diameterOptions.value}
          />
        </div>
      )
    }
    const renderAction = () => {
      return (
        <div class="filter__action">
          <GButton
            color={Colors.primary}
            disabled={isSubmitDisabled.value}
            label="Найти комплекты"
            onClick={submitHandler}
          />
        </div>
      )
    }
    const renderTitle = () => {
      return (
        <span class="filter__panel-header-title">
          Подбор по автомобилю
        </span>
      )
    }
    const renderDescription = () => {
      return (
        <span class="filter__panel-header-description">
          Найдите совместимую тормозную систему дял вашего автомобиля
        </span>
      )
    }
    const renderHeader = () => {
      return (
        <div class="filter__panel-header">
          {renderTitle()}
          {renderDescription()}
        </div>
      )
    }
    const renderDivider = () => {
      return <GDivider />
    }
    const renderFooter = () => {
      return (
        <div class="filter__panel-footer">
          <a class="filter__panel-footer__content" onClick={callHandler}>
            <span class="filter__panel-footer__content-title">Не нашли свой автомобиль?</span>
            <span class="filter__panel-footer__content-description">Оставьте заявку</span>
          </a>
        </div>
      )
    }

    return () =>
      <section class="filter">
        <div class="filter__panel">
          {renderHeader()}
          <div class="filter__panel-fields">
            {renderMarkSelect()}
            {renderModelSelect()}
            {renderDiameterSelect()}
            {renderAction()}
          </div>
          {renderDivider()}
          {renderFooter()}
        </div>
      </section>
  }
})
