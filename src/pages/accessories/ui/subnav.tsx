// subnav.tsx
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { subnavItems } from '@/data'

export default defineComponent({
  name: 'Subnav',

  setup() {
    const activeId = ref('')
    const subnav = ref<HTMLElement | null>(null)
    const sections: HTMLElement[] = []

    const scrollToSection = (id: string, behavior: ScrollBehavior = 'smooth') => {
      const section = document.getElementById(id)
      const navigation = document.querySelector('.navigation')

      if (!section) {
        return
      }

      const navigationHeight = navigation?.getBoundingClientRect().height ?? 0
      const subnavHeight = subnav.value?.getBoundingClientRect().height ?? 0
      const top = section.getBoundingClientRect().top + window.scrollY - navigationHeight - subnavHeight

      window.scrollTo({
        top,
        behavior
      })
    }

    const updateActiveId = () => {
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

    onMounted(() => {
      subnavItems.forEach(([ id ]) => {
        const section = document.getElementById(id)
        if (section) {
          sections.push(section)
        }
      })

      updateActiveId()
      window.addEventListener('scroll', updateActiveId, { passive: true })

      void nextTick(() => {
        const id = window.location.hash.slice(1)
        if (id) {
          scrollToSection(id, 'auto')
          updateActiveId()
        }
      })
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', updateActiveId)
    })

    const renderLink = (item: [string, string]) => {
      const [ id, label ] = item

      return (
        <a
          href={`#${id}`}
          class={{ 'is-active': activeId.value === id }}
          key={id}
          onClick={(event: MouseEvent) => {
            event.preventDefault()
            window.history.pushState(null, '', `#${id}`)
            scrollToSection(id)
          }}
        >
          {label}
        </a>
      )
    }

    const renderLinks = () => subnavItems.map(renderLink)

    const renderContainer = () => <div class="accessories-page__container">{renderLinks()}</div>

    return () =>
      <section ref={subnav} class="isk-page__section isk-page__section--contained accessories-page__subnav">
        <nav aria-label="Разделы страницы">
          {renderContainer()}
        </nav>
      </section>
  }
})
