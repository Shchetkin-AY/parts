import { defineComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { GIcon } from './g'
import { Icons } from '@/utils'

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

    const callHandler = () => {
      window.location.href = 'tel:+79138135522'
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

    const renderPhoneIcon = () => {
      return (
        <a class={'navigation__phone'} onClick={callHandler}>
          <GIcon icon={Icons.phone} size={30} />
          <div class={'navigation__phone-content'}>
            <div class={'navigation__phone-content-title'}>+7 913 813 55 22</div>
            <div class={'navigation__phone-content-subtitle'}>Консультация по телефону</div>
          </div>
        </a>
      )
    }

    const renderActions = () => {
      return (
        <div class="navigation__actions">
          {renderPhoneIcon()}
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
