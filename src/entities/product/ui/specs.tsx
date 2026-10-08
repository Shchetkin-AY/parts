import { PropType, computed, defineComponent } from 'vue'

import {
  CatalogItem,
  SpecItem,
  getWheelDiameterRange
} from '@/utils'

export default defineComponent({
  name: 'ProductSpecs',

  props: {
    value: {
      type: Object as PropType<CatalogItem>,
      required: true
    },

    title: {
      type: String as PropType<string>,
      default: 'Характеристики'
    },

    note: {
      type: String as PropType<string>,
      default: 'Технические данные'
    }
  },

  setup(props) {
    const className = 'product-specs'

    const items = computed<SpecItem[]>(() => {
      const item = props.value

      return [
        {
          label: 'Количество поршней',
          value: String(item.pistonCount),
          unit: 'шт'
        },
        {
          label: 'Диаметр колёс',
          value: getWheelDiameterRange(item.wheelDiameter)
        },
        {
          label: 'Диаметр диска',
          value: String(item.discDiameter),
          unit: 'мм'
        },
        {
          label: 'Габариты суппорта',
          value: item.dimensions
        },
        {
          label: 'Площадь колодок',
          value: item.padFrictionArea,
          unit: 'см²'
        },
        {
          label: 'Площадь поршней',
          value: String(item.pistonArea).replace('.', ','),
          unit: 'см²'
        },
        {
          label: 'Тип конструкции',
          value: item.constructionType
        },
        {
          label: 'Покрытие',
          value: item.coating
        },
        {
          label: 'Применение',
          value: item.application
        }
      ]
    })

    const renderHeader = () => {
      return (
        <div class={`${className}__header`}>
          <h3 class={`${className}__header-title`}>
            {props.title}
          </h3>
        </div>
      )
    }

    const renderValueUnit = (item: SpecItem) => {
      if (item.unit) {
        return (
          <span
            class={`${className}__value-unit`}
            innerHTML={item.unit}
          />
        )
      }
    }
    const renderRowValue = (item: SpecItem) => {
      return (
        <span class={`${className}__value`}>
          {item.value}
          {renderValueUnit(item)}
        </span>
      )
    }

    const renderRow = (item: SpecItem) => {
      return (
        <div class={`${className}__row`} key={item.label}>
          <span class={`${className}__label`}>{item.label}</span>
          {renderRowValue(item)}
        </div>
      )
    }

    const renderList = () => {
      return (
        <div class={`${className}__list`}>
          {items.value.map(renderRow)}
        </div>
      )
    }

    return () => {
      return (
        <section class={className}>
          {renderHeader()}
          {renderList()}
        </section>
      )
    }
  }
})
