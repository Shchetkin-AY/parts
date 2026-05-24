import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProductionRoute',

  setup() {
    const steps = [
      {
        icon: 'layers',
        title: 'Алюминий',
        text: 'Сплав 6061-T6'
      },
      {
        icon: 'thermostat',
        title: 'Термическая обработка',
        text: '72 ч при 580 °C'
      },
      {
        icon: 'precision_manufacturing',
        title: 'Ковка 2000 т',
        text: 'Горячая ковка'
      },
      {
        icon: 'settings_input_component',
        title: '5-осевой ЧПУ',
        text: 'Точность 0,01 мм'
      },
      {
        icon: 'opacity',
        title: 'Анодирование',
        text: 'Твёрдое покрытие'
      }
    ]

    return () =>
      <section class="production-route">
        <div class="content-container production-route__container">
          <div class="production-route__blueprint" />

          <div class="production-route__heading">
            <h2 class="production-route__title">Цикл производства</h2>
          </div>

          <div class="production-route__grid">
            {steps.map(step =>
              <article class="production-route__card">
                <span class={'material-symbols-outlined production-route__icon'}>
                  {step.icon}
                </span>
                <div class="production-route__copy">
                  <h4 class="production-route__card-title">{step.title}</h4>
                  <p class="production-route__card-text">{step.text}</p>
                </div>
              </article>)}
          </div>
        </div>
      </section>
  }
})
