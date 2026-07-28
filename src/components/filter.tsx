// filter.tsx — итоговая версия с конфигом полей и wheelDiameter
import { PropType, computed, defineComponent, onBeforeMount, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ButtonModes, CatalogFilterField, type CatalogFilterParams, type CatalogFilterSubmitPayload, type CatalogItem, Colors, type SelectOption, Sizes } from '@/utils'
import { GButton, GDivider, GSelect } from '@/components'
import { useCatalogStore } from '@/stores/catalog'
import Feedback from './feedback'
import { ref } from 'vue'

type FilterOrientation = 'horizontal' | 'vertical'

interface FilterFieldConfig {
  field: CatalogFilterField
  label: string
  ariaLabel: string
  placeholder: string
  verticalOnly?: boolean
}

const filterFieldsConfig: FilterFieldConfig[] = [
  {
    field: CatalogFilterField.mark,
    label: 'Марка',
    ariaLabel: 'Марка автомобиля',
    placeholder: 'Выберите марку'
  },
  {
    field: CatalogFilterField.model,
    label: 'Модель',
    ariaLabel: 'Модель автомобиля',
    placeholder: 'Выберите модель'
  },
  {
    field: CatalogFilterField.series,
    label: 'Серия',
    ariaLabel: 'Серия',
    placeholder: 'Выберите серию',
    verticalOnly: true
  },
  {
    field: CatalogFilterField.wheelDiameter,
    label: 'Диаметр колёс',
    ariaLabel: 'Диаметр колёс',
    placeholder: 'Выберите диаметр колёс',
    verticalOnly: true
  },
  {
    field: CatalogFilterField.diameter,
    label: 'Диаметр диска',
    ariaLabel: 'Диаметр диска',
    placeholder: 'Выберите диаметр диска'
  }
]

const emptyFilterParams: CatalogFilterParams = {
  [CatalogFilterField.diameter]: '',
  [CatalogFilterField.mark]: '',
  [CatalogFilterField.model]: '',
  [CatalogFilterField.series]: '',
  [CatalogFilterField.wheelDiameter]: ''
}

const normalizeFilterValue = (value: number | string): string => {
  return String(value).trim()
}

export default defineComponent({
  name: 'Filter',

  props: {
    initialParams: {
      type: Object as PropType<Partial<CatalogFilterParams>>,
      default: () => ({})
    },
    items: {
      type: Array as PropType<CatalogItem[]>,
      default: () => []
    },
    orientation: {
      type: String as PropType<FilterOrientation>,
      default: 'horizontal'
    }
  },

  emits: [ 'change', 'submit' ],

  setup(props, { emit }) {
    const router = useRouter()
    const catalogStore = useCatalogStore()
    const showFeedback = ref(false)

    const params = reactive<CatalogFilterParams>({ ...emptyFilterParams })

    const sourceItems = computed(() => {
      return props.items.length > 0 ? props.items : catalogStore.compatibleItems
    })

    const resolveInitialParams = (): CatalogFilterParams => {
      const result = { ...emptyFilterParams }

      filterFieldsConfig.forEach(config => {
        result[config.field] = normalizeFilterValue(props.initialParams?.[config.field] ?? '')
      })

      return result
    }

    const getFilteredItems = (excludedField?: CatalogFilterField): CatalogItem[] => {
      return catalogStore.filterItems(params, sourceItems.value, excludedField)
    }

    const getUniqueOptions = (field: CatalogFilterField) => {
      return catalogStore.getFilterOptions(field, params, sourceItems.value)
    }

    const optionsByField = computed(() => {
      const result = {} as Record<CatalogFilterField, SelectOption[]>

      filterFieldsConfig.forEach(config => {
        result[config.field] = getUniqueOptions(config.field)
      })

      return result
    })

    const filteredItems = computed(() => getFilteredItems())
    const isSubmitDisabled = computed(() => filteredItems.value.length === 0)

    const hasOption = (options: SelectOption[], value: string): boolean => {
      return options.some(option => option.value === value)
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

      filterFieldsConfig.forEach(config => {
        params[config.field] = resolvedParams[config.field]
      })
    }

    watch(() => props.initialParams, syncParamsFromInitial, {
      deep: true,
      immediate: true
    })

    filterFieldsConfig.forEach(config => {
      watch(
        () => optionsByField.value[config.field],
        options => syncParamByOptions(config.field, options),
        { immediate: true }
      )
    })

    const filterPayload = computed<CatalogFilterSubmitPayload<CatalogItem>>(() => {
      return {
        items: [ ...filteredItems.value ],
        params: { ...params }
      }
    })

    watch(() => filterPayload.value, payload => emit('change', payload), { immediate: true })

    onBeforeMount(() => {
      catalogStore.load()
    })

    const getCatalogQueryParams = (): Record<string, string> => {
      const query: Record<string, string> = {}

      filterFieldsConfig.forEach(config => {
        if (params[config.field]) {
          query[config.field] = params[config.field]
        }
      })

      return query
    }

    const resetHandler = (): void => {
      filterFieldsConfig.forEach(config => {
        params[config.field] = ''
      })
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
      showFeedback.value = true
    }

    const renderField = (config: FilterFieldConfig) => {
      if (config.verticalOnly && props.orientation !== 'vertical') {
        return null
      }

      return (
        <div class="filter__field" key={config.field}>
          <GSelect
            v-model={params[config.field]}
            ariaLabel={config.ariaLabel}
            clearable
            label={config.label}
            modelValue={params[config.field]}
            placeholder={config.placeholder}
            options={optionsByField.value[config.field]}
          />
        </div>
      )
    }

    const renderAction = () => {
      return (
        <div class="filter__action filter__action--horizontal">
          <GButton
            color={Colors.primary}
            disabled={isSubmitDisabled.value}
            label="Найти комплекты"
            onClick={submitHandler}
          />
        </div>
      )
    }

    const renderResetAction = () => {
      if (props.orientation !== 'vertical') {
        return null
      }

      return (
        <div class="filter__action filter__action--reset">
          <GButton
            label="Сбросить фильтры"
            mode={ButtonModes.outline}
            onClick={resetHandler}
          />
        </div>
      )
    }

    const renderHeader = () => {
      return (
        <div class="filter__panel-header">
          <span class="filter__panel-header-title">Подбор по автомобилю</span>
          <span class="filter__panel-header-description">Найдите совместимую тормозную систему для вашего автомобиля</span>
        </div>
      )
    }

    const renderFooter = () => {
      return (
        <div class="filter__panel-footer">
          <a class="filter__panel-footer__content">
            <span class="filter__panel-footer__content-title">Не нашли свой автомобиль?</span>
            <GButton
              label={'Получить консультацию'}
              size={Sizes.small}
              mode={ButtonModes.outline}
              color={Colors.primary}
              onClick={callHandler}
            />
          </a>
        </div>
      )
    }

    return () =>
      <section class={{
        filter: true,
        'filter--vertical': props.orientation === 'vertical'
      }}>
        <div class="filter__panel">
          {renderHeader()}
          <div class="filter__panel-fields">
            {filterFieldsConfig.map(renderField)}
            {renderAction()}
            {renderResetAction()}
          </div>
          <GDivider />
          {renderFooter()}
        </div>
        <Feedback v-model={showFeedback.value} />
      </section>
  }
})
