import { onBeforeUnmount, onMounted } from 'vue'

export const useScrollReveal = () => {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-reveal]').forEach(element => {
        element.classList.add('is-visible')
      })

      return
    }

    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        })
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0
      }
    )

    document
      .querySelectorAll('[data-reveal]')
      .forEach(element => observer?.observe(element))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
