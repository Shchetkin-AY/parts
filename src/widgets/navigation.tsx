import { RouterLink, useRoute } from 'vue-router'
import { Teleport, Transition, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { UiButton } from '@/ui'
import { usePageSubnav } from '@/hooks'
import { Color, Icons, PageSubnavItem } from '@/utils'
import Feedback from '@/features/feedback'

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
  }
]

// ниже какого порога считаем нав "не поднятым" — не даём тени/бордеру
// мигать из-за пары пикселей overscroll на мобилках
const SCROLL_THRESHOLD = 8
// пока не проскроллили дальше этого значения, не прячем нав вообще —
// иначе он будет уезжать сразу после хедера на длинных страницах
const HIDE_THRESHOLD = 120

export default defineComponent({
  name: 'Navigation',

  setup() {
    const route = useRoute()

    const subnav = usePageSubnav()

    const showFeedback = ref(false)
    const menuMounted = ref(false)
    const isMenuOpen = ref(false)
    let closeTimer: ReturnType<typeof setTimeout> | null = null
    let prevBodyOverflow: string | null = null

    const isScrolled = ref(false)
    const isHidden = ref(false)
    let lastScrollY = 0
    let ticking = false

    const isRouteLink = (href: string): boolean => href.startsWith('/')
    const isRouteLinkActive = (href: string): boolean => route.path === href

    const updateScrollState = (): void => {
      const currentY = window.scrollY

      isScrolled.value = currentY > SCROLL_THRESHOLD

      if (currentY <= HIDE_THRESHOLD) {
        isHidden.value = false
      } else if (currentY > lastScrollY) {
        isHidden.value = true
      } else if (currentY < lastScrollY) {
        isHidden.value = false
      }

      lastScrollY = currentY
      ticking = false
    }

    const handleScroll = (): void => {
      if (ticking) {
        return
      }
      ticking = true
      window.requestAnimationFrame(updateScrollState)
    }

    onMounted(() => {
      lastScrollY = window.scrollY
      updateScrollState()
      window.addEventListener('scroll', handleScroll, { passive: true })
    })

    const openMenu = async (): Promise<void> => {
      if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
      }
      menuMounted.value = true
      await nextTick()
      document.querySelector('.navigation__drawer')?.getBoundingClientRect()
      isMenuOpen.value = true
    }

    const closeMenu = (): void => {
      isMenuOpen.value = false
      if (closeTimer) {
        clearTimeout(closeTimer)
      }
      closeTimer = setTimeout(() => {
        menuMounted.value = false
        closeTimer = null
      }, 300)
    }

    const handleKeydown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        closeMenu()
      }
    }

    watch(
      () => menuMounted,
      val => {
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
      }
    )

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
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
        <RouterLink class="navigation__brand" to={'/'}>
          ISKOR
        </RouterLink>
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
        <RouterLink
          class={{
            ['navigation__link']: true,
            ['navigation__link--active']: Boolean(isActive)
          }}
          to={href}
        >
          {label}
        </RouterLink>
      )
    }

    const renderLinks = () =>
      <div class="navigation__links">
        {links.map(link => renderLink(link))}
      </div>

    const renderPhoneButton = () => {
      return (
        <UiButton
          aria-label="Открыть форму обратной связи"
          icon={Icons.phone}
          color={Color['surface-3']}
          iconColor={Color['text-primary']}
          onClick={() => showFeedback.value = true}
        />
      )
    }

    const renderActions = () => {
      return (
        <div class="navigation__actions">
          {renderPhoneButton()}
          <div class="navigation__menu" >
            <UiButton
              icon={Icons.menu}
              color={Color['surface-3']}
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
            navigation__overlay: true,
            open: isMenuOpen.value
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

    const renderDrawerSubnavItem = (item: PageSubnavItem) => {
      return (
        <div class="navigation__drawer-item" key={item.id}>
          <a
            class="navigation__link"
            href={`#${item.id}`}
            onClick={(event: MouseEvent) => {
              event.preventDefault()
              closeMenu()
              subnav.scrollTo(item.id)
            }}
          >
            {item.label}
          </a>
        </div>
      )
    }
    const renderDrawerSubnav = () => {
      if (subnav.items.value.length === 0) {
        return null
      }

      return (
        <div class="navigation__drawer-subnav">
          {subnav.items.value.map(renderDrawerSubnavItem)}
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
          {renderDrawerSubnav()}
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

    const renderFeedback = () => {
      return (
        <Feedback
          v-model={showFeedback.value}
          topic={'Нужен обратный звонок'}
        />
      )
    }

    const renderSubnavLink = (item: PageSubnavItem) => {
      return (
        <a
          class={{
            'navigation__subnav-link': true,
            'navigation__subnav-link--active': subnav.activeId.value === item.id
          }}
          href={`#${item.id}`}
          key={item.id}
          onClick={(event: MouseEvent) => {
            event.preventDefault()
            subnav.scrollTo(item.id)
          }}
        >
          {item.label}
        </a>
      )
    }

    const renderSubnav = () => {
      return (
        <Transition name="navigation-subnav">
          {subnav.items.value.length > 0
            ?
            <div class="navigation__subnav">
              <div class="navigation__subnav-inner">
                {subnav.items.value.map(renderSubnavLink)}
              </div>
            </div>

            : null}
        </Transition>
      )
    }

    return () => {
      return (
        <nav
          class={{
            navigation: true,
            'navigation--scrolled': isScrolled.value,
            'navigation--hidden': isHidden.value
          }}
          aria-label="Основная навигация"
        >
          <div class="navigation__container">
            {renderBrand()}
            {renderLinks()}
            {renderActions()}
          </div>
          {renderSubnav()}
          {renderMenuDrawer()}
          {renderFeedback()}
        </nav>
      )
    }
  }
})
