import { defineComponent } from 'vue'
import { SystemCard, SystemsSeriesTypes } from '@/utils'
import SystemsCard from '@/components/systems/card'

const cards: SystemCard[] = [
  {
    type: SystemsSeriesTypes.s,
    title: 'S-series',
    subtitle: 'Ежедневная езда',
    image: '/street.webp',
    features: [
      'Комфорт и надёжность',
      'Оптимальны для города',
      'Низкий уровень шума'
    ]
  },
  {
    type: SystemsSeriesTypes.r,
    title: 'R-series',
    subtitle: 'Активная езда',
    image: '/sport.webp',
    features: [
      'Высокая эффективность',
      'Устойчивость к перегреву',
      'Точный контроль'
    ]
  },
  {
    type: SystemsSeriesTypes.n,
    title: 'N-series',
    subtitle: 'Трек и автоспорт',
    image: '/track.webp',
    features: [
      'Максимальная мощность',
      'Работа при экстремальных нагрузках',
      'Для трека и соревнований'
    ]
  }
]

export default defineComponent({
  name: 'GSystemCards',

  setup() {
    const renderTitle = () =>
      <span class="systems__title">Серии комплектов</span>

    const renderCards = () => {
      return cards.map(card => {
        return <SystemsCard key={card.type} value={card} />
      })
    }
    const renderContent = () => {
      return (
        <div class="systems-content" >
          {renderTitle()}
          <div class="systems__cards">
            {renderCards()}
          </div>
        </div>
      )
    }

    return () => {
      return (
        <section class="systems">
          {renderContent()}
        </section>
      )
    }
  }
})
