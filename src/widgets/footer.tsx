import { UiButton } from '@/components'
import { Color, FooterColumn, FooterLink, Icons, Size, footerColumns } from '@/utils'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'Footer',

  emits: {
    consult: () => true
  },

  setup(_, { emit }) {
    const className = 'footer'

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

    const openSocial = (href: string): void => {
      window.open(href, '_blank', 'noopener,noreferrer')
    }

    const renderSocial = (href: string, label: string, icon: Icons, color: Color) =>
      <UiButton
        aria-label={label}
        size={Size.small}
        icon={icon}
        color={color}
        iconSize={24}
        width={34}
        onClick={() => openSocial(href)}
      />

    const renderSocials = () => {
      return (
        <div class={`${className}__socials`}>
          {renderSocial('https://t.me/iskor', 'Telegram', Icons.telegram, Color.telegram)}
          {renderSocial('https://drive2.ru/iskor', 'DRIVE2', Icons.drive2, Color.drive2)}
        </div>
      )
    }

    const renderActions = () => {
      return (
        <div class={`${className}__actions`}>
          <UiButton
            label="Получить консультацию"
            color={Color.primary}
            onClick={() => emit('consult')}
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

    return () => {
      return (
        <footer class={className}>
          <div class={`${className}__card`}>
            {renderTop()}
            {renderColumns()}
          </div>
          {renderBottom()}
        </footer>
      )
    }
  }
})
