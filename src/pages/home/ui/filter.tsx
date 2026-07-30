import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores'
import { UiButton, UiDivider, UiSelect } from '@/ui'
import Feedback from '@/features/feedback'

import { ButtonMode, CatalogFilterField, Color, FilterFieldConfig, Size, buildCatalogFilterQuery, useCatalogFilterFields } from '@/utils'

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
    field: CatalogFilterField.diameter,
    label: 'Диаметр диска',
    ariaLabel: 'Диаметр диска',
    placeholder: 'Выберите диаметр диска'
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

    return () =>
      <div class="filter">
        <div class="filter__panel">
          <div class="filter__panel-header">
            <span class="filter__panel-header-title">Подбор по автомобилю</span>
            <span class="filter__panel-header-description">Найдите совместимую тормозную систему для вашего автомобиля</span>
          </div>
          <div class="filter__panel-fields">
            {fieldsConfig.map(renderField)}
            <div class="filter__action filter__action--horizontal">
              <UiButton
                color={Color.primary}
                disabled={filteredItems.value.length === 0}
                label="Найти комплекты"
                onClick={submitHandler}
              />
            </div>
          </div>
          <UiDivider />
          <div class="filter__panel-footer">
            <div class="filter__panel-footer__content" >
              <span class="filter__panel-footer__content-title">Не нашли свой автомобиль?</span>
              <UiButton label="Получить консультацию" size={Size.small} mode={ButtonMode.outline} color={Color.primary} onClick={() => showFeedback.value = true}/>
            </div>
          </div>
        </div>
        <Feedback v-model={showFeedback.value} />
      </div>
  }
})
