import { defineComponent } from 'vue'

import { useViewportStore } from '@/stores'

export default defineComponent({
  name: 'Hero',

  setup() {
    const viewportStore = useViewportStore()

    const className = 'hero'

    const renderBackground = () => {
      if (viewportStore.size.width > 1024) {
        return (
          <div class={`${className}__background`} >
            <span class={`${className}__background-text ${className}__background-text--top`}>
              savaniny
            </span>
            <span class={`${className}__background-text ${className}__background-text--bottom`}>
              systems
            </span>
          </div>
        )
      }
    }

    const renderImage = () => {
      return (
        <img
          class={`${className}__media-image`}
          src={'/images/hero/hero-alt.webp'}
          alt="Тормозная система Savanini"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      )
    }
    const renderMedia = () => {
      if (viewportStore.size.width >= 1024) {
        return (
          <div class={`${className}__media`}>
            <div class={`${className}__media-holder`}>
              {renderImage()}
            </div>
          </div>
        )
      }
    }

    const renderEyebrow = () => {
      return (
        <span class={`${className}__text-eyebrow`}>Performance Engineering Division</span>
      )
    }

    const renderTitle = () => {
      return (
        <h1 class={`${className}__text-title`}>SAVANINI<br />
          <span>SYSTEMS</span>
        </h1>
      )
    }

    const renderText = () => {
      return (
        <p class={`${className}__text-description`}>
          Технологический авангард тормозных систем. Ковка под давлением 2000Т и прецизионная обработка авиационного алюминия 6061-T6
        </p>
      )
    }

    const renderCopy = () => {
      return (
        <div class={`${className}__text`}>
          {renderEyebrow()}
          {renderTitle()}
          {renderText()}
        </div>
      )
    }

    const renderContent = () => {
      return (
        <div class={`${className}__content`}>
          {renderCopy()}
        </div>
      )
    }

    return () =>
      <section class={className}>
        {renderBackground()}
        {renderMedia()}
        {renderContent()}
      </section>
  }
})
