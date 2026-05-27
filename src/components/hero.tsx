import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { GButton } from './g/button'
import { Colors } from '@/utils'

export default defineComponent({
  name: 'Hero',

  setup() {
    const router = useRouter()

    const navigateToCatalog = (): void => {
      void router.push({ name: 'catalog' })
    }

    const renderBackground = () => {
      return (
        <div class="hero__background" aria-hidden="true">
          <span class="hero__background-text hero__background-text--top">
            savaniny
          </span>
          <span class="hero__background-text hero__background-text--bottom">
            systems
          </span>
        </div>
      )
    }

    const renderImage = () => {
      return (
        <img
          class="hero__image"
          src={'/hero.png'}
        />
      )
    }

    const renderMedia = () => {
      return (
        <div class="hero__media">
          <div class="hero__image-wrap">
            {renderImage()}
          </div>
        </div>
      )
    }

    const renderEyebrow = () => {
      return (
        <span class="hero__eyebrow">Performance Engineering Division</span>
      )
    }

    const renderTitle = () => {
      return (
        <h1 class="hero__title">
          SAVANINI <br /> <span>SYSTEMS</span>
        </h1>
      )
    }

    const renderText = () => {
      return (
        <p class="hero__text">
          Технологический авангард тормозных систем. Ковка под давлением 2000Т и прецизионная обработка авиационного алюминия 6061-T6.
        </p>
      )
    }

    const renderCopy = () => {
      return (
        <div class="hero__copy">
          {renderEyebrow()}
          {renderTitle()}
          {renderText()}
        </div>
      )
    }

    const renderActions = () => {
      return (
        <div class="hero__actions">
          <GButton label="Подобрать комплект" color={Colors.primary} onClick={navigateToCatalog} />
        </div>
      )
    }

    const renderContent = () => {
      return (
        <div class="hero__content">
          <div class="hero__stack">
            {renderCopy()}
            {renderActions()}
          </div>
        </div>
      )
    }

    return () =>
      <section class="hero">
        <div class="hero__container">
          {renderBackground()}
          {renderMedia()}
          {renderContent()}
        </div>
      </section>
  }
})
