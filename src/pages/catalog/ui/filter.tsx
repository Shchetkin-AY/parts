import { Fragment, PropType, computed, defineComponent, onBeforeMount, ref, watch } from 'vue'
import { ButtonMode, CatalogFilterParams, CatalogItem, Color, FilterFieldProps, FilterFields, Size, pluralize, useCatalogFilterFields } from '@/utils'
import { UiButton, UiDialog, UiDivider, UiSelect } from '@/ui'
import { useCatalogStore, useViewportStore } from '@/stores'
import Feedback from '@/features/feedback'

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

  emits: [ 'submit' ],

  setup(props, { emit }) {
    const viewportStore = useViewportStore()
    const catalogStore = useCatalogStore()

    const showFeedback = ref(false)
    const showDialog = ref<boolean>(false)

    const className = 'catalog-filter'

    const isMobile = computed(() => viewportStore.size.width < 1024)

    const { params, optionsByField, filteredItems, reset } = useCatalogFilterFields(
      FilterFields,
      () => props.items,
      () => props.initialParams
    )

    const itemsCount = computed<string>(() => {
      return [
        filteredItems.value.length,
        pluralize(filteredItems.value.length, 'товар', 'товара', 'товаров')
      ].join(' ')
    })

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

    onBeforeMount(async () => {
      await catalogStore.loadCompatibility()
    })

    const submitHandler = (): void => {
      emit('submit', {
        items: filteredItems.value,
        params: { ...params }
      })
      showDialog.value = false
    }

    const resetHandler = (): void => {
      reset()
    }

    const renderHeaderTitle = () => {
      return <span class={`${className}__header-title`}>Подбор по параметрам</span>
    }
    const renderHeaderDescription = () => {
      return <span class={`${className}__header-description`}>Найдите совместимую тормозную систему для вашего автомобиля</span>
    }
    const renderHeader = () => {
      return (
        <div class={`${className}__header`}>
          {renderHeaderTitle()}
          {renderHeaderDescription()}
        </div>
      )
    }

    const renderField = (config: FilterFieldProps) => {
      return (
        <UiSelect
          v-model={params[config.field]}
          ariaLabel={config.ariaLabel}
          clearable
          label={config.label}
          modelValue={params[config.field]}
          placeholder={config.placeholder}
          options={optionsByField.value[config.field]}
        />
      )
    }

    const renderFields = () => {
      return (
        <div class={`${className}__fields`}>
          {FilterFields.map(renderField)}
          {renderResetButton()}
        </div>
      )
    }

    const renderResetButton = () => {
      return (
        <UiButton
          label="Сбросить фильтры"
          mode={ButtonMode.flat}
          color={Color.muted}
          onClick={resetHandler}
        />
      )
    }
    const renderDialogCloseButton = () => {
      return (
        <UiButton
          class={`${className}__action-close`}
          label="Закрыть"
          mode={ButtonMode.flat}
          color={Color.muted}
          onClick={() => showDialog.value = false}
        />
      )
    }

    const renderSubmitButton = () => {
      return (
        <UiButton
          class={`${className}__action-submit`}
          label={`Показать ${itemsCount.value}`}
          color={Color.primary}
          disabled={filteredItems.value.length === 0}
          onClick={submitHandler}
        />
      )
    }

    const renderFilterAction = () => {
      if (isMobile.value) {
        return (
          <div class={`${className}__actions`} >
            {renderDialogCloseButton()}
            {renderSubmitButton()}
          </div>
        )
      }
    }

    const renderFooter = () => {
      return (
        <div class={`${className}__footer`} >
          <div class={`${className}__footer-content`} >
            <span class={`${className}__footer-title`}>Не нашли свой автомобиль?</span>
            <UiButton
              label="Получить консультацию"
              size={Size.small}
              color={Color['surface-3']}
              onClick={() => showFeedback.value = true}/>
          </div>
        </div>
      )
    }

    const renderDialog = () => {
      const dialogSlots = {
        default: () => renderFields(),
        footer: () => renderFilterAction()
      }

      return (
        <UiDialog
          v-slots={dialogSlots}
          v-model={showDialog.value}
          title={'Подбор по параметрам'}
        />
      )
    }

    return () => {
      if (isMobile.value) {
        return (
          <Fragment>
            <UiButton
              label={'Фильтр'}
              size={Size.small}
              mode={ButtonMode.outline}
              color={Color.muted}
              onClick={() => showDialog.value = true}
            />
            {renderDialog()}
          </Fragment>
        )
      }

      return (
        <section class={className}>
          {renderHeader()}
          {renderFields()}
          {renderFilterAction()}
          <UiDivider />
          {renderFooter()}
          <Feedback v-model={showFeedback.value} />
        </section>
      )
    }
  }
})
