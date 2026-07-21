import { defineComponent } from 'vue'
import { GIcon } from '@/components'
import { BenefitsItem, Colors, Icons } from '@/utils'

const className = 'benefits'

export default defineComponent({
  name: 'Benefits',

  setup() {
    const items: BenefitsItem[] = [
      {
        icon: Icons.verified,
        title: 'Официальный дистрибьютор',
        text: 'Прямые поставки'
      },
      {
        icon: Icons.settings,
        title: 'Индивидуальные решения',
        text: 'Под заказ любой конфигурации'
      },
      {
        icon: Icons.delivery,
        title: 'Быстрая доставка',
        text: 'По всей России'
      },
      {
        icon: Icons.warranty,
        title: 'Гарантия и поддержка',
        text: '1 год'
      }
    ]

    const renderItemIcon = (icon: Icons) => {
      return (
        <div class={`${className}__item-icon`}>
          <GIcon icon={icon} size={46} color={Colors.primary} />
        </div>
      )
    }
    const renderItemContent = (title: string, text: string) => {
      return (
        <div class={`${className}__item-content`}>
          <div class={`${className}__item-title`}>{title}</div>
          <div class={`${className}__item-text`}>{text}</div>
        </div>
      )
    }

    const renderItem = ({ icon, title, text }: BenefitsItem) => {
      return (
        <article class={`${className}__item`} >
          {renderItemIcon(icon)}
          {renderItemContent(title, text)}
        </article>
      )
    }

    const renderItems = () => {
      return items.map(item => {
        return renderItem(item)
      })
    }

    return () => {
      return (
        <div class={className}>
          {renderItems()}
        </div>
      )
    }
  }
})
