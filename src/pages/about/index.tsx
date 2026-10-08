import { Page } from '@/components'
import { defineComponent } from 'vue'
import {
  AboutHistoryItem,
  AboutMaterialSpec,
  AboutMediaCard,
  AboutPrecisionFeature,
  AboutStatCard,
  aboutForgingCards,
  aboutHeroImage,
  aboutHistoryImage,
  aboutHistoryItems,
  aboutMaterialImage,
  aboutMaterialSpecs,
  aboutPrecisionFeatures,
  aboutPrecisionStats
} from '@/utils'

export default defineComponent({
  name: 'AboutPage',

  setup() {
    const renderHero = () => {
      return (
        <section class="page__section about__section about__section--hero">
          <div class="about__hero-media">
            <img
              alt="Крупный план индустриальной ковки"
              class="about__hero-image"
              src={aboutHeroImage}
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
        <section class="page__section about__section">
          <div class="about__history">
            <div class="about__history-main">
              <h2 class="about__title">История совершенства</h2>
              <div class="about__history-list">
                {aboutHistoryItems.map(renderHistoryItem)}
              </div>
            </div>

            <div class="about__history-media">
              <img
                alt="Технический чертеж и измерительный инструмент"
                class="about__history-image"
                src={aboutHistoryImage}
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
        <section class="page__section about__section about__section--tone">
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
              {aboutForgingCards.map(renderForgingCard)}
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
        <section class="page__section about__section">
          <div class="about__precision">
            <div class="about__precision-stats">
              {aboutPrecisionStats.map(renderPrecisionStat)}
            </div>

            <div class="about__precision-copy">
              <h2 class="about__title">5-осевая точность</h2>
              <p class="about__precision-text">
                Каждая деталь проходит через многочасовой цикл фрезерования на пятикоординатных станках последнего поколения. Это позволяет создавать сложные геометрические формы, невозможные при обычном литье, оптимизируя воздушные потоки и теплоотвод.
              </p>
              <ul class="about__precision-features">
                {aboutPrecisionFeatures.map(renderPrecisionFeature)}
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
        <section class="page__section about__section about__section--materials">
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
                  {aboutMaterialSpecs.map(renderMaterialSpec)}
                </div>
              </div>
            </div>

            <div class="about__materials-media">
              <img
                alt="Текстура алюминия"
                class="about__materials-image"
                src={aboutMaterialImage}
              />
            </div>
          </div>
        </section>
      )
    }

    return () =>
      <Page class="about">
        {renderHero()}
        {renderHistory()}
        {renderForging()}
        {renderPrecision()}
        {renderMaterials()}
      </Page>
  }
})
