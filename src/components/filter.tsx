import { PropType, computed, defineComponent, onBeforeMount, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ButtonModes, CatalogFilterField, type CatalogFilterParams, type CatalogFilterSubmitPayload, type CatalogItem, Colors, type SelectOption, Sizes } from '@/utils'
import { GButton, GDivider, GSelect } from '@/components'
import { useCatalogStore } from '@/stores/catalog'
import Feedback from './feedback'

type FilterOrientation = 'horizontal' | 'vertical'

const emptyFilterParams: CatalogFilterParams = {
  [CatalogFilterField.diameter]: '',
  [CatalogFilterField.mark]: '',
  [CatalogFilterField.model]: '',
  [CatalogFilterField.series]: ''
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

    const params = reactive<CatalogFilterParams>({
      ...emptyFilterParams
    })

    const sourceItems = computed(() => {
      return props.items.length > 0 ? props.items : catalogStore.compatibleItems
    })

    const resolveInitialParams = (): CatalogFilterParams => {
      return {
        [CatalogFilterField.diameter]: normalizeFilterValue(props.initialParams?.[CatalogFilterField.diameter] ?? ''),
        [CatalogFilterField.mark]: normalizeFilterValue(props.initialParams?.[CatalogFilterField.mark] ?? ''),
        [CatalogFilterField.model]: normalizeFilterValue(props.initialParams?.[CatalogFilterField.model] ?? ''),
        [CatalogFilterField.series]: normalizeFilterValue(props.initialParams?.[CatalogFilterField.series] ?? '')
      }
    }

    const getFilteredItems = (excludedField?: CatalogFilterField): CatalogItem[] => {
      return catalogStore.filterItems(params, sourceItems.value, excludedField)
    }

    const getUniqueOptions = (field: CatalogFilterField) => {
      return catalogStore.getFilterOptions(field, params, sourceItems.value)
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
    const seriesOptions = computed(() => {
      return getUniqueOptions(CatalogFilterField.series)
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
      params[CatalogFilterField.series] = resolvedParams[CatalogFilterField.series]
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
    watch(
      () => seriesOptions.value,
      options => syncParamByOptions(CatalogFilterField.series, options),
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

    onBeforeMount(() => {
      catalogStore.load()
    })

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
      if (params[CatalogFilterField.series]) {
        query[CatalogFilterField.series] = params[CatalogFilterField.series]
      }

      return query
    }

    const resetHandler = (): void => {
      params[CatalogFilterField.diameter] = ''
      params[CatalogFilterField.mark] = ''
      params[CatalogFilterField.model] = ''
      params[CatalogFilterField.series] = ''
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
    const renderSeriesSelect = () => {
      if (props.orientation !== 'vertical') {
        return null
      }

      return (
        <div class="filter__field">
          <GSelect
            v-model={params[CatalogFilterField.series]}
            ariaLabel="Серия"
            clearable
            label="Серия"
            modelValue={params[CatalogFilterField.series]}
            placeholder="Выберите серию"
            options={seriesOptions.value}
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
          Найдите совместимую тормозную систему для вашего автомобиля
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

    const renderFeedback = () => {
      return (
        <Feedback v-model={showFeedback.value}/>
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
      <section
        class={{
          filter: true,
          'filter--vertical': props.orientation === 'vertical'
        }}
      >
        <div class="filter__panel">
          {renderHeader()}
          <div class="filter__panel-fields">
            {renderMarkSelect()}
            {renderModelSelect()}
            {renderSeriesSelect()}
            {renderDiameterSelect()}
            {renderAction()}
            {renderResetAction()}
          </div>
          {renderDivider()}
          {renderFooter()}
        </div>
        {renderFeedback()}
      </section>
  }
})
