import { type CatalogItem, Colors, Icons, Sizes, formatUsd } from '@/utils'
import { PropType, defineComponent } from 'vue'
import { GButton } from '@/components/g/button'
import { GIcon } from '@/components/g/icon'

const purchaseKitItems = [
  'Суппорт: 2 шт',
  'Тормозной диск: 2 шт',
  'Колодки: комплект',
  'Переходники: комплект',
  'Тормозные шланги: комплект'
]

export const ProductPurchase = defineComponent({
  name: 'ProductPurchase',

  props: {
    item: {
      type: Object as PropType<CatalogItem>,
      required: true
    }
  },

  setup(props) {
    const renderOrderButton = () => {
      return (
        <GButton label={'Заказать комплект'} color={Colors.primary} size={Sizes.large} />
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
      return (
        <div class="product-page__purchase-price">
          {formatUsd(props.item.priceUsd)}
        </div>
      )
    }

    const renderKitItem = (label: string) => {
      return (
        <div class="product-page__kit-item">
          <GIcon icon={Icons['check-circle']} color={Colors.primary} size={20} />
          <span class="product-page__kit-item-label">{label}</span>
        </div>
      )
    }

    const renderKitList = () => {
      return (
        <div class="product-page__kit-list">
          {purchaseKitItems.map(item => renderKitItem(item))}
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

    return () => {
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
  }
})
