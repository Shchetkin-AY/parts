import { defineComponent } from 'vue'

interface AboutHistoryItem {
  accent?: boolean
  text: string
  title: string
}

interface AboutMediaCard {
  image: string
  text: string
}

interface AboutMaterialSpec {
  label: string
  value: string
}

interface AboutPrecisionFeature {
  text: string
}

interface AboutStatCard {
  icon: string
  label: string
  value: string
}

const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyef1sPzM-GAz6ci4NlSXiggOwVGv7btZWJX8ESY4qFIZ23epxiZ_JU5ZUC9mSmgtgkgJcZgh3g83TS_FeA2Ro6_yJyKaBGPnn3aHyNIHA186uiVtOwociqElS5QgVYM1jSmQd6xvPwGR-W4orSYV3BQy-Ey9MQ62myX3pPTrQA6N9RzOd1wFUdhp-nNZ_ieSB3RHcupd79ZdmUJ_dt0EuTWiQcbQuaeJzx9zkS1Rmh95px0gGppB2Jgbkf444X7S9I1J1o3IyFFc'
const historyImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJLZqxWYEGUmmolPizZYD1B0tSd2drfsICvttytCL8tc4NkcEHM2lHYQ9RE4HsEgCL53ZrcX5RiVCUhqndre8oQUbBpWZuYlViLPTVrRt4OdrD35JuE8QtPhUDSCJKh1EeVpvQjIyg8Qq2is_axtuQKmgjrIkyTxXTfGZi9KtwDXPli3Tq4cbhOtGPLBFxKaaMRyeLSeWLiMGhth51l0CD3b5CDvXDDBofTse7ex6UMsHG7b7kAScG4LleibtF77VzYnVPH6N5UIs'
const forgingImagePressure = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtfpXS8kxI1cKUnOztU5ez4nkpIffNzE-U7RF00y9vo3ReT3L4MArGvRzSNmUMtzAaAd_TYsPqVEGib_AOvTZYaK4AJFBy4T0apZvoQyYZZmcPHJjML99_kcX-w3Xj9f6Y1gfGg2AwNgoJQCyOArYk7cRQPM6TM9NeWU49VLY7A2Jzcfr9oTSHK-FHTnc5g0Am-vUh00_Kk-xRIpUczXCaPWsY9-HexFsMOMM8BFsOVdQesLGSxgDxnDUvg6NHs9GIlzvYgi_TatM'
const forgingImageControl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnJcpwnpPPBCLX7nwmJ36mMYtBKNWP9LYs4FwH-ziIF86AVFYxmzEAKpBk9FErnhFM1rz50Tvn2MobCKeLaomYD_8h-QucXTokYFklJR7_GTJT4HtQu4By6FwMgp05GekzKEwhAaZBu8Nypf0YFccoBaUj_aKTZHct-OfmAqr6mtE6AjMn9vZZxBOce5LM3MPEJNhS98DJqraI2Dsjfrb8OTuTtF49C1qnD7T5ndkoi01c85DszLOaoFcpC8P_6KClp9BeNQOG--A'
const materialImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuACIj3m-PGJ2UzNEKkOnRxnr9mqBRf9leCSJ8PAuf9vXLol9kQeLzB_xdlPatTKnfN5rOoupHUHmSY1uRY4dW-vl3tDdmwH7CbYqxJkAxZQjP2_jckS4mkTzD2fngyq-WBjoR-Vg2wfwOJU56aoPi9ShRY8_vpExPOfr3ulrXwEd5MuDvjffx1ASU5Nsm2pr28BL-AB3T-CAQr32RH4L7Xsm5zs54h012x2G2pkTPUrqzGjWYVXcGSDlzoery19zQTJfdZrUQlsf_8'

const historyItems: AboutHistoryItem[] = [
  {
    accent: true,
    title: 'Фундамент',
    text: 'Savanini начинала как небольшое конструкторское бюро, специализирующееся на высоконагруженных узлах для аэрокосмической отрасли. Этот опыт сформировал наш подход к материалам.'
  },
  {
    title: 'Инновации',
    text: 'Переход к серийному производству автомобильных компонентов премиум-класса потребовал внедрения технологий, ранее доступных только в военной инженерии.'
  }
]

const forgingCards: AboutMediaCard[] = [
  {
    image: forgingImagePressure,
    text: 'Close-up of industrial hydraulic press machinery in a dark environment with moody red lighting accents'
  },
  {
    image: forgingImageControl,
    text: 'Interior of a modern robotic metal manufacturing facility with clean lines and blue-tinted cool lighting'
  }
]

const precisionStats: AboutStatCard[] = [
  {
    icon: 'architecture',
    value: '0.001mm',
    label: 'Допуск точности'
  },
  {
    icon: 'settings_input_component',
    value: '5-осевой ЧПУ',
    label: 'Обработка cnc'
  }
]

const precisionFeatures: AboutPrecisionFeature[] = [
  {
    text: 'Удаление микро-напряжений металла'
  },
  {
    text: 'Финишная полировка алмазными фрезами'
  },
  {
    text: 'Лазерная калибровка каждой единицы'
  }
]

const materialSpecs: AboutMaterialSpec[] = [
  {
    label: 'Предел прочности',
    value: '570 MPa'
  },
  {
    label: 'Твердость по Бринеллю',
    value: '150 HB'
  },
  {
    label: 'Усталостная прочность',
    value: 'Extreme'
  }
]

export default defineComponent({
  name: 'AboutPage',

  setup() {
    const renderHero = () => {
      return (
        <section class="about__section about__section--hero">
          <div class="about__hero-media">
            <img
              alt="Крупный план индустриальной ковки"
              class="about__hero-image"
              src={heroImage}
            />
            <div class="about__hero-overlay" />
          </div>

          <div class="about__hero-content">
            <p class="about__eyebrow">Наследие инженерии</p>
            <h1 class="about__hero-title">
              SAVANINI <br />
              <span>precision</span>
            </h1>
            <p class="about__hero-text">
              Эволюция металла от сырой руды до прецизионных компонентов. Мы объединяем мощь 2000-тонной ковки с точностью авиационной обработки.
            </p>
          </div>
        </section>
      )
    }

    const renderHistoryItem = (item: AboutHistoryItem) => {
      return (
        <article key={item.title} class="about__history-item">
          <span class={[
            'about__history-line',
            { 'about__history-line--accent': item.accent }
          ]} />
          <div class="about__history-copy">
            <h3 class="about__history-title">{item.title}</h3>
            <p class="about__history-text">{item.text}</p>
          </div>
        </article>
      )
    }
    const renderHistory = () => {
      return (
        <section class="about__section">
          <div class="about__history">
            <div class="about__history-main">
              <h2 class="about__title">История совершенства</h2>
              <div class="about__history-list">
                {historyItems.map(renderHistoryItem)}
              </div>
            </div>

            <div class="about__history-media">
              <img
                alt="Технический чертеж и измерительный инструмент"
                class="about__history-image"
                src={historyImage}
              />
              <div class="about__history-stat">
                <strong>20+</strong>
                <span>Лет инженерных изысканий в области металловедения</span>
              </div>
            </div>
          </div>
        </section>
      )
    }

    const renderForgingCard = ({ image, text }: AboutMediaCard) => {
      return (
        <article class="about__forging-card">
          <img
            alt={text}
            class="about__forging-image"
            src={image}
          />
        </article>
      )
    }
    const renderForging = () => {
      return (
        <section class="about__section about__section--tone">
          <div class="about__forging">
            <div class="about__forging-copy">
              <h2 class="about__title">
                Процесс ковки под давлением <span>2000 тонн</span>
              </h2>
              <p class="about__forging-text">
                Ковка под давлением 2000 тонн изменяет молекулярную структуру алюминия, создавая непрерывную направленность волокон. Это обеспечивает исключительную прочность при минимальном весе.
              </p>
              <div class="about__forging-meta">
                <span class="material-symbols-outlined">precision_manufacturing</span>
                <span>Технология холодного деформирования</span>
              </div>
            </div>

            <div class="about__forging-grid">
              {forgingCards.map(renderForgingCard)}
            </div>
          </div>
        </section>
      )
    }

    const renderPrecisionStat = (item: AboutStatCard) => {
      return (
        <article class="production-route__card">
          <span class={[ 'material-symbols-outlined', 'production-route__icon' ]}>
            {item.icon}
          </span>
          <div class="production-route__copy">
            <h4 class="production-route__card-title">{item.label}</h4>
            <p class="production-route__card-text">{item.value}</p>
          </div>
        </article>
      )
    }
    const renderPrecisionFeature = ({ text }: AboutPrecisionFeature) => {
      return (
        <li key={text} class="about__precision-feature">
          <span class="about__precision-dot" />
          <span>{text}</span>
        </li>
      )
    }
    const renderPrecision = () => {
      return (
        <section class="about__section">
          <div class="about__precision">
            <div class="about__precision-stats">
              {precisionStats.map(renderPrecisionStat)}
            </div>

            <div class="about__precision-copy">
              <h2 class="about__title">5-осевая точность</h2>
              <p class="about__precision-text">
                Каждая деталь проходит через многочасовой цикл фрезерования на пятикоординатных станках последнего поколения. Это позволяет создавать сложные геометрические формы, невозможные при обычном литье, оптимизируя воздушные потоки и теплоотвод.
              </p>
              <ul class="about__precision-features">
                {precisionFeatures.map(renderPrecisionFeature)}
              </ul>
            </div>
          </div>
        </section>
      )
    }

    const renderMaterialSpec = ({ label, value }: AboutMaterialSpec) => {
      return (
        <article key={label} class="about__material-spec">
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      )
    }
    const renderMaterials = () => {
      return (
        <section class="about__section about__section--materials">
          <div class="about__materials">
            <div class="about__materials-copy">
              <h2 class="about__title">
                Aluminum <br />
                <span>7075-t6</span>
              </h2>

              <div class="about__materials-grid">
                <p class="about__materials-text">
                  Мы используем исключительно сплав 7075-T6 - авиационный алюминий. Он обладает самым высоким соотношением прочности к весу среди всех доступных алюминиевых сплавов.
                </p>

                <div class="about__materials-specs">
                  {materialSpecs.map(renderMaterialSpec)}
                </div>
              </div>
            </div>

            <div class="about__materials-media">
              <img
                alt="Текстура алюминия"
                class="about__materials-image"
                src={materialImage}
              />
            </div>
          </div>
        </section>
      )
    }

    return () =>
      <div class="about">
        {renderHero()}
        {renderHistory()}
        {renderForging()}
        {renderPrecision()}
        {renderMaterials()}
      </div>
  }
})
