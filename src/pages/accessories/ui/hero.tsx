import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AccessoriesHero',

  setup() {
    const className = 'accessories-hero'

    const renderEyebrow = () => {
      return <span class="accessories__eyebrow">Аксессуары</span>
    }

    const renderTitle = () => {
      return (
        <h1 class={`${className}-text-title`}>Все комплектующие производятся на собственном заводе</h1>
      )
    }

    const renderText = () => {
      return (
        <p class={`${className}-text-description`}>
          Диски, колодки и магистрали — то, из чего собирается каждый комплект. Полные характеристики: рабочие температуры, составы и массы
        </p>
      )
    }

    const renderCopy = () => {
      return (
        <div class={`${className}-text`}>
          {renderEyebrow()}
          {renderTitle()}
          {renderText()}
        </div>
      )
    }

    const renderImage = () => {
      return (
        <img
          class={`${className}-image`}
          src="/images/accessories/hero-12p.webp"
          alt="12-поршневой суппорт SAVANINI на составном диске"
        />
      )
    }

    return () => {
      return (
        <section class={className}>
          {renderCopy()}
          {renderImage()}
        </section>
      )
    }
  }
})
