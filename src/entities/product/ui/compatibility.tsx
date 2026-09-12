import {
  PropType,
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import { useCatalogStore } from '@/stores'
import { Color, pluralize } from '@/utils'
import { UiButton, UiSelect, UiTextField } from '@/ui'

/** Совпадает с CompatibilityEntry в catalog store */
export interface CompatibilityEntry {
  brand: string
  model: string
  platform?: string
  yearFrom: number | null
  yearTo: number | null
  wheelInch: number | null
}

interface BrandStat {
  brand: string
  count: number
}

interface SelectOption {
  label: string
  value: string
}

interface GenerationOption extends SelectOption {
  entry: CompatibilityEntry
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

    const selectedBrand = ref('')
    const selectedModel = ref('')
    const selectedGeneration = ref('')
    const searchQuery = ref('')

    const listOpen = ref(false)
    const activeBrand = ref<string | null>(null)
    const checkResult = ref<CompatibilityEntry | null>(null)

    const brandsViewportRef = ref<HTMLElement | null>(null)
    const mainViewportRef = ref<HTMLElement | null>(null)
    const brandsHasMore = ref(false)
    const mainHasMore = ref(false)

    const formatYears = (item: CompatibilityEntry): string => {
      const from = item.yearFrom
      const to = item.yearTo

      if (from == null && to == null) {
        return '—'
      }

      if (from != null && to != null) {
        if (from === to) {
          return String(from)
        }

        return `${from}–${to}`
      }

      if (from != null) {
        return `с ${from}`
      }

      return `по ${to}`
    }

    const formatPlatform = (item: CompatibilityEntry): string => {
      const value = item.platform?.trim()

      if (!value || value === '-' || value === '—') {
        return ''
      }

      return value.replace(/,\s*/g, ' · ')
    }

    const formatWheel = (item: CompatibilityEntry): string => {
      if (item.wheelInch == null) {
        return '—'
      }

      return `от R${item.wheelInch}″`
    }

    onMounted(() => {
      void catalogStore.loadCompatibility()
      window.addEventListener('resize', updateFades)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateFades)
    })

    const entries = computed<CompatibilityEntry[]>(() => {
      return catalogStore.getCompatibilityByGoodsId(props.value)
    })

    const totalCount = computed(() => entries.value.length)

    // ── Cascade options ─────────────────────────────────

    const brandOptions = computed<SelectOption[]>(() => {
      const set = new Set<string>()

      for (const item of entries.value) {
        const brand = item.brand?.trim()
        if (brand) {
          set.add(brand)
        }
      }

      return Array.from(set)
        .sort((a, b) => a.localeCompare(b, 'ru'))
        .map(value => ({
          label: value,
          value
        }))
    })

    const modelOptions = computed<SelectOption[]>(() => {
      if (!selectedBrand.value) {
        return []
      }

      const set = new Set<string>()

      for (const item of entries.value) {
        if (item.brand === selectedBrand.value && item.model?.trim()) {
          set.add(item.model.trim())
        }
      }

      return Array.from(set)
        .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }))
        .map(value => ({
          label: value,
          value
        }))
    })

    const generationOptions = computed<GenerationOption[]>(() => {
      if (!selectedBrand.value || !selectedModel.value) {
        return []
      }

      return entries.value
        .filter(item =>
          item.brand === selectedBrand.value &&
          item.model === selectedModel.value)
        .map((entry, index) => {
          const platform = entry.platform?.trim()
          const years = formatYears(entry)
          const hasPlatform = platform && platform !== '-' && platform !== '—'

          const label = hasPlatform
            ? `${platform} · ${years}`
            : years

          return {
            label,
            value: String(index),
            entry
          }
        })
    })

    const canCheck = computed(() => {
      return Boolean(
        selectedBrand.value &&
        selectedModel.value &&
        selectedGeneration.value !== ''
      )
    })

    // ── Browse list ─────────────────────────────────────

    const brandStats = computed<BrandStat[]>(() => {
      const map = new Map<string, number>()

      for (const item of entries.value) {
        const brand = item.brand?.trim()
        if (!brand) {
          continue
        }

        map.set(brand, (map.get(brand) ?? 0) + 1)
      }

      return Array.from(map.entries())
        .map(([ brand, count ]) => ({
          brand,
          count
        }))
        .sort((a, b) => a.brand.localeCompare(b.brand, 'ru'))
    })

    const query = computed(() => searchQuery.value.trim().toLowerCase())

    const matchEntry = (item: CompatibilityEntry, q: string): boolean => {
      const haystack = [
        item.brand,
        item.model,
        item.platform ?? '',
        item.yearFrom ?? '',
        item.yearTo ?? '',
        item.wheelInch ?? ''
      ].join(' ').toLowerCase()

      return haystack.includes(q)
    }

    const filteredBrandStats = computed<BrandStat[]>(() => {
      const q = query.value

      if (!q) {
        return brandStats.value
      }

      return brandStats.value
        .map(stat => {
          const brandMatch = stat.brand.toLowerCase().includes(q)
          const count = brandMatch
            ? entries.value.filter(item => item.brand === stat.brand).length
            : entries.value.filter(item =>
              item.brand === stat.brand && matchEntry(item, q)).length

          if (count === 0) {
            return null
          }

          return {
            brand: stat.brand,
            count
          }
        })
        .filter((stat): stat is BrandStat => stat !== null)
    })

    const resultRows = computed<CompatibilityEntry[]>(() => {
      let rows = entries.value

      if (activeBrand.value) {
        rows = rows.filter(item => item.brand === activeBrand.value)
      }

      const q = query.value
      if (q) {
        rows = rows.filter(item => matchEntry(item, q))
      }

      return rows
    })

    const allFilterCount = computed(() => {
      if (!query.value) {
        return totalCount.value
      }

      return entries.value.filter(item => matchEntry(item, query.value)).length
    })

    const resolvedActiveBrand = computed(() => {
      if (activeBrand.value === null) {
        return null
      }

      const stillVisible = filteredBrandStats.value.some(
        stat => stat.brand === activeBrand.value
      )

      return stillVisible ? activeBrand.value : null
    })

    // ── Actions ─────────────────────────────────────────

    const onBrandUpdate = (value: string) => {
      selectedBrand.value = value
      selectedModel.value = ''
      selectedGeneration.value = ''
      checkResult.value = null
    }

    const onModelUpdate = (value: string) => {
      selectedModel.value = value
      selectedGeneration.value = ''
      checkResult.value = null
    }

    const onGenerationUpdate = (value: string) => {
      selectedGeneration.value = value
      checkResult.value = null
    }

    const onSearchUpdate = (value: string) => {
      searchQuery.value = value

      if (value.trim().length >= 2 && !listOpen.value) {
        listOpen.value = true
      }
    }

    const runCheck = () => {
      const option = generationOptions.value.find(
        item => item.value === selectedGeneration.value
      )

      checkResult.value = option?.entry ?? null
    }

    const resetCheck = () => {
      selectedBrand.value = ''
      selectedModel.value = ''
      selectedGeneration.value = ''
      checkResult.value = null
    }

    const toggleList = () => {
      listOpen.value = !listOpen.value
    }

    const selectBrandFilter = (brand: string | null) => {
      activeBrand.value = brand
    }

    // ── Fade scroll ─────────────────────────────────────

    const updateFade = (el: HTMLElement | null): boolean => {
      if (!el) {
        return false
      }

      const canScroll = el.scrollHeight > el.clientHeight + 1
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4

      return canScroll && !atBottom
    }

    const updateFades = () => {
      brandsHasMore.value = updateFade(brandsViewportRef.value)
      mainHasMore.value = updateFade(mainViewportRef.value)
    }

    watch(
      [ resultRows, filteredBrandStats, listOpen ],
      () => {
        void nextTick(() => updateFades())
      }
    )

    // ── Render ──────────────────────────────────────────

    const renderHeader = () => {
      return (
        <div class={`${className}__header`}>
          <h3 class={`${className}__header-title`}>{props.title}</h3>
        </div>
      )
    }

    const renderSelect = (
      label: string,
      ariaLabel: string,
      modelValue: string,
      options: SelectOption[],
      disabled: boolean,
      onUpdate: (value: string) => void
    ) => {
      return (
        <div class={`${className}__field`}>
          <UiSelect
            ariaLabel={ariaLabel}
            clearable={true}
            label={label}
            modelValue={modelValue}
            placeholder={label}
            options={options}
            disabled={disabled}
            onUpdate:modelValue={onUpdate}
          />
        </div>
      )
    }

    const renderCheckFields = () => {
      return (
        <div class={`${className}__fields`}>
          {renderSelect(
            'Марка',
            'Марка автомобиля',
            selectedBrand.value,
            brandOptions.value,
            false,
            onBrandUpdate
          )}
          {renderSelect(
            'Модель',
            'Модель автомобиля',
            selectedModel.value,
            modelOptions.value,
            !selectedBrand.value,
            onModelUpdate
          )}
          {renderSelect(
            'Поколение / год',
            'Поколение или год',
            selectedGeneration.value,
            generationOptions.value,
            !selectedModel.value,
            onGenerationUpdate
          )}
          <div class={`${className}__submit`}>
            <UiButton
              label="Проверить"
              color={Color.primary}
              minWidth="100%"
              disabled={!canCheck.value}
              onClick={runCheck}
            />
          </div>
        </div>
      )
    }

    const renderSearch = () => {
      return (
        <div class={`${className}__search`}>
          <UiTextField
            ariaLabel="Поиск по марке или модели"
            label=""
            modelValue={searchQuery.value}
            placeholder="Например, BMW 3 Series или Audi A4"
            clearable={true}
            required={false}
            onUpdate:modelValue={onSearchUpdate}
          />
        </div>
      )
    }

    const renderResultLead = (product: string) => {
      if (!product) {
        return null
      }

      return (
        <p class={`${className}__result-lead`}>
          Комплект {product} устанавливается без модификаций.
        </p>
      )
    }

    const renderResultPlatform = (platform: string) => {
      if (!platform) {
        return null
      }

      return <li>Платформа / поколение: {platform}</li>
    }

    const getResultName = (entry: CompatibilityEntry): string => {
      const years = formatYears(entry)
      const nameParts = [ entry.brand, entry.model, formatPlatform(entry) ]

      if (years !== '—') {
        nameParts.push(`(${years})`)
      }

      return nameParts.filter(Boolean).join(' ')
    }

    const renderResult = () => {
      const entry = checkResult.value
      if (!entry) {
        return null
      }

      const platform = formatPlatform(entry)
      const product = props.productName.trim()

      return (
        <div class={`${className}__result`}>
          <div class={`${className}__result-icon`} aria-hidden="true">✓</div>
          <div class={`${className}__result-body`}>
            <p class={`${className}__result-title`}>
              Подходит для {getResultName(entry)}
            </p>
            {renderResultLead(product)}
            <ul class={`${className}__result-list`}>
              <li>Минимальный размер дисков: {formatWheel(entry)}</li>
              {renderResultPlatform(platform)}
            </ul>
          </div>
          <button
            class={`${className}__result-reset`}
            type="button"
            onClick={resetCheck}
          >
            Изменить
          </button>
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
          <div class={`${className}__divider`}>
            <span>или найдите по названию</span>
          </div>
          {renderSearch()}
          {renderResult()}
        </div>
      )
    }

    const renderToggle = () => {
      if (totalCount.value === 0) {
        return null
      }

      return (
        <button
          class={{
            [`${className}__toggle`]: true,
            [`${className}__toggle--open`]: listOpen.value
          }}
          type="button"
          onClick={toggleList}
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
          onClick={() => selectBrandFilter(brand)}
        >
          <span class={`${className}__brand-name`}>{label}</span>
          <span class={`${className}__brand-count`}>{count}</span>
        </button>
      )
    }

    const renderBrands = () => {
      const active = resolvedActiveBrand.value
      const list = filteredBrandStats.value

      return (
        <div
          class={{
            [`${className}__scroll`]: true,
            [`${className}__scroll--more`]: brandsHasMore.value
          }}
        >
          <div
            class={`${className}__scroll-viewport`}
            ref={brandsViewportRef}
            onScroll={updateFades}
          >
            <div class={`${className}__brands`}>
              {renderBrandCard(
                'Все марки',
                allFilterCount.value,
                null,
                active === null
              )}
              {list.map(stat =>
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
            <span>{filteredBrandStats.value.length}</span>
          </div>
          {renderBrands()}
        </aside>
      )
    }

    const renderRow = (item: CompatibilityEntry, index: number, withBrand: boolean) => {
      const platform = formatPlatform(item)
      const modelLabel = withBrand
        ? `${item.brand} ${item.model}`
        : item.model

      return (
        <div class={`${className}__row`} key={`${item.brand}-${item.model}-${index}`}>
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

    const renderRowPlatform = (platform: string) => {
      if (!platform) {
        return null
      }

      return <span class={`${className}__row-gen`}>{platform}</span>
    }

    const renderMainContent = (rows: CompatibilityEntry[], withBrand: boolean) => {
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
      const active = resolvedActiveBrand.value
      const rows = resultRows.value
      const withBrand = active === null
      const title = active ?? 'Все марки'
      const countLabel = `${rows.length} ${pluralize(rows.length, 'поколение', 'поколения', 'поколений')}`

      return (
        <div class={`${className}__main`}>
          <div class={`${className}__main-head`}>
            <span class={`${className}__main-title`}>{title}</span>
            <span class={`${className}__main-count`}>{countLabel}</span>
          </div>
          <div
            class={{
              [`${className}__scroll`]: true,
              [`${className}__scroll--more`]: mainHasMore.value
            }}
          >
            <div
              class={`${className}__scroll-viewport`}
              ref={mainViewportRef}
              onScroll={updateFades}
            >
              {renderMainContent(rows, withBrand)}
            </div>
            <div class={`${className}__scroll-fade`} aria-hidden="true" />
          </div>
        </div>
      )
    }

    const renderBrowse = () => {
      if (!listOpen.value) {
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
