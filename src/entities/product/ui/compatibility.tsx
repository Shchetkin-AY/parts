import { PropType, computed, defineComponent, onMounted } from 'vue'

import { useCatalogStore } from '@/stores'
import { Color, pluralize } from '@/utils'
import {
  type CompatibilityEntry,
  type SelectOption,
  formatPlatform,
  formatWheel,
  formatYears,
  getResultName,
  useCompatibilityBrowse,
  useCompatibilityCheck,
  useScrollFade
} from '@/utils'
import { UiButton, UiSelect } from '@/ui'

interface SelectFieldConfig {
  label: string
  placeholder: string
  ariaLabel: string
  modelValue: string
  options: SelectOption[]
  disabled: boolean
  onUpdate: (value: string) => void
}

export default defineComponent({
  name: 'Compatibility',

  props: {
    value: {
      type: Number as PropType<number>,
      required: true
    },

    title: {
      type: String as PropType<string>,
      default: 'Совместимость'
    },

    /** Название товара для текста результата, например S44C */
    productName: {
      type: String as PropType<string>,
      default: ''
    }
  },

  setup(props) {
    const className = 'compatibility'

    const catalogStore = useCatalogStore()

    const entries = computed<CompatibilityEntry[]>(() => {
      return catalogStore.getCompatibilityByGoodsId(props.value)
    })

    const totalCount = computed<number>(() => {
      return entries.value.length
    })

    const check = useCompatibilityCheck(entries)
    const browse = useCompatibilityBrowse(entries)

    const brandsFade = useScrollFade([
      browse.brandStats,
      browse.listOpen
    ])
    const mainFade = useScrollFade([
      browse.resultRows,
      browse.listOpen
    ])

    const activeBrand = computed(() => {
      return browse.resolvedActiveBrand.value
    })

    const mainState = computed(() => {
      const active = activeBrand.value
      const count = browse.resultRows.value.length

      return {
        withBrand: active === null,
        title: active ?? 'Все марки',
        countLabel: `${count} ${pluralize(count, 'поколение', 'поколения', 'поколений')}`
      }
    })

    const brandsCount = computed(() => {
      return browse.brandStats.value.length
    })

    const resultState = computed(() => {
      const entry = check.checkResult.value

      if (!entry) {
        return null
      }

      return {
        title: getResultName(entry),
        platform: formatPlatform(entry),
        wheel: formatWheel(entry),
        product: props.productName.trim()
      }
    })

    onMounted(() => {
      void catalogStore.loadCompatibility()
    })

    // ── Header ──────────────────────────────────────────

    const renderHeader = () => {
      return (
        <div class={`${className}__header`}>
          <h3 class={`${className}__header-title`}>{props.title}</h3>
        </div>
      )
    }

    // ── Check panel ─────────────────────────────────────

    const renderSelect = (config: SelectFieldConfig) => {
      return (
        <UiSelect
          ariaLabel={config.ariaLabel}
          clearable={true}
          label={config.label}
          modelValue={config.modelValue}
          placeholder={config.placeholder}
          options={config.options}
          disabled={config.disabled}
          onUpdate:modelValue={config.onUpdate}
        />
      )
    }

    const renderCheckFields = () => {
      return (
        <div class={`${className}__fields`}>
          {renderSelect({
            label: 'Марка',
            placeholder: 'Выберите марку',
            ariaLabel: 'Марка автомобиля',
            modelValue: check.selectedBrand.value,
            options: check.brandOptions.value,
            disabled: false,
            onUpdate: check.updateBrand
          })}
          {renderSelect({
            label: 'Модель',
            placeholder: 'Выберите модель',
            ariaLabel: 'Модель автомобиля',
            modelValue: check.selectedModel.value,
            options: check.modelOptions.value,
            disabled: !check.selectedBrand.value,
            onUpdate: check.updateModel
          })}
          {renderSelect({
            label: 'Год выпуска',
            placeholder: 'Выберите год выпуска',
            ariaLabel: 'Год выпуска автомобиля',
            modelValue: check.selectedYear.value,
            options: check.yearOptions.value,
            disabled: !check.selectedModel.value,
            onUpdate: check.updateYear
          })}

          <UiButton
            label="Проверить"
            color={Color.primary}
            minWidth="100%"
            disabled={!check.canCheck.value}
            onClick={check.runCheck}
          />
        </div>
      )
    }

    const renderResultPlatform = (platform: string) => {
      if (!platform) {
        return null
      }

      return <li>Платформа / поколение: {platform}</li>
    }

    const renderResult = () => {
      const state = resultState.value

      if (!state) {
        return null
      }

      return (
        <div class={`${className}__result`}>
          <div class={`${className}__result-icon`} aria-hidden="true">✓</div>
          <div class={`${className}__result-body`}>
            <p class={`${className}__result-title`}>
              Подходит для {state.title}
            </p>
            <ul class={`${className}__result-list`}>
              <li>Минимальный размер дисков: {state.wheel}</li>
              {renderResultPlatform(state.platform)}
            </ul>
          </div>
        </div>
      )
    }

    const renderCheckPanel = () => {
      return (
        <div class={`${className}__check`}>
          <div class={`${className}__check-label`}>
            Проверить по автомобилю
          </div>
          {renderCheckFields()}
          {renderResult()}
        </div>
      )
    }

    // ── Browse ──────────────────────────────────────────

    const renderToggle = () => {
      if (totalCount.value === 0) {
        return null
      }

      return (
        <button
          class={{
            [`${className}__toggle`]: true,
            [`${className}__toggle--open`]: browse.listOpen.value
          }}
          type="button"
          onClick={browse.toggleList}
        >
          <span class={`${className}__toggle-arrow`}>▸</span>
          <span>
            Посмотреть весь список совместимых поколений ({totalCount.value})
          </span>
        </button>
      )
    }

    const renderBrandCard = (
      label: string,
      count: number,
      brand: string | null,
      isActive: boolean
    ) => {
      return (
        <button
          class={{
            [`${className}__brand`]: true,
            [`${className}__brand--active`]: isActive
          }}
          type="button"
          onClick={() => browse.selectBrand(brand)}
        >
          <span class={`${className}__brand-name`}>{label}</span>
          <span class={`${className}__brand-count`}>{count}</span>
        </button>
      )
    }

    const renderBrands = () => {
      const active = activeBrand.value

      return (
        <div
          class={{
            [`${className}__scroll`]: true,
            [`${className}__scroll--more`]: brandsFade.hasMore.value
          }}
        >
          <div
            class={`${className}__scroll-viewport`}
            ref={brandsFade.viewportRef}
            onScroll={brandsFade.update}
          >
            <div class={`${className}__brands`}>
              {renderBrandCard(
                'Все марки',
                totalCount.value,
                null,
                active === null
              )}
              {browse.brandStats.value.map(stat =>
                renderBrandCard(
                  stat.brand,
                  stat.count,
                  stat.brand,
                  active === stat.brand
                ))}
            </div>
          </div>
          <div class={`${className}__scroll-fade`} aria-hidden="true" />
        </div>
      )
    }

    const renderAside = () => {
      return (
        <aside class={`${className}__aside`}>
          <div class={`${className}__aside-label`}>
            <span>Марки</span>
            <span>{brandsCount.value}</span>
          </div>
          {renderBrands()}
        </aside>
      )
    }

    const renderRowPlatform = (platform: string) => {
      if (!platform) {
        return null
      }

      return <span class={`${className}__row-gen`}>{platform}</span>
    }

    const renderRow = (
      item: CompatibilityEntry,
      index: number,
      withBrand: boolean
    ) => {
      const platform = formatPlatform(item)
      const modelLabel = withBrand
        ? `${item.brand} ${item.model}`
        : item.model

      return (
        <div
          class={`${className}__row`}
          key={`${item.brand}-${item.model}-${index}`}
        >
          <div class={`${className}__row-model`}>
            <span>{modelLabel}</span>
            {renderRowPlatform(platform)}
          </div>
          <span class={`${className}__row-years`}>{formatYears(item)}</span>
          <span class={`${className}__row-wheel`}>{formatWheel(item)}</span>
        </div>
      )
    }

    const renderTable = (rows: CompatibilityEntry[], withBrand: boolean) => {
      return (
        <div class={`${className}__table`}>
          <div class={`${className}__cols`}>
            <span>Модель / поколение</span>
            <span>Годы</span>
            <span>Мин. диск</span>
          </div>
          {rows.map((item, index) => renderRow(item, index, withBrand))}
        </div>
      )
    }

    const renderMainContent = (
      rows: CompatibilityEntry[],
      withBrand: boolean
    ) => {
      if (rows.length === 0) {
        return (
          <div class={`${className}__main-empty`}>
            Нет моделей по этому запросу
          </div>
        )
      }

      return renderTable(rows, withBrand)
    }

    const renderMain = () => {
      const rows = browse.resultRows.value
      const state = mainState.value

      return (
        <div class={`${className}__main`}>
          <div class={`${className}__main-head`}>
            <span class={`${className}__main-title`}>{state.title}</span>
            <span class={`${className}__main-count`}>{state.countLabel}</span>
          </div>
          <div
            class={{
              [`${className}__scroll`]: true,
              [`${className}__scroll--more`]: mainFade.hasMore.value
            }}
          >
            <div
              class={`${className}__scroll-viewport`}
              ref={mainFade.viewportRef}
              onScroll={mainFade.update}
            >
              {renderMainContent(rows, state.withBrand)}
            </div>
            <div class={`${className}__scroll-fade`} aria-hidden="true" />
          </div>
        </div>
      )
    }

    const renderBrowse = () => {
      if (!browse.listOpen.value) {
        return null
      }

      return (
        <div class={`${className}__browse`}>
          {renderAside()}
          {renderMain()}
        </div>
      )
    }

    const renderEmpty = () => {
      if (catalogStore.isCompatibilityLoading) {
        return (
          <div class={`${className}__empty`}>
            Загрузка…
          </div>
        )
      }

      return (
        <div class={`${className}__empty`}>
          <p class={`${className}__empty-title`}>Данные пока не добавлены</p>
          <p class={`${className}__empty-text`}>
            Для этого товара нет списка совместимости. Уточните у менеджера,
            подходит ли комплект к вашему автомобилю.
          </p>
        </div>
      )
    }

    const renderBody = () => {
      if (catalogStore.isCompatibilityLoading || totalCount.value === 0) {
        return renderEmpty()
      }

      return (
        <>
          {renderCheckPanel()}
          {renderToggle()}
          {renderBrowse()}
        </>
      )
    }

    return () => {
      return (
        <section class={className}>
          {renderHeader()}
          {renderBody()}
        </section>
      )
    }
  }
})
