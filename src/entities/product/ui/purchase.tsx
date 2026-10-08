import { CatalogItem, Color, Icons, Size, formatPrice } from '@/utils'
import { PropType, computed, defineComponent } from 'vue'
import { UiButton } from '@/components'
import { UiIcon } from '@/components'
import { UiChip, UiDivider } from '@/components'

export interface PurchaseOption {
  id: string
  label: string
  price: number
}

const purchaseKitItems = [
  'Суппорты: 2 шт',
  'Тормозные диски: 2 шт',
  'Колодки: комплект на ось',
  'Крепежный комплект: комплект на ось',
  'Тормозные магистрали: комплект на ось'
]

export const Purchase = defineComponent({
  name: 'ProductPurchase',

  props: {
    item: {
      type: Object as PropType<CatalogItem>,
      required: true
    },
    options: {
      type: Array as PropType<PurchaseOption[]>,
      default: () => []
    }
  },

  emits: [ 'order', 'remove' ],

  setup(props, { emit }) {
    const className = 'purchase'

    const price = computed<string>(() => {
      if (!props.item.price) {
        return formatPrice(props.item.price)
      }

      return formatPrice(props.item.price + props.options.reduce((total, option) => total + option.price, 0))
    })

    const renderOrderButton = () => {
      return (
        <UiButton
          label={'Получить расчет'}
          color={Color.primary}
          size={Size.large}
          onClick={() => emit('order')}
        />
      )
    }

    const renderPurchaseNote = () => {
      return (
        <p class={`${className}__note`}>
          Финальная стоимость зависит от конфигурации и цвета
        </p>
      )
    }

    const renderPurchasePrice = () => {
      return (
        <div class={`${className}__price`}>
          {price.value}
        </div>
      )
    }

    const renderPurchaseOptions = () => {
      const options = props.options.filter(option => option.price > 0)

      return (
        <div class={`${className}__options`}>
          <div class={`${className}__options-title`}>Дополнительные опции:</div>
          {options.length > 0
            ? options.map(option =>
              <UiChip
                label={`+ ${formatPrice(option.price)} ${option.label}`}
                remove
                size={Size.medium}
                color={Color.info}
                onRemove={() => emit('remove', option.id)}
                key={option.id}
              />)
            : <span class={`${className}__options-empty`}>Не выбраны</span>}
        </div>
      )
    }

    const renderKitItemIcon = () => {
      return <UiIcon icon={Icons['check-circle']} color={Color.success} size={20} />
    }
    const renderKitItemLabel = (label: string) => {
      return <span class={`${className}__kit-item-label`}>{label}</span>
    }
    const renderKitItem = (label: string) => {
      return (
        <div class={`${className}__kit-item`}>
          {renderKitItemIcon()}
          {renderKitItemLabel(label)}
        </div>
      )
    }

    const renderKitList = () => {
      return (
        <div class={`${className}__kit-list`}>
          {purchaseKitItems.map(item => renderKitItem(item))}
        </div>
      )
    }

    const renderDivider = () => {
      return <UiDivider />
    }

    const renderPurchaseKit = () => {
      return (
        <div class={`${className}__kit`}>
          <div class={`${className}__kit-title`}>В комплект входит</div>
          {renderKitList()}
        </div>
      )
    }

    return () => {
      return (
        <aside class={className}>
          {renderPurchasePrice()}
          {renderPurchaseOptions()}
          {renderPurchaseNote()}
          {renderOrderButton()}
          {renderDivider()}
          {renderPurchaseKit()}
        </aside>
      )
    }
  }
})
