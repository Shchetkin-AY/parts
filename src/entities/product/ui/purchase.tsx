import { type CatalogItem, Color, Icons, Size, formatPrice } from '@/utils'
import { PropType, defineComponent } from 'vue'
import { UiButton } from '@/ui/button'
import { UiIcon } from '@/ui/icon'
import { UiDivider } from '@/ui'

const purchaseKitItems = [
  'Суппорт: 2 шт',
  'Тормозной диск: 2 шт',
  'Колодки: комплект',
  'Адаптеры: комплект',
  'Тормозные магистрали: комплект'
]

export const Purchase = defineComponent({
  name: 'Purchase',

  props: {
    item: {
      type: Object as PropType<CatalogItem>,
      required: true
    }
  },

  emits: [ 'order' ],

  setup(props, { emit }) {
    const className = 'purchase'

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
          Финальная стоимость зависит от конфигурации и цвета.
        </p>
      )
    }

    const renderPurchasePrice = () => {
      return (
        <div class={`${className}__price`}>
          {formatPrice(props.item.price)}
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
          {renderPurchaseNote()}
          {renderOrderButton()}
          {renderDivider()}
          {renderPurchaseKit()}
        </aside>
      )
    }
  }
})
