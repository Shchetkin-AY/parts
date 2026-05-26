import { defineComponent } from 'vue'
import { SystemCard, SystemsCardTypes } from '@/utils'
import SystemsCard from '@/components/systems/card'

const cards: SystemCard[] = [
  {
    type: SystemsCardTypes.street,
    title: 'STREET',
    subtitle: 'Ежедневная езда',
    image: '/base.png',
    features: [
      'Комфорт и надёжность',
      'Оптимальны для города',
      'Низкий уровень шума'
    ]
  },
  {
    type: SystemsCardTypes.sport,
    title: 'SPORT',
    subtitle: 'Активная езда',
    image: '/sport.png',
    features: [
      'Высокая эффективность',
      'Устойчивость к перегреву',
      'Точный контроль'
    ]
  },
  {
    type: SystemsCardTypes.track,
    title: 'TRACK',
    subtitle: 'Трек и автоспорт',
    image: '/track.png',
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
      <span class="systems__title">Комплекты по назначению</span>

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
