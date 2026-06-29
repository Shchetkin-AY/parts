import { type CatalogItem, Colors, Icons, Sizes } from '@/utils'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ProductCard from '@/components/product-card'
import { GButton } from '@/components/g/button'
import { GChip } from '@/components/g/chip'
import { GIcon } from '@/components/g/icon'
import { useCatalogStore } from '@/stores/catalog'
import { GDivider } from '@/components'
import Benefits from '@/components/benefits'

type ProductTabKey = 'specs' | 'compatibility' | 'kit' | 'delivery' | 'faq'

const formatWheelDiameterRange = (value: number | string): string => {
  const diameters = String(value).match(/\d+(?:[.,]\d+)?/g) ?? []
  const normalizedDiameters = diameters.map(diameter => diameter.replace(',', '.'))

  if (normalizedDiameters.length >= 2) {
    return normalizedDiameters.map(diameter => `R${diameter}`).join('-')
  }

  const wheelDiameter = Number(normalizedDiameters[0] ?? value)

  if (Number.isFinite(wheelDiameter)) {
    return `R${wheelDiameter}-R${wheelDiameter + 3}`
  }

  return `R${value}`
}

export default defineComponent({
  name: 'ProductPage',
  setup() {
    const route = useRoute()
    const catalogStore = useCatalogStore()
    const activeTab = ref<ProductTabKey>('specs')

    onBeforeMount(() => {
      void catalogStore.load()
    })

    const tabs = [
      {
        key: 'specs',
        label: 'Характеристики'
      },
      {
        key: 'compatibility',
        label: 'Совместимость'
      },
      {
        key: 'kit',
        label: 'Комплектация'
      },
      {
        key: 'delivery',
        label: 'Доставка и гарантия'
      },
      {
        key: 'faq',
        label: 'FAQ'
      }
    ] as const

    const routeId = computed(() => {
      const rawId = route.params.id
      const value = Array.isArray(rawId) ? rawId[0] : rawId

      return Number(value)
    })

    const currentItem = computed<CatalogItem | null>(() => {
      const item = catalogStore.getById(routeId.value)

      return item ?? null
    })

    const relatedItems = computed(() => {
      const item = currentItem.value

      if (!item) {
        return []
      }

      return catalogStore.getRelatedItems(item, 5)
    })

    const formatUsd = (value: number): string => {
      return `$ ${value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    }

    const renderEmptyState = () => {
      const message = catalogStore.isLoading ? 'Загрузка товара...' : 'Товар не найден'

      return (
        <div class="product-page__empty">
          {message}
        </div>
      )
    }

    const renderBreadcrumbItem = (label: string, to?: string) => {
      if (to) {
        return (
          <RouterLink class="product-page__breadcrumb-link" to={to}>
            {label}
          </RouterLink>
        )
      }

      return (
        <span class="product-page__breadcrumb-current">
          {label}
        </span>
      )
    }

    const renderBreadcrumbs = () => {
      const item = currentItem.value
      if (!item) {
        return null
      }

      return (
        <div class="product-page__breadcrumbs">
          {renderBreadcrumbItem('Главная', '/')}
          <span class="product-page__breadcrumb-separator">›</span>
          {renderBreadcrumbItem('Каталог', '/catalog')}
          <span class="product-page__breadcrumb-separator">›</span>
          {renderBreadcrumbItem(item.category)}
          <span class="product-page__breadcrumb-separator">›</span>
          {renderBreadcrumbItem(`${item.series} ${item.model}`)}
        </div>
      )
    }

    const renderHeroTags = () => {
      const item = currentItem.value as CatalogItem | undefined
      if (!item) {
        return null
      }
      const wheelDiameterRange = formatWheelDiameterRange(item.wheelDiameterInch)

      return (
        <div class="product-page__hero-tags">
          <GChip label={`Поршней: ${item.pistonCount} шт.`} color={Colors['surface-2']} size={Sizes.large} outline/>
          <GChip label={wheelDiameterRange} color={Colors['surface-2']} size={Sizes.large} outline/>
          <GChip label={`${item.discDiameterMm} мм`} color={Colors['surface-2']} size={Sizes.large} outline/>
        </div>
      )
    }

    const renderHeroImage = () => {
      const item = currentItem.value as CatalogItem | undefined
      if (!item) {
        return null
      }

      return (
        <div class="product-page__hero-media">
          {renderHeroTags()}

          <div class="product-page__hero-image-frame">
            <img
              class="product-page__hero-image"
              src={`/images/products/${item.series.toLowerCase()}.webp`}
              alt={`${item.series} ${item.model}`}
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </div>
        </div>
      )
    }

    const renderHeroSeries = () => {
      const item = currentItem.value as CatalogItem | undefined
      if (!item) {
        return null
      }

      return (
        <div class="product-page__hero-series">
          {item.brand} {item.series}
        </div>
      )
    }

    const renderHeroTitle = () => {
      const item = currentItem.value
      if (!item) {
        return null
      }

      return (
        <h1 class="product-page__hero-title">
          {String(item.model)}
        </h1>
      )
    }

    const renderHeroDescription = () => {
      const item = currentItem.value
      if (!item) {
        return null
      }

      return (
        <p class="product-page__hero-description">
          {item.description}
        </p>
      )
    }

    const renderHeroHeader = () => {
      return (
        <div class="product-page__hero-header">
          {renderHeroSeries()}
          {renderHeroTitle()}
        </div>
      )
    }

    const renderHeroStat = (label: string, icon: Icons, value: string) => {
      return (
        <div class="product-page__hero-stat">
          <GIcon icon={icon} color={Colors.primary} size={30}/>
          <div class="product-page__hero-stat-copy">
            <span class="product-page__hero-stat-value">{value}</span>
            <span class="product-page__hero-stat-label">{label}</span>
          </div>
        </div>
      )
    }

    const renderHeroStats = () => {
      const item = currentItem.value
      if (!item) {
        return null
      }

      return (
        <div class="product-page__hero-stats">
          {renderHeroStat('Количество поршней', Icons.piston, `${item.pistonCount} шт`)}
          {renderHeroStat('Диаметр диска', Icons['wheel-diameter'], `${item.discDiameterMm} мм`)}
          {renderHeroStat('Диаметр колес', Icons.wheel, item.wheelDiameterInch)}
          {renderHeroStat('Площадь поршней', Icons.square, `${item.pistonAreaCm2} см²`)}
          {renderHeroStat('Покрытие', Icons.drop, item.coating)}
          {renderHeroStat('Применение', Icons.ui, item.application)}
        </div>
      )
    }

    const renderHeroContent = () => {
      return (
        <div class="product-page__hero-content">
          {renderHeroHeader()}
          {renderHeroDescription()}
          {renderHeroStats()}
        </div>
      )
    }

    const renderOrderButton = () => {
      return (
        <GButton label={'Заказать комплект'} color={Colors.primary} size={Sizes.large}/>
      )
    }

    const renderPurchaseNote = () => {
      return (
        <p class="product-page__purchase-note">
          Финальная стоимость зависит конфигурации.
        </p>
      )
    }

    const renderPurchaseAvailability = () => {
      return (
        <div class="product-page__purchase-availability">
          <span class="product-page__purchase-dot" />
          <span class="product-page__purchase-availability-text">Под заказ</span>
        </div>
      )
    }

    const renderPurchasePrice = () => {
      const item = currentItem.value
      if (!item) {
        return null
      }

      return (
        <div class="product-page__purchase-price">
          {formatUsd(item.priceUsd)}
        </div>
      )
    }

    const renderKitItem = (label: string) => {
      return (
        <div class="product-page__kit-item">
          <GIcon icon={Icons['check-circle']} color={Colors.primary} size={20}/>
          <span class="product-page__kit-item-label">{label}</span>
        </div>
      )
    }

    const renderKitList = () => {
      return (
        <div class="product-page__kit-list">
          {renderKitItem('Суппорт: 2 шт')}
          {renderKitItem('Тормозной диск: 2 шт')}
          {renderKitItem('Колодки: комплект')}
          {renderKitItem('Переходники: комплект')}
          {renderKitItem('Тормозные шланги: комплект')}
        </div>
      )
    }

    const renderPurchaseKit = () => {
      return (
        <div class="product-page__purchase-kit">
          <div class="product-page__purchase-kit-title">В комплект входит</div>
          {renderKitList()}
        </div>
      )
    }

    const renderPurchase = () => {
      return (
        <aside class="product-page__purchase">
          {renderPurchaseAvailability()}
          {renderPurchasePrice()}
          {renderOrderButton()}
          {renderPurchaseNote()}

          <div class="product-page__purchase-divider" />

          {renderPurchaseKit()}
        </aside>
      )
    }

    const renderHero = () => {
      return (
        <section class="product-page__hero">
          {renderHeroImage()}
          {renderHeroContent()}
          {renderPurchase()}
        </section>
      )
    }

    const renderBenefits = () => {
      return (
        <Benefits />
      )
    }

    const renderTabButton = (tab: { key: ProductTabKey;
      label: string }) => {
      const classes = {
        'product-page__tab': true,
        'product-page__tab--active': activeTab.value === tab.key
      }

      return (
        <button
          class={classes}
          type="button"
          onClick={() => {
            activeTab.value = tab.key
          }}
        >
          {tab.label}
        </button>
      )
    }

    const renderTabs = () => {
      return (
        <div class="product-page__tabs">
          {tabs.map(tab => renderTabButton(tab))}
        </div>
      )
    }

    const renderSpecificationRow = (label: string, value: string) => {
      return (
        <div class="product-page__spec-row">
          <span class="product-page__spec-label">{label}</span>
          <span class="product-page__spec-value">{value}</span>
        </div>
      )
    }

    const renderBlueprint = () => {
      return (
        <div class="product-page__blueprint">
          <img
            class="product-page__blueprint-image"
            src="/images/products/draw.png"
            alt="Комплект тормозной системы"
            loading="lazy"
            decoding="async"
          />
        </div>
      )
    }

    const renderSpecificationsPanel = () => {
      const item = currentItem.value
      if (!item) {
        return null
      }

      return (
        <div class="product-page__panel product-page__panel--specs">
          <div class="product-page__specs">
            <div class="product-page__section-title">Основные параметры</div>

            {renderSpecificationRow('Количество поршней, шт.', `${item.pistonCount}`)}
            {renderSpecificationRow('Диаметр колёс, in', formatWheelDiameterRange(item.wheelDiameterInch))}
            {renderSpecificationRow('Диаметр диска, мм', `${item.discDiameterMm}`)}
            {renderSpecificationRow('Габариты суппорта, мм', item.dimensionsMm)}
            {renderSpecificationRow('Площадь колодок, см', item.padFrictionArea)}
            {renderSpecificationRow('Площадь поршней, см²', `${item.pistonAreaCm2}`)}
            {renderSpecificationRow('Применимость', item.application)}
          </div>

          <GDivider type={'vertical'} />

          {renderBlueprint()}
        </div>
      )
    }

    const renderCompatibilityPanel = () => {
      const item = currentItem.value
      if (!item) {
        return null
      }

      return (
        <div class="product-page__panel">
          <div class="product-page__section-title">Совместимость</div>

          <div class="product-page__specs">
            <div class="product-page__spec-row">
              <span class="product-page__spec-label">Марка автомобиля</span>
              <span class="product-page__spec-value">{item.vehicleBrand}</span>
            </div>

            <div class="product-page__spec-row">
              <span class="product-page__spec-label">Модель</span>
              <span class="product-page__spec-value">{item.vehicleModel}</span>
            </div>

            <div class="product-page__spec-row">
              <span class="product-page__spec-label">Класс совместимости</span>
              <span class="product-page__spec-value">{item.compatibilityClass}</span>
            </div>

            <div class="product-page__spec-row">
              <span class="product-page__spec-label">Заводской диск, мм</span>
              <span class="product-page__spec-value">{item.factoryDiscDiameterMm} мм</span>
            </div>
          </div>
        </div>
      )
    }

    const renderKitPanel = () => {
      const item = currentItem.value
      if (!item) {
        return null
      }

      return (
        <div class="product-page__panel">
          <div class="product-page__section-title">Комплектация</div>

          <div class="product-page__kit-panel">
            <div class="product-page__kit-panel-item">Суппорт {item.series} {item.model}</div>
            <div class="product-page__kit-panel-item">Тормозной диск {item.discDiameterMm} мм</div>
            <div class="product-page__kit-panel-item">Колодки Performance</div>
            <div class="product-page__kit-panel-item">Переходники</div>
            <div class="product-page__kit-panel-item">Тормозные шланги</div>
          </div>
        </div>
      )
    }

    const renderDeliveryPanel = () => {
      return (
        <div class="product-page__panel">
          <div class="product-page__section-title">Доставка и гарантия</div>

          <div class="product-page__delivery">
            <div class="product-page__delivery-item">Отправка по России и СНГ</div>
            <div class="product-page__delivery-item">Проверка и фото перед отправкой</div>
            <div class="product-page__delivery-item">Гарантийная поддержка по комплекту</div>
          </div>
        </div>
      )
    }

    const renderFaqPanel = () => {
      return (
        <div class="product-page__panel">
          <div class="product-page__section-title">FAQ</div>

          <div class="product-page__faq">
            <div class="product-page__faq-item">
              <div class="product-page__faq-question">Можно ли заказать под мой автомобиль?</div>
              <div class="product-page__faq-answer">Да, после подтверждения параметров диска и крепления.</div>
            </div>

            <div class="product-page__faq-item">
              <div class="product-page__faq-question">Есть ли готовые комплекты?</div>
              <div class="product-page__faq-answer">Да, в каталоге доступны готовые конфигурации по сериям.</div>
            </div>

            <div class="product-page__faq-item">
              <div class="product-page__faq-question">Сколько занимает доставка?</div>
              <div class="product-page__faq-answer">Срок зависит от региона и наличия на складе.</div>
            </div>
          </div>
        </div>
      )
    }

    const renderTabContent = () => {
      if (activeTab.value === 'specs') {
        return renderSpecificationsPanel()
      }
      if (activeTab.value === 'compatibility') {
        return renderCompatibilityPanel()
      }
      if (activeTab.value === 'kit') {
        return renderKitPanel()
      }
      if (activeTab.value === 'delivery') {
        return renderDeliveryPanel()
      }

      return renderFaqPanel()
    }

    const renderTabsSection = () => {
      return (
        <section class="product-page__tabs-section">
          {renderTabs()}
          {renderTabContent()}
        </section>
      )
    }

    const renderRelatedHeader = () => {
      const item = currentItem.value
      if (!item) {
        return null
      }

      return (
        <div class="product-page__related-header">
          <div class="product-page__related-title">
            Другие комплекты {item.series}
          </div>
        </div>
      )
    }

    const renderRelatedCard = (item: CatalogItem) => {
      return (
        <div class="product-page__related-item">
          <ProductCard
            value={item}
            badge={item.id === currentItem.value?.id}
          />
        </div>
      )
    }

    const renderRelatedGrid = () => {
      return (
        <div class="product-page__related-grid">
          {relatedItems.value.map(item => renderRelatedCard(item))}
        </div>
      )
    }

    const renderRelated = () => {
      return (
        <section class="product-page__related">
          {renderRelatedHeader()}
          {renderRelatedGrid()}
        </section>
      )
    }

    return () => {
      if (!currentItem.value) {
        return renderEmptyState()
      }

      return (
        <div class="product-page">
          <div class="product-page__container">
            {renderBreadcrumbs()}
            {renderHero()}
            {renderBenefits()}
            {renderTabsSection()}
            {renderRelated()}
          </div>
        </div>
      )
    }
  }
})
