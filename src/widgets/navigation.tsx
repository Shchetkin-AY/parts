import { Teleport, defineComponent, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { UiButton, UiIcon } from '@/ui'
import { Color, Icons } from '@/utils'

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
    label: 'Комплекты',
    href: '/catalog'
  },
  {
    label: 'Комплектующие',
    href: '/accessories'
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

    const menuMounted = ref(false)
    const isMenuOpen = ref(false)
    let closeTimer: ReturnType<typeof setTimeout> | null = null
    let prevBodyOverflow: string | null = null

    const isRouteLink = (href: string): boolean => href.startsWith('/')
    const isRouteLinkActive = (href: string): boolean => route.path === href

    const callHandler = () => {
      window.location.href = 'tel:+79138135522'
    }

    const openMenu = async () => {
      if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
      }
      menuMounted.value = true
      await nextTick()
      document.querySelector('.navigation__drawer')?.getBoundingClientRect()
      isMenuOpen.value = true
    }

    const closeMenu = () => {
      isMenuOpen.value = false
      if (closeTimer) {
        clearTimeout(closeTimer)
      }
      closeTimer = setTimeout(() => {
        menuMounted.value = false
        closeTimer = null
      }, 300)
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
      }
    }

    watch(menuMounted, val => {
      if (val) {
        prevBodyOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleKeydown)
      } else {
        if (prevBodyOverflow !== null) {
          document.body.style.overflow = prevBodyOverflow
        }
        prevBodyOverflow = null
        document.removeEventListener('keydown', handleKeydown)
      }
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleKeydown)
      if (closeTimer) {
        clearTimeout(closeTimer)
      }
      if (prevBodyOverflow !== null) {
        document.body.style.overflow = prevBodyOverflow
      }
    })

    const renderBrand = () => {
      return (
        <RouterLink
          class="navigation__brand"
          innerHTML={'ISKOR'}
          to={'/'}
        />
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
            ['navigation__link']: true,
            ['navigation__link--active']: Boolean(isActive)
          }}
          href={href}
        >
          {label}
        </a>
      )
    }

    const renderLinks = () =>
      <div class="navigation__links">
        {links.map(link => renderLink(link))}
      </div>

    const renderPhoneIcon = () =>
      <a class={'navigation__phone'} onClick={callHandler}>
        <UiIcon icon={Icons.phone} size={30} />
        <div class={'navigation__phone-content'}>
          <div class={'navigation__phone-content-title'}>+7 913 813 55 22</div>
          <div class={'navigation__phone-content-subtitle'}>Консультация по телефону</div>
        </div>
      </a>

    const renderActions = () => {
      return (
        <div class="navigation__actions">
          {renderPhoneIcon()}
          <div class="navigation__menu" >
            <UiButton
              icon={Icons.menu}
              iconColor={Color['text-primary']}
              onClick={openMenu}
            />
          </div>
        </div>
      )
    }

    const renderMenuOverlay = () => {
      return (
        <div
          class={{
            ['navigation__overlay']: true,
            ['open']: isMenuOpen.value
          }}
          onClick={closeMenu}
        />
      )
    }
    const renderCloseMenuButton = () => {
      return (
        <div class="navigation__drawer-header">
          <UiButton
            icon={Icons.close}
            iconColor={Color['text-primary']}
            onClick={closeMenu}
          />
        </div>
      )
    }
    const renderMenuLinks = () => {
      return links.map(link => {
        return (
          <div class="navigation__drawer-item" onClick={closeMenu}>
            {renderLink(link)}
          </div>
        )
      })
    }
    const renderMenu = () => {
      return (
        <aside
          class={{
            ['navigation__drawer']: true,
            ['open']: isMenuOpen.value
          }}
          role="dialog"
          aria-modal={true}
          aria-label="Меню навигации"
        >
          {renderCloseMenuButton()}
          <div class="navigation__drawer-content">
            {renderMenuLinks()}
          </div>
        </aside>
      )
    }

    const renderMenuDrawer = () => {
      if (!menuMounted.value) {
        return null
      }

      return (
        <Teleport to="body">
          {renderMenuOverlay()}
          {renderMenu()}
        </Teleport>
      )
    }

    return () => {
      return (
        <nav
          class="navigation"
          aria-label="Основная навигация"
        >
          <div class="navigation__container">
            {renderBrand()}
            {renderLinks()}
            {renderActions()}
          </div>
          {renderMenuDrawer()}
        </nav>
      )
    }
  }
})
