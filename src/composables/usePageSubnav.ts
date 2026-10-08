import { type Ref, nextTick, ref } from 'vue'

import { PageSubnavItem } from '@/utils'

interface UsePageSubnavReturn {
  items: Ref<PageSubnavItem[]>
  activeId: Ref<string>
  register: (newItems: PageSubnavItem[]) => void
  unregister: () => void
  scrollTo: (id: string, behavior?: ScrollBehavior) => void
}

const SCROLL_OFFSET = 24

// ── Singleton state ────────────────────────────────────
// Живёт на уровне модуля — один на всё приложение.
// Все вызовы usePageSubnav() получают ссылки на одни и те же refs.

const items = ref<PageSubnavItem[]>([])
const activeId = ref('')

let sections: HTMLElement[] = []
let ticking = false
let isListening = false

const getNavigationHeight = (): number => {
  const nav = document.querySelector('.navigation')

  return nav?.getBoundingClientRect().height ?? 0
}

const collectSections = () => {
  sections = items.value
    .map(item => document.getElementById(item.id))
    .filter((el): el is HTMLElement => el !== null)
}

const updateActiveId = () => {
  ticking = false

  const viewportMiddle = window.innerHeight / 2
  const firstSection = sections[0]

  if (!firstSection || firstSection.getBoundingClientRect().top > viewportMiddle) {
    activeId.value = ''

    return
  }

  const activeSection = sections.reduce<HTMLElement | null>((current, section) => {
    if (section.getBoundingClientRect().top <= viewportMiddle) {
      return section
    }

    return current
  }, null)

  activeId.value = activeSection?.id ?? ''
}

const handleScroll = () => {
  if (ticking) {
    return
  }

  ticking = true
  requestAnimationFrame(updateActiveId)
}

const startListening = () => {
  if (isListening) {
    return
  }

  isListening = true
  window.addEventListener('scroll', handleScroll, { passive: true })
}

const stopListening = () => {
  if (!isListening) {
    return
  }

  isListening = false
  window.removeEventListener('scroll', handleScroll)
}

const scrollTo = (id: string, behavior: ScrollBehavior = 'smooth') => {
  const section = document.getElementById(id)

  if (!section) {
    return
  }

  const top =
    section.getBoundingClientRect().top +
    window.scrollY -
    getNavigationHeight() -
    SCROLL_OFFSET

  window.scrollTo({
    top,
    behavior
  })
  window.history.pushState(null, '', `#${id}`)
}

const register = (newItems: PageSubnavItem[]) => {
  items.value = newItems
  startListening()

  void nextTick(() => {
    collectSections()
    updateActiveId()

    const hash = window.location.hash.slice(1)
    const hasSection = sections.some(el => el.id === hash)

    if (hash && hasSection) {
      scrollTo(hash, 'auto')
    }
  })
}

const unregister = () => {
  items.value = []
  activeId.value = ''
  sections = []

  stopListening()
}

export const usePageSubnav = (): UsePageSubnavReturn => {
  return {
    items,
    activeId,
    register,
    unregister,
    scrollTo
  }
}
