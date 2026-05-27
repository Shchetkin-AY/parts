import { Teleport, defineComponent, nextTick, onBeforeUnmount, ref, watch } from 'vue'
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

    const renderBrand = () =>
      <div class="navigation__brand">ISKOR</div>

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
        <a class={{
          navigation__link: true,
          'navigation__link--active': Boolean(isActive)
        }} href={href}>
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
        <GIcon icon={Icons.phone} size={30} />
        <div class={'navigation__phone-content'}>
          <div class={'navigation__phone-content-title'}>+7 913 813 55 22</div>
          <div class={'navigation__phone-content-subtitle'}>Консультация по телефону</div>
        </div>
      </a>

    const renderActions = () =>
      <div class="navigation__actions">
        {renderPhoneIcon()}
        <button class="navigation__menu" aria-label="Открыть меню" onClick={openMenu}>
          <GIcon icon={Icons.menu} size={26} />
        </button>
      </div>

    const renderMenuDrawer = () => {
      if (!menuMounted.value) {
        return null
      }

      return (
        <Teleport to="body">
          <div class={'navigation__overlay ' + (isMenuOpen.value ? 'open' : '')} onClick={closeMenu} />

          <aside class={'navigation__drawer ' + (isMenuOpen.value ? 'open' : '')} role="dialog" aria-modal={true} aria-label="Меню навигации">
            <div class="navigation__drawer-header">
              <button class="navigation__drawer-close" aria-label="Закрыть меню" onClick={closeMenu}>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M6 18L18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <div class="navigation__drawer-content">
              {links.map(link =>
                <div class="navigation__drawer-item" onClick={closeMenu}>
                  {renderLink(link)}
                </div>)}
            </div>
          </aside>
        </Teleport>
      )
    }

    return () =>
      <nav class="navigation" aria-label="Основная навигация">
        <div class="navigation__container">
          {renderBrand()}
          {renderLinks()}
          {renderActions()}
        </div>
        {renderMenuDrawer()}
      </nav>
  }
})
