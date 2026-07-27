import { AccessoryItem, type CatalogItem, type CompatibilityItem, formatWheelDiameterRange } from '@/utils'
import { Fragment, PropType, computed, defineComponent, reactive } from 'vue'
import { GPanel } from '@/components'
import Item from '@/components/accessories/item'
import ColorPanel from '@/components/palette/panel'
import { useCatalogStore } from '@/stores/catalog'

export const ProductTabs = defineComponent({
  name: 'ProductTabs',

  props: {
    value: {
      type: Object as PropType<CatalogItem>,
      required: true
    }
  },

  setup(props) {
    const className = 'product-panels'

    const kitItems: AccessoryItem[] = [
      {
        id: 1,
        title: `Суппорт ${props.value.series}`,
        description: '2 шт.',
        image: `/images/products/${props.value.series.toLowerCase()}/2.webp`
      },
      {
        id: 2,
        title: 'Тормозной диск',
        description: '2 шт.',
        image: '/images/accessories/disk.webp'
      },
      {
        id: 3,
        title: 'Тормозные магистрали',
        description: 'Комплект',
        image: '/images/accessories/hoses.webp'
      },
      {
        id: 4,
        title: 'Колодки Savanini',
        description: 'Комплект',
        image: '/images/accessories/pads.webp'
      },
      {
        id: 5,
        title: 'Адаптеры для установки',
        description: 'Комплект',
        image: '/images/accessories/adapters.webp'
      }
    ]

    const expanded = reactive<Record<string, boolean>>({
      specs: false,
      compatibility: false,
      kit: false,
      palette: false
    })

    const renderRow = (label: string, value: string) => {
      return (
        <div class={`${className}__specs-row`}>
          <span class={`${className}__specs-label`}>{label}</span>
          <span class={`${className}__specs-value`}>{value}</span>
        </div>
      )
    }

    const renderSpecsContent = () => {
      const rows = [
        {
          label: 'Количество поршней, шт.',
          value: `${props.value.pistonCount}`
        },
        {
          label: 'Диаметр колёс, in',
          value: formatWheelDiameterRange(props.value.wheelDiameter)
        },
        {
          label: 'Диаметр диска, мм',
          value: `${props.value.discDiameter}`
        },
        {
          label: 'Габариты суппорта, мм',
          value: props.value.dimensions
        },
        {
          label: 'Площадь колодок, см²',
          value: props.value.padFrictionArea
        },
        {
          label: 'Площадь поршней, см²',
          value: `${props.value.pistonArea}`
        },
        {
          label: 'Применимость',
          value: props.value.application
        }
      ]

      return (
        <div class={`${className}__specs`}>
          {rows.map(row => renderRow(row.label, row.value))}
        </div>
      )
    }

    const catalogStore = useCatalogStore()

    const compatibilityRows = computed<{ label: string;
      value: string }[]>(() => {
      const records = catalogStore.getCompatibilityByGoodsId(props.value.id)

      if (records.length === 0) {
        return [
          {
            label: 'Информация отсутствует',
            value: ''
          }
        ]
      }

      return records.map((record: CompatibilityItem) => ({
        label: `${record.brand} ${record.model}`,
        value: [
          record.platform ? `Платформа: ${record.platform}` : '',
          record.yearFrom ? `c ${record.yearFrom}` : '',
          record.yearTo ? `по ${record.yearTo}` : '',
          record.wheelInch ? `${record.wheelInch}"` : ''
        ].filter(Boolean).join(', ')
      }))
    })

    const renderCompatibility = () => {
      return (
        <div class={`${className}__specs`}>
          {compatibilityRows.value.length === 1 && !compatibilityRows.value[0].value
            ? renderRow(compatibilityRows.value[0].label, '')
            : compatibilityRows.value.map(row => renderRow(row.label, row.value))}
        </div>
      )
    }

    const renderKit = () => {
      return (
        <div class={`${className}__kit`}>
          {kitItems.map(item => {
            return <Item value={item}/>
          })}
        </div>
      )
    }

    const renderPalette = () => {
      return <ColorPanel />
    }

    return () => {
      return (
        <Fragment>
          <div class={className} >
            <div class={`${className}__holder`} >
              <GPanel v-model={expanded.specs} label="Характеристики" outline>
                {renderSpecsContent()}
              </GPanel>

              <GPanel v-model={expanded.compatibility} label="Совместимость" outline>
                {renderCompatibility()}
              </GPanel>

              <GPanel v-model={expanded.kit} label="Комплектация" outline>
                {renderKit()}
              </GPanel>

              <GPanel v-model={expanded.palette} label="Цветовые решения" outline>
                {renderPalette()}
              </GPanel>
            </div>
          </div>
        </Fragment>
      )
    }
  }
})
