import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useHorizontalCarousel = () => {
  const viewportRef = ref<HTMLElement | null>(null)
  const canScrollPrev = ref(false)
  const canScrollNext = ref(false)

  const updateScrollState = () => {
    const element = viewportRef.value

    if (!element) {
      canScrollPrev.value = false
      canScrollNext.value = false

      return
    }

    canScrollPrev.value = element.scrollLeft > 0
    canScrollNext.value = element.scrollLeft + element.clientWidth < element.scrollWidth - 1
  }

  const getScrollStep = (): number => {
    const element = viewportRef.value

    if (!element) {
      return 0
    }

    const card = element.firstElementChild as HTMLElement | null

    if (!card) {
      return element.clientWidth
    }

    const gap = parseFloat(getComputedStyle(element).columnGap) || 0

    return card.getBoundingClientRect().width + gap
  }

  const scroll = (direction: -1 | 1) => {
    viewportRef.value?.scrollBy({
      left: direction * getScrollStep(),
      behavior: 'smooth'
    })
  }

  const scrollPrev = () => scroll(-1)
  const scrollNext = () => scroll(1)

  onMounted(() => {
    updateScrollState()
    window.addEventListener('resize', updateScrollState)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScrollState)
  })

  return {
    viewportRef,
    canScrollPrev,
    canScrollNext,
    updateScrollState,
    scrollPrev,
    scrollNext
  }
}
