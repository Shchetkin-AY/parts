import { type CatalogItem, formatWheelDiameterRange } from '@/utils'
import { PropType, defineComponent, ref } from 'vue'
import { GDivider } from '@/components'

type ProductTabKey = 'specs' | 'compatibility' | 'kit' | 'delivery' | 'faq'

const productTabs = [
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

const deliveryItems = [
  'Отправка по России и СНГ',
  'Проверка и фото перед отправкой',
  'Гарантийная поддержка по комплекту'
]

const faqItems = [
  {
    question: 'Можно ли заказать под мой автомобиль?',
    answer: 'Да, после подтверждения параметров диска и крепления.'
  },
  {
    question: 'Есть ли готовые комплекты?',
    answer: 'Да, в каталоге доступны готовые конфигурации по сериям.'
  },
  {
    question: 'Сколько занимает доставка?',
    answer: 'Срок зависит от региона и наличия на складе.'
  }
]

export const ProductTabs = defineComponent({
  name: 'ProductTabs',

  props: {
    item: {
      type: Object as PropType<CatalogItem>,
      required: true
    }
  },

  setup(props) {
    const activeTab = ref<ProductTabKey>('specs')

    const renderSpecificationRow = (label: string, value: string) => {
      return (
        <div class="product-page__spec-row">
          <span class="product-page__spec-label">{label}</span>
          <span class="product-page__spec-value">{value}</span>
        </div>
      )
    }

    const renderDimensions = () => {
      return [
        {
          value: `${props.item.width} см`,
          top: 40,
          left: 315
        },
        {
          value: `${props.item.height} см`,
          top: 130,
          right: 70
        },
        {
          value: `${props.item.depth} см`,
          top: 280,
          right: 62
        }
      ].map(dimension =>
        <span
          class="product-page__dimension"
          style={{
            top: `${dimension.top}px`,
            left: dimension.left !== undefined ? `${dimension.left}px` : undefined,
            right: dimension.right !== undefined ? `${dimension.right}px` : undefined
          }}
        >
          {dimension.value}
        </span>)
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
          {renderDimensions()}
        </div>
      )
    }

    const renderSpecificationsPanel = () => {
      const rows = [
        {
          label: 'Количество поршней, шт.',
          value: `${props.item.pistonCount}`
        },
        {
          label: 'Диаметр колёс, in',
          value: formatWheelDiameterRange(props.item.wheelDiameter)
        },
        {
          label: 'Диаметр диска, мм',
          value: `${props.item.discDiameter}`
        },
        {
          label: 'Габариты суппорта, мм',
          value: props.item.dimensions
        },
        {
          label: 'Площадь колодок, см',
          value: props.item.padFrictionArea
        },
        {
          label: 'Площадь поршней, см²',
          value: `${props.item.pistonArea}`
        },
        {
          label: 'Применимость',
          value: props.item.application
        }
      ]

      return (
        <div class="product-page__panel product-page__panel--specs">
          <div class="product-page__specs">
            <div class="product-page__section-title">Основные параметры</div>
            {rows.map(row => renderSpecificationRow(row.label, row.value))}
          </div>

          <GDivider type={'vertical'} />

          {renderBlueprint()}
        </div>
      )
    }

    const renderCompatibilityPanel = () => {
      const rows = [
        {
          label: 'Марка автомобиля',
          value: props.item.vehicleBrand
        },
        {
          label: 'Модель',
          value: props.item.vehicleModel
        },
        {
          label: 'Класс совместимости',
          value: props.item.compatibilityClass
        },
        {
          label: 'Заводской диск, мм',
          value: `${props.item.factoryDiscDiameter} мм`
        }
      ]

      return (
        <div class="product-page__panel">
          <div class="product-page__section-title">Совместимость</div>

          <div class="product-page__specs">
            {rows.map(row => renderSpecificationRow(row.label, row.value))}
          </div>
        </div>
      )
    }

    const renderKitPanel = () => {
      const kitItems = [
        `Суппорт ${props.item.series} ${props.item.model}`,
        `Тормозной диск ${props.item.discDiameter} мм`,
        'Колодки Performance',
        'Переходники',
        'Тормозные шланги'
      ]

      return (
        <div class="product-page__panel">
          <div class="product-page__section-title">Комплектация</div>

          <div class="product-page__kit-panel">
            {kitItems.map(kitItem => <div class="product-page__kit-panel-item">{kitItem}</div>)}
          </div>
        </div>
      )
    }

    const renderDeliveryPanel = () => {
      return (
        <div class="product-page__panel">
          <div class="product-page__section-title">Доставка и гарантия</div>

          <div class="product-page__delivery">
            {deliveryItems.map(item => <div class="product-page__delivery-item">{item}</div>)}
          </div>
        </div>
      )
    }

    const renderFaqPanel = () => {
      return (
        <div class="product-page__panel">
          <div class="product-page__section-title">FAQ</div>

          <div class="product-page__faq">
            {faqItems.map(item =>
              <div class="product-page__faq-item">
                <div class="product-page__faq-question">{item.question}</div>
                <div class="product-page__faq-answer">{item.answer}</div>
              </div>)}
          </div>
        </div>
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
          {productTabs.map(tab => renderTabButton(tab))}
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

    return () => {
      return (
        <div class="product-page__tabs-section">
          {renderTabs()}
          {renderTabContent()}
        </div>
      )
    }
  }
})
