import { defineComponent } from 'vue'
import { GIcon } from '@/components'

interface ExcellenceItem {
  icon: string
  title: string
  text: string
}

const items: ExcellenceItem[] = [
  {
    icon: 'shieldCheck',
    title: 'Официальный дестрибьютор',
    text: 'Прямые поставки.'
  },
  {
    icon: 'settings',
    title: 'CNC 5-осевая обработка',
    text: 'Прецизионное качество.'
  },
  {
    icon: 'speed',
    title: 'Тесты на треке',
    text: 'Проверено в гонках.'
  },
  {
    icon: 'delivery',
    title: 'Быстрая доставка',
    text: 'По всей России.'
  }
]

export default defineComponent({
  name: 'TechnicalExcellence',

  setup() {
    const renderCard = ({ icon, title, text }: ExcellenceItem) =>
      <article class="advantages__card">
        <div class="advantages__icon">
          <GIcon icon={icon} size={46} color="primary" />
        </div>
        <div class="advantages__content">
          <div class="advantages__card-title">{title}</div>
          <div class="advantages__card-text">{text}</div>
        </div>
      </article>

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
