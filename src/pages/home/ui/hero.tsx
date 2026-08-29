import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'

import { useViewportStore } from '@/stores'
import { Color } from '@/utils'
import { UiButton } from '@/ui'

export default defineComponent({
  name: 'Hero',

  setup() {
    const router = useRouter()
    const viewportStore = useViewportStore()

    const className = 'hero'

    const renderImage = () => {
      return (
        <img
          class={`${className}__media-image`}
          src={'/images/hero/hero.png'}
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
        <h1 class={`${className}__text-title`}>
          <span class={`${className}__text-title-line`}>
            <span>SAVANINI</span>
          </span>

          <span class={`${className}__text-title-line`}>
            <span>SYSTEMS</span>
          </span>
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

    const renderCatalogButton = () => {
      return (
        <UiButton
          class={`${className}__text-button`}
          label={'Смотреть каталог'}
          color={Color.primary}
          onClick={() => router.push({ name: 'catalog' })}
        />
      )
    }

    const renderCopy = () => {
      return (
        <div class={`${className}__text`}>
          {renderEyebrow()}
          {renderTitle()}
          {renderText()}
          {renderCatalogButton()}
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
        {renderMedia()}
        {renderContent()}
      </section>
  }
})
