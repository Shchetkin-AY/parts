// subnav.tsx
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { subnavItems } from '@/data'

export default defineComponent({
  name: 'Subnav',

  setup() {
    const activeId = ref('')
    const sections: HTMLElement[] = []

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

      window.addEventListener('scroll', updateActiveId, { passive: true })
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', updateActiveId)
    })

    const renderLink = (item: [string, string]) => {
      const [ id, label ] = item

      return (
        <a href={`#${id}`} class={{ 'is-active': activeId.value === id }} key={id}>
          {label}
        </a>
      )
    }

    const renderLinks = () => subnavItems.map(renderLink)

    const renderContainer = () => <div class="accessories-page__container">{renderLinks()}</div>

    return () =>
      <section class="isk-page__section isk-page__section--contained accessories-page__subnav">
        <nav aria-label="Разделы страницы">
          {renderContainer()}
        </nav>
      </section>
  }
})
