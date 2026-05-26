import { Icons, ProductionRouteStep } from '@/utils'
import { defineComponent } from 'vue'
import { GIcon } from './g'

export default defineComponent({
  name: 'ProductionRoute',

  setup() {
    const steps = [
      {
        step: '01',
        icon: Icons.layers,
        title: 'Алюминий',
        text: 'Сплав 6061-T6'
      },
      {
        step: '02',
        icon: Icons.temperature,
        title: 'Обработка',
        text: '72 ч при 580 °C'
      },
      {
        step: '03',
        icon: Icons.tools,
        title: 'Ковка 2000 т',
        text: 'Горячая ковка'
      },
      {
        step: '04',
        icon: Icons.settings,
        title: '5-осевой ЧПУ',
        text: 'Точность 0,01 мм'
      },
      {
        step: '05',
        icon: Icons.drop,
        title: 'Анодирование',
        text: 'Твёрдое покрытие'
      }
    ]

    const renderTitle = () => {
      return (
        <div class="production-route__title">Цикл производства</div>
      )
    }
    const renderStep = (step: ProductionRouteStep) => {
      return (
        <article class="production-route__card">
          <span class={'production-route__step'}>{step.step}</span>

          <span class={'production-route__icon'}>
            <GIcon icon={step.icon} size={30}/>
          </span>
          <div class="production-route__copy">
            <div class="production-route__card-title">{step.title}</div>
            <div class="production-route__card-text">{step.text}</div>
          </div>
          <div class="production-route__separator">
            <div class="production-route__separator-arrow">{'>'}</div>
          </div>
        </article>
      )
    }
    const renderSteps = () => {
      return steps.map(step => {
        return renderStep(step)
      })
    }

    return () => {
      return (
        <section class="production-route">
          {renderTitle()}
          <div class="production-route__panel">
            <div class="production-route__grid">
              {renderSteps()}
            </div>
          </div>
        </section>
      )
    }
  }
})
