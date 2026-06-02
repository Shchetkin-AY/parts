import { defineComponent } from 'vue'
import { GIcon } from '@/components'
import { Colors, Icons } from '@/utils'

interface ExcellenceItem {
  icon: string
  title: string
  text: string
}

const items: ExcellenceItem[] = [
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

const className = 'benefits'

export default defineComponent({
  name: 'Benefits',

  setup() {
    const renderCard = ({ icon, title, text }: ExcellenceItem) => {
      return (
        <article class={`${className}__card`} >
          <div class={`${className}__icon`}>
            <GIcon icon={icon} size={46} color={Colors.primary} />
          </div>
          <div class={`${className}__content`}>
            <div class={`${className}__card-title`}>{title}</div>
            <div class={`${className}__card-text`}>{text}</div>
          </div>
        </article>
      )
    }

    return () =>
      <section class={className}>
        <div class={`${className}__panel`}>
          <div class={`${className}__grid`}>
            {items.map(renderCard)}
          </div>
        </div>
      </section>
  }
})
