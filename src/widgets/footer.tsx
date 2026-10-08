import { UiButton } from '@/components'
import Feedback from '@/features/feedback'
import { Color, FooterColumn, FooterLink, footerColumns } from '@/utils'
import { defineComponent, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { JSX } from 'vue/jsx-runtime'

export default defineComponent({
  name: 'Footer',

  setup() {
    const className = 'footer'

    const showFeedback = ref(false)

    const renderLink = (link: FooterLink) => {
      if (link.external) {
        return (
          <a
            class={`${className}__link`}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </a>
        )
      }

      return (
        <RouterLink
          class={`${className}__link`}
          to={link.href}
          key={link.href}
        >
          {link.label}
        </RouterLink>
      )
    }

    const renderColumn = (column: FooterColumn) => {
      const isContacts = column.title === 'Контакты'

      return (
        <div class={`${className}__column`} key={column.title}>
          <div class={`${className}__column-title`}>{column.title}</div>
          <div class={`${className}__column-links`}>
            {column.links.map(renderLink)}
            {isContacts && renderSocials()}
          </div>
        </div>
      )
    }

    const renderColumns = () => {
      return (
        <div class={`${className}__columns`}>
          {footerColumns.map(renderColumn)}
        </div>
      )
    }

    const renderBrand = () => {
      return (
        <div class={`${className}__brand`}>
          <RouterLink class={`${className}__logo`} to="/">
            ISKOR
          </RouterLink>
          <p class={`${className}__tagline`}>
            Инженерные решения для вашего автомобиля.<br/>
            От готовых комплектов до индивидуальных проектов
          </p>
        </div>
      )
    }

    const renderTelegramIcon = () => {
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21.9 4.3 2.7 11.7c-1.3.5-1.3 1.3-.2 1.6l4.9 1.5 1.9 5.8c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.8-.8l3.2-15.2c.3-1.3-.5-1.9-1.4-1.5ZM8.5 13.7l9.7-6.1c.5-.3.9-.1.5.2l-8.1 7.3-.3 3.5Z"
          />
        </svg>
      )
    }

    const renderDrive2Icon = () => {
      return <span class={`${className}__social-label`}>D2</span>
    }

    const renderSocial = (
      href: string,
      label: string,
      icon: () => JSX.Element
    ) => {
      return (
        <a
          class={`${className}__social`}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
        >
          {icon()}
        </a>
      )
    }

    const renderSocials = () => {
      return (
        <div class={`${className}__socials`}>
          {renderSocial('https://t.me/iskor', 'Telegram', renderTelegramIcon)}
          {renderSocial('https://drive2.ru/iskor', 'DRIVE2', renderDrive2Icon)}
        </div>
      )
    }

    const renderActions = () => {
      return (
        <div class={`${className}__actions`}>
          <UiButton
            label="Получить консультацию"
            color={Color.primary}
            onClick={() => showFeedback.value = true}
          />
        </div>
      )
    }

    const renderTop = () => {
      return (
        <div class={`${className}__top`}>
          {renderBrand()}
          {renderActions()}
        </div>
      )
    }

    const renderBottom = () => {
      return (
        <div class={`${className}__bottom`}>
          <span class={`${className}__copyright`}>
            © 2026 ISKOR · ISO 9001:2015
          </span>
        </div>
      )
    }

    const renderFeedback = () => {
      return (
        <Feedback
          v-model={showFeedback.value}
          topic="Запрос консультации"
        />
      )
    }

    return () => {
      return (
        <footer class={className}>
          <div class={`${className}__card`}>
            {renderTop()}
            {renderColumns()}
          </div>
          {renderBottom()}
          {renderFeedback()}
        </footer>
      )
    }
  }
})
