import { type CatalogItem, Colors, Icons, Sizes, formatUsd } from '@/utils'
import { PropType, defineComponent } from 'vue'
import { GButton } from '@/components/g/button'
import { GIcon } from '@/components/g/icon'
import { GDivider } from '../g'

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

  setup(props) {
    const className = 'purchase'

    const renderOrderButton = () => {
      return (
        <GButton
          label={'Заказать комплект'}
          color={Colors.primary}
          size={Sizes.large}
        />
      )
    }

    const renderPurchaseNote = () => {
      return (
        <p class={`${className}__note`}>
          Финальная стоимость зависит конфигурации.
        </p>
      )
    }

    const renderPurchaseAvailability = () => {
      return (
        <div class={`${className}__availability`}>
          <span class={`${className}__availability-dot`} />
          <span class={`${className}__availability-text`}>Под заказ</span>
        </div>
      )
    }

    const renderPurchasePrice = () => {
      return (
        <div class={`${className}__price`}>
          {formatUsd(props.item.priceUsd)}
        </div>
      )
    }

    const renderKitItemIcon = () => {
      return <GIcon icon={Icons['check-circle']} color={Colors.primary} size={20} />
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
      return <GDivider />
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
          {renderPurchaseAvailability()}
          {renderPurchasePrice()}
          {renderOrderButton()}
          {renderPurchaseNote()}
          {renderDivider()}
          {renderPurchaseKit()}
        </aside>
      )
    }
  }
})
