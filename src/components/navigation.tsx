import { defineComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

interface NavigationLink {
  href: string
  isActive?: boolean
  label: string
}

const links: NavigationLink[] = [
  {
    label: 'Главная',
    href: '/'
  },
  {
    label: 'Каталог',
    href: '/catalog'
  },
  {
    label: 'О бренде',
    href: '/about'
  }
]

export default defineComponent({
  name: 'Navigation',

  setup() {
    const route = useRoute()

    const isRouteLink = (href: string): boolean => {
      return href.startsWith('/')
    }
    const isRouteLinkActive = (href: string): boolean => {
      return route.path === href
    }

    const renderBrand = () => {
      return (
        <div class="navigation__brand">Steel Core</div>
      )
    }

    const renderLink = ({ label, href, isActive }: NavigationLink) => {
      if (isRouteLink(href)) {
        return (
          <RouterLink
            class={{
              navigation__link: true,
              'navigation__link--active': isRouteLinkActive(href)
            }}
            to={href}
          >
            {label}
          </RouterLink>
        )
      }

      return (
        <a
          class={{
            navigation__link: true,
            'navigation__link--active': Boolean(isActive)
          }}
          href={href}
        >
          {label}
        </a>
      )
    }

    const renderLinks = () => {
      return (
        <div class="navigation__links">
          {links.map(link => renderLink(link))}
        </div>
      )
    }

    const renderSearchButton = () => {
      return (
        <button class="navigation__icon" aria-label="Поиск" type="button">
          <span class="material-symbols-outlined">phone</span>
        </button>
      )
    }

    const renderMenuButton = () => {
      return (
        <button class="navigation__menu" aria-label="Открыть меню" type="button">
          <span class="material-symbols-outlined">menu</span>
        </button>
      )
    }

    const renderActions = () => {
      return (
        <div class="navigation__actions">
          {renderSearchButton()}
          {renderMenuButton()}
        </div>
      )
    }

    return () =>
      <nav class="navigation" aria-label="Основная навигация">
        <div class="navigation__container">
          {renderBrand()}
          {renderLinks()}
          {renderActions()}
        </div>
      </nav>
  }
})
