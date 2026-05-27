import { defineComponent } from 'vue'
import { GIcon } from '@/components'
import { Icons } from '@/utils'

interface ExcellenceItem {
  icon: string
  title: string
  text: string
}

const items: ExcellenceItem[] = [
  {
    icon: Icons.verified,
    title: 'Официальный дестрибьютор',
    text: 'Прямые поставки.'
  },
  {
    icon: Icons.settings,
    title: 'Индивидуальные решения',
    text: 'Под заказ любой конфигурации.'
  },
  {
    icon: Icons.delivery,
    title: 'Быстрая доставка',
    text: 'По всей России.'
  },
  {
    icon: Icons.warranty,
    title: 'Гарантия и поддержка',
    text: '1 год.'
  }
]

export default defineComponent({
  name: 'TechnicalExcellence',

  setup() {
    const renderCard = ({ icon, title, text }: ExcellenceItem) => {
      return (
        <article class="advantages__card">
          <div class="advantages__icon">
            <GIcon icon={icon} size={46} color="primary" />
          </div>
          <div class="advantages__content">
            <div class="advantages__card-title">{title}</div>
            <div class="advantages__card-text">{text}</div>
          </div>
        </article>
      )
    }

    return () =>
      <section class="advantages">
        <div class="advantages__panel">
          <div class="advantages__grid">
            {items.map(renderCard)}
          </div>
        </div>
      </section>
  }
})
