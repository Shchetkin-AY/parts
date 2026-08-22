import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores'
import { UiButton, UiDivider, UiSelect } from '@/ui'
import Feedback from '@/features/feedback'

import { ButtonMode, CatalogFilterField, Color, FilterFieldProps, Size, buildCatalogFilterQuery, useCatalogFilterFields } from '@/utils'

const fieldsConfig: FilterFieldProps[] = [
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
    field: CatalogFilterField.wheelDiameter,
    label: 'Диаметр колёс',
    ariaLabel: 'Диаметр колёс',
    placeholder: 'Выберите диаметр колёс'
  }
]

export default defineComponent({
  name: 'VehicleFinder',

  setup() {
    const router = useRouter()
    const catalogStore = useCatalogStore()

    const { params, optionsByField, filteredItems } = useCatalogFilterFields(
      fieldsConfig,
      () => catalogStore.compatibleItems
    )

    const className = 'home-filter'

    onBeforeMount(async () => {
      await catalogStore.loadCatalog()
      await catalogStore.loadCompatibility()
    })

    const showFeedback = ref(false)

    const submitHandler = (): void => {
      const query = buildCatalogFilterQuery(params)

      router.push(
        Object.keys(query).length === 0
          ? { name: 'catalog' }
          : {
            name: 'catalog',
            query
          }
      )
    }

    const renderHeaderTitle = () => {
      return <span class={`${className}__header-title`}>Подбор по автомобилю</span>
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

    const renderField = (config: FilterFieldProps) =>
      <div class={`${className}__field`} key={config.field}>
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

    const renderFields = () => {
      return fieldsConfig.map(field => {
        return renderField(field)
      })
    }

    const renderSubmitButton = () => {
      return (
        <div class={`${className}__submit`}>
          <UiButton
            color={Color.primary}
            label="Найти комплекты"
            minWidth={'100%'}
            disabled={filteredItems.value.length === 0}
            onClick={submitHandler}
          />
        </div>
      )
    }

    const renderFooter = () => {
      return (
        <div class={`${className}__footer`} >
          <div class={`${className}__footer-content`} >
            <span class={`${className}__footer-title`}>Не нашли свой автомобиль?</span>
            <UiButton label="Получить консультацию" size={Size.small} mode={ButtonMode.outline} color={Color.primary} onClick={() => showFeedback.value = true}/>
          </div>
        </div>
      )
    }

    const renderFeedback = () => {
      return <Feedback v-model={showFeedback.value} />
    }

    return () =>
      <div class={className}>
        {renderHeader()}
        <div class={`${className}__fields`}>
          {renderFields()}
          {renderSubmitButton()}

        </div>
        <UiDivider />
        {renderFooter()}
        {renderFeedback()}
      </div>
  }
})
