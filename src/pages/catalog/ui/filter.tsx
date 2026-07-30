import { PropType, computed, defineComponent, ref, watch } from 'vue'
import { ButtonMode, CatalogFilterField, CatalogFilterParams, CatalogFilterSubmitPayload, CatalogItem, Color, FilterFieldConfig, Size, useCatalogFilterFields } from '@/utils'
import { UiButton, UiDialog, UiDivider, UiSelect } from '@/ui'
import { useViewportStore } from '@/stores'
import Feedback from '@/features/feedback'

const mobileBreakpoint = 1024

const fieldsConfig: FilterFieldConfig[] = [
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
    placeholder: 'Выберите серию'
  },
  {
    field: CatalogFilterField.wheelDiameter,
    label: 'Диаметр колёс',
    ariaLabel: 'Диаметр колёс',
    placeholder: 'Выберите диаметр колёс'
  },
  {
    field: CatalogFilterField.diameter,
    label: 'Диаметр диска',
    ariaLabel: 'Диаметр диска',
    placeholder: 'Выберите диаметр диска'
  }
]

export default defineComponent({
  name: 'CatalogFilter',

  props: {
    initialParams: {
      type: Object as PropType<Partial<CatalogFilterParams>>,
      default: () => ({})
    },
    items: {
      type: Array as PropType<CatalogItem[]>,
      required: true
    }
  },

  emits: [ 'change', 'submit' ],

  setup(props, { emit }) {
    const viewportStore = useViewportStore()
    const showFeedback = ref(false)
    const isSheetOpen = ref(false)

    const isMobile = computed(() => viewportStore.size.width < mobileBreakpoint)

    const { params, optionsByField, filteredItems, reset } = useCatalogFilterFields(
      fieldsConfig,
      () => props.items,
      () => props.initialParams
    )

    const activeCount = computed(() => Object.values(params).filter(Boolean).length)

    watch(
      () => filteredItems.value,
      items => emit('change', {
        items,
        params: { ...params }
      } satisfies CatalogFilterSubmitPayload<CatalogItem>),
      { immediate: true }
    )

    // мгновенное применение — только десктопный сайдбар
    watch(
      () => ({ ...params }),
      () => {
        if (isMobile.value) {
          return
        }
        emit('submit', {
          items: filteredItems.value,
          params: { ...params }
        })
      },
      { deep: true }
    )

    const submitHandler = (): void => {
      emit('submit', {
        items: filteredItems.value,
        params: { ...params }
      })
      isSheetOpen.value = false
    }

    const resetHandler = (): void => {
      reset()
      if (!isMobile.value) {
        emit('submit', {
          items: filteredItems.value,
          params: { ...params }
        })
      }
    }

    const renderField = (config: FilterFieldConfig) =>
      <div class="filter__field" key={config.field}>
        <UiSelect
          v-model={params[config.field]}
          ariaLabel={config.ariaLabel}
          clearable
          label={config.label}
          modelValue={params[config.field]}
          placeholder={config.placeholder}
          options={optionsByField.value[config.field]}
        />
      </div>

    const renderPanel = () =>
      <div class="filter__panel">
        <div class="filter__panel-header">
          <span class="filter__panel-header-title">Подбор по автомобилю</span>
          <span class="filter__panel-header-description">Найдите совместимую тормозную систему для вашего автомобиля</span>
        </div>
        <div class="filter__panel-fields">
          {fieldsConfig.map(renderField)}
          {isMobile.value &&
            <div class="filter__action filter__action--horizontal">
              <UiButton
                color={Color.primary}
                disabled={filteredItems.value.length === 0}
                label={`Показать ${filteredItems.value.length} товаров`}
                onClick={submitHandler}
              />
            </div>
          }
          <div class="filter__action filter__action--reset">
            <UiButton label="Сбросить фильтры" mode={ButtonMode.outline} onClick={resetHandler} />
          </div>
        </div>
        <UiDivider />
        <div class="filter__panel-footer">
          <a class="filter__panel-footer__content" onClick={() => showFeedback.value = true}>
            <span class="filter__panel-footer__content-title">Не нашли свой автомобиль?</span>
            <UiButton label="Получить консультацию" size={Size.small} mode={ButtonMode.outline} color={Color.primary} />
          </a>
        </div>
      </div>

    return () => {
      if (isMobile.value) {
        return (
          <div class="filter filter--sheet">
            <button class="filter__trigger" onClick={() => isSheetOpen.value = true}>
              <i class="ti ti-adjustments-horizontal" aria-hidden="true" />
              Фильтры
              {activeCount.value > 0 && <span class="filter__trigger-count">{activeCount.value}</span>}
            </button>
            <UiDialog v-model={isSheetOpen.value} maxWidth={420}>
              {renderPanel()}
            </UiDialog>
            <Feedback v-model={showFeedback.value} />
          </div>
        )
      }

      return (
        <section class="filter filter--vertical">
          {renderPanel()}
          <Feedback v-model={showFeedback.value} />
        </section>
      )
    }
  }
})
