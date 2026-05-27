import { type VNode, computed, defineComponent, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { CatalogItem, formatPrice, getString } from '@/utils'
import catalog from './catalog'

const placeholderImage = '/kit.png'

interface InfoRow {
  label: string
  value: string | number | undefined
}

interface KitPart {
  label: string
}

type ProductTab = 'catalog' | 'compatibility' | 'construction' | 'kit' | 'specs'

interface ProductTabItem {
  id: ProductTab
  label: string
}

const kitParts: KitPart[] = [
  { label: 'Суппорт' },
  { label: 'Тормозной диск' },
  { label: 'Колодки' },
  { label: 'Адаптеры' },
  { label: 'Шланги' }
]

const productTabs: ProductTabItem[] = [
  {
    id: 'specs',
    label: 'Характеристики'
  },
  {
    id: 'compatibility',
    label: 'Совместимость'
  },
  {
    id: 'construction',
    label: 'Конструкция'
  },
  {
    id: 'kit',
    label: 'Комплектация'
  },
  {
    id: 'catalog',
    label: 'Каталог'
  }
]

const hasValue = (value: string | number | undefined): value is string | number => {
  return value !== undefined && value !== ''
}
const getNumber = (value: string | number | undefined): number | undefined => {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) {
    return undefined
  }

  return numberValue
}
const formatCny = (value: string | number | undefined): string | undefined => {
  const numberValue = getNumber(value)

  if (numberValue === undefined) {
    return undefined
  }

  return `¥ ${numberValue.toLocaleString('en-US')}`
}

interface ScoredItem { item: CatalogItem;
  score: number }

export default defineComponent({
  name: 'SingleProductPage',

  setup() {
    const route = useRoute()
    const baseClass = 'single'
    const activeTab = ref<ProductTab>('specs')

    const resolvedItem = computed<CatalogItem | undefined>(() => {
      const id = String(route.params.id ?? '')

      return catalog.find((item: CatalogItem) => {
        return String(item.id) === id
      })
    })
    const productSeries = computed(() => {
      const item = resolvedItem.value

      return [ getString(item?.brand), getString(item?.series) ].filter(Boolean).join(' ') || 'Тормозной комплект'
    })
    const productModel = computed(() => {
      return getString(resolvedItem.value?.model) ?? ''
    })
    const productPrice = computed(() => {
      return formatPrice(resolvedItem.value?.priceUsd ?? '')
    })
    const maxWheelDiameter = computed(() => {
      const diameters = catalog.map((item: CatalogItem) => {
        return getNumber(item.wheelDiameterInch)
      }).filter((diameter: number | undefined): diameter is number => {
        return diameter !== undefined
      })

      if (diameters.length === 0) {
        return undefined
      }

      return Math.max(...diameters)
    })
    const wheelDiameterRange = computed(() => {
      const diameter = getNumber(resolvedItem.value?.wheelDiameterInch)

      if (!diameter) {
        return undefined
      }

      if (!maxWheelDiameter.value || diameter >= maxWheelDiameter.value) {
        return `R${diameter}`
      }

      return `R${diameter}-R${maxWheelDiameter.value}`
    })
    const statRows = computed<InfoRow[]>(() => {
      const item = resolvedItem.value

      return [
        {
          label: 'Количество поршней',
          value: item?.pistonCount ? `${item.pistonCount} шт.` : undefined
        },
        {
          label: 'Диаметр диска',
          value: item?.discDiameterMm ? `${item.discDiameterMm} мм` : undefined
        },
        {
          label: 'Применяемость',
          value: item?.application
        },
        {
          label: 'Совместимость',
          value: wheelDiameterRange.value
        }
      ].filter(row => {
        return hasValue(row.value)
      })
    })
    const specRows = computed<InfoRow[]>(() => {
      const item = resolvedItem.value

      return [
        {
          label: 'Количество поршней',
          value: item?.pistonCount ? `${item.pistonCount} шт.` : undefined
        },
        {
          label: 'Диаметр колес',
          value: wheelDiameterRange.value
        },
        {
          label: 'Габариты суппорта',
          value: item?.dimensionsMm
        },
        {
          label: 'Диаметр диска',
          value: item?.discDiameterMm ? `${item.discDiameterMm} мм` : undefined
        },
        {
          label: 'Площадь колодок',
          value: item?.padFrictionArea ? `${item.padFrictionArea} мм²` : undefined
        },
        {
          label: 'Площадь поршней',
          value: item?.pistonAreaCm2 ? `${item.pistonAreaCm2} см²` : undefined
        },
        {
          label: 'Применяемость',
          value: item?.application
        }
      ].filter(row => {
        return hasValue(row.value)
      })
    })
    const compatibilityRows = computed<InfoRow[]>(() => {
      const item = resolvedItem.value
      const vehicle = [ getString(item?.vehicleBrand), getString(item?.vehicleModel) ].filter(Boolean).join(' / ')

      return [
        {
          label: 'Автомобиль',
          value: vehicle || 'Совместимость уточняется'
        },
        {
          label: 'Класс совместимости',
          value: item?.compatibilityClass
        },
        {
          label: 'Заводской диск',
          value: item?.factoryDiscDiameterMm ? `${item.factoryDiscDiameterMm} мм` : undefined
        },
        {
          label: 'Назначение',
          value: item?.application
        }
      ].filter(row => {
        return hasValue(row.value)
      })
    })
    const constructionRows = computed<InfoRow[]>(() => {
      const item = resolvedItem.value

      return [
        {
          label: 'Тип конструкции',
          value: item?.constructionType
        },
        {
          label: 'Покрытие',
          value: item?.coating
        },
        {
          label: 'Особенности',
          value: item?.features
        },
        {
          label: 'Площадь поршней',
          value: item?.pistonAreaCm2 ? `${item.pistonAreaCm2} см²` : undefined
        }
      ].filter(row => {
        return hasValue(row.value)
      })
    })
    const catalogRows = computed<InfoRow[]>(() => {
      const item = resolvedItem.value

      return [
        {
          label: 'Категория',
          value: item?.category
        },
        {
          label: 'ID комплекта',
          value: item?.setId
        },
        {
          label: 'Цена USD',
          value: item?.priceUsd ? formatPrice(item.priceUsd) : undefined
        },
        {
          label: 'Цена CNY',
          value: formatCny(item?.priceCny)
        },
        {
          label: 'Статус данных',
          value: item?.dataStatus
        }
      ].filter(row => {
        return hasValue(row.value)
      })
    })
    const factRows = computed<InfoRow[]>(() => {
      const item = resolvedItem.value

      return [
        {
          label: 'Конструкция',
          value: item?.constructionType
        },
        {
          label: 'Покрытие',
          value: item?.coating
        },
        {
          label: 'Особенности',
          value: item?.features
        },
        {
          label: 'Статус данных',
          value: item?.dataStatus
        }
      ].filter(row => {
        return hasValue(row.value)
      }).slice(0, 4)
    })
    const badgeRows = computed(() => {
      const item = resolvedItem.value

      return [
        item?.pistonCount ? `${item.pistonCount} поршней` : undefined,
        wheelDiameterRange.value,
        item?.discDiameterMm ? `${item.discDiameterMm} мм` : undefined
      ].filter(Boolean)
    })
    const recommendedItems = computed<CatalogItem[]>(() => {
      const item = resolvedItem.value
      if (!item) {
        return []
      }

      return catalog
        .filter((candidate: CatalogItem) => candidate.id !== item.id)
        .map((candidate: CatalogItem): ScoredItem => {
          let score = 0
          if (candidate.series === item.series) {
            score += 70
          }
          if (candidate.model === item.model) {
            score += 24
          }
          if (candidate.pistonCount === item.pistonCount) {
            score += 18
          }
          if (candidate.compatibilityClass === item.compatibilityClass) {
            score += 12
          }
          if (candidate.application === item.application) {
            score += 10
          }

          score -= Math.abs(candidate.discDiameterMm - item.discDiameterMm) / 10
          score -= Math.abs((getNumber(candidate.wheelDiameterInch) ?? 0) - (getNumber(item.wheelDiameterInch) ?? 0)) * 2

          return {
            item: candidate,
            score
          }
        })
        .sort((firstItem: ScoredItem, secondItem: ScoredItem) => secondItem.score - firstItem.score)
        .slice(0, 4)
        .map((candidate: ScoredItem) => candidate.item)
    })

    const getRecommendedTitle = (item: CatalogItem): string => {
      return getString(item.model) ?? 'Комплект'
    }
    const getRecommendedSubtitle = (item: CatalogItem): string => {
      const series = getString(item.series)
      const piston = getString(item.pistonCount)
      const disc = getString(item.discDiameterMm)
      const parts = [ series, piston ? `${piston} порш.` : '', disc ? `${disc} мм` : '' ].filter(Boolean)

      return parts.join(' / ')
    }
    const renderGallery = () => {
      return (
        <div class={`${baseClass}__gallery`}>
          <div class={`${baseClass}__badges`}>
            {badgeRows.value.map(badge => {
              return <span class={`${baseClass}__badge`} key={badge}>{badge}</span>
            })}
          </div>

          <div class={`${baseClass}__image`}>
            <img src={`${resolvedItem.value?.series.toLowerCase()}.png`} alt={productModel.value} />
          </div>
        </div>
      )
    }
    const renderStats = () => {
      return (
        <div class={`${baseClass}__stats`}>
          {statRows.value.map(row => {
            return (
              <div class={`${baseClass}__stat`} key={row.label}>
                <span class={`${baseClass}__stat-label`}>{row.label}</span>
                <strong class={`${baseClass}__stat-value`}>{row.value}</strong>
              </div>
            )
          })}
        </div>
      )
    }
    const renderIncluded = () => {
      return (
        <div class={`${baseClass}__included`}>
          {kitParts.map(part => {
            return <span key={part.label}>{part.label}</span>
          })}
        </div>
      )
    }
    const renderPurchase = () => {
      const item = resolvedItem.value

      return (
        <div class={`${baseClass}__purchase`}>
          <div class={`${baseClass}__purchase-availability`}>● Под заказ</div>

          <div class={`${baseClass}__price-block`}>
            <div class={`${baseClass}__price`}>{productPrice.value}</div>
            <div class={`${baseClass}__price-meta`}>
              {formatCny(item?.priceCny) ? <span>{formatCny(item?.priceCny)}</span> : null}
            </div>
          </div>

          <button class={`${baseClass}__cta`} type="button">Связаться для заказа</button>

          <div class={`${baseClass}__purchase-kit`}>
            <div class={`${baseClass}__muted`}>В комплект входит</div>
            {renderIncluded()}
          </div>
        </div>
      )
    }
    const renderInfo = () => {
      return (
        <div class={`${baseClass}__info`}>
          <div class={`${baseClass}__heading`}>
            <div class={`${baseClass}__series`}>{productSeries.value}</div>
            <h1 class={`${baseClass}__title`}>{productModel.value}</h1>
          </div>

          <p class={`${baseClass}__description`}>{resolvedItem.value?.description}</p>
          {renderStats()}
          {renderPurchase()}
        </div>
      )
    }
    const renderHero = () => {
      return (
        <section class={`${baseClass}__hero`}>
          {renderGallery()}
          {renderInfo()}
        </section>
      )
    }
    const renderTrustItem = (row: InfoRow) => {
      return (
        <div class={`${baseClass}__trust-item`} key={row.label}>
          <div class={`${baseClass}__trust-title`}>{row.label}</div>
          <div class={`${baseClass}__muted`}>{row.value}</div>
        </div>
      )
    }
    const renderTrustStrip = () => {
      return (
        <section class={`${baseClass}__trust-strip`}>
          {factRows.value.map(renderTrustItem)}
        </section>
      )
    }
    const renderTabs = () => {
      return (
        <div class={`${baseClass}__tabs`}>
          {productTabs.map(tab => {
            return (
              <button
                aria-selected={activeTab.value === tab.id}
                class={{
                  [`${baseClass}__tab`]: true,
                  [`${baseClass}__tab--active`]: activeTab.value === tab.id
                }}
                key={tab.id}
                type="button"
                onClick={() => {
                  activeTab.value = tab.id
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      )
    }
    const renderSpecRow = (row: InfoRow) => {
      return (
        <div class={`${baseClass}__spec-row`} key={row.label}>
          <span>{row.label}</span>
          <span>{row.value}</span>
        </div>
      )
    }
    const renderCard = (title: string, rows: InfoRow[]) => {
      return (
        <div class={`${baseClass}__card`}>
          <h3>{title}</h3>
          <div class={`${baseClass}__spec-list`}>
            {rows.map(renderSpecRow)}
          </div>
        </div>
      )
    }
    const renderKitCard = () => {
      return (
        <div class={[ `${baseClass}__card`, `${baseClass}__kit-card` ]}>
          <h3>Комплектация</h3>
          <div class={`${baseClass}__kit-grid`}>
            {kitParts.map(part => {
              return (
                <div class={`${baseClass}__kit-item`} key={part.label}>
                  <div class={`${baseClass}__kit-image`} />
                  <strong>{part.label}</strong>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    const renderTabPanel = () => {
      const tabContent: Record<ProductTab, () => VNode> = {
        specs: () => renderCard('Технические характеристики', specRows.value),
        compatibility: () => renderCard('Совместимость', compatibilityRows.value),
        construction: () => renderCard('Конструкция', constructionRows.value),
        kit: renderKitCard,
        catalog: () => renderCard('Каталожные данные', catalogRows.value)
      }

      return (
        <section class={`${baseClass}__tab-panel`}>
          {tabContent[activeTab.value]()}
        </section>
      )
    }
    const renderRecommendedCard = (item: CatalogItem) => {
      return (
        <RouterLink
          class={`${baseClass}__product-card`}
          key={item.id}
          to={{
            name: 'catalog.single',
            params: { id: item.id }
          }}
        >
          <div class={`${baseClass}__product-card-image`}>
            <img src={placeholderImage} alt={getRecommendedTitle(item)} />
          </div>
          <div class={`${baseClass}__product-card-content`}>
            <h4>{getRecommendedTitle(item)}</h4>
            <div class={`${baseClass}__muted`}>{getRecommendedSubtitle(item)}</div>
            <div class={`${baseClass}__price-small`}>{formatPrice(item.priceUsd)}</div>
          </div>
        </RouterLink>
      )
    }
    const renderProducts = () => {
      return (
        <section class={`${baseClass}__products`}>
          <div class={`${baseClass}__products-header`}>
            <h3>Часто покупают вместе</h3>
            <RouterLink class={`${baseClass}__products-link`} to="/catalog">Весь каталог</RouterLink>
          </div>
          <div class={`${baseClass}__products-row`}>
            {recommendedItems.value.map(renderRecommendedCard)}
          </div>
        </section>
      )
    }
    const renderNotFound = () => {
      return (
        <div class={baseClass}>
          <div class={[ 'container', `${baseClass}__container` ]}>
            <div class={`${baseClass}__not-found`}>
              <h1 class={`${baseClass}__not-found-title`}>Товар не найден</h1>
              <p>Позиция могла быть удалена или перемещена в каталоге.</p>
              <RouterLink class="button button--light" to="/catalog">Вернуться в каталог</RouterLink>
            </div>
          </div>
        </div>
      )
    }

    return () => {
      if (!resolvedItem.value) {
        return renderNotFound()
      }

      return (
        <div class={baseClass}>
          <main class={[ 'container', `${baseClass}__container` ]}>
            {renderHero()}
            {renderTrustStrip()}
            {renderTabs()}
            {renderTabPanel()}
            {renderProducts()}
          </main>
        </div>
      )
    }
  }
})
