import { AccessoryItem, type CatalogItem } from '@/utils'
import { Fragment, PropType, defineComponent, reactive } from 'vue'
import { UiPanel } from '@/ui'
import Item from '@/entities/accessory/ui/item'

export const ProductDetails = defineComponent({
  name: 'ProductDetails',

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
      kit: false
    })

    const renderKit = () => {
      return (
        <div class={`${className}__kit`}>
          {kitItems.map(item => {
            return <Item value={item}/>
          })}
        </div>
      )
    }

    return () => {
      return (
        <Fragment>
          <div class={className} >
            <div class={`${className}__holder`} >
              <UiPanel v-model={expanded.kit} label="Комплектация" outline>
                {renderKit()}
              </UiPanel>
            </div>
          </div>
        </Fragment>
      )
    }
  }
})
