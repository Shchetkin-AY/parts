import {
  Ref,
  WatchSource,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

interface UseScrollFadeReturn {
  viewportRef: Ref<HTMLElement | null>
  hasMore: Ref<boolean>
  hasLess: Ref<boolean>
  update: () => void
}

export const useScrollFade = (
  sources: WatchSource[] = []
): UseScrollFadeReturn => {
  const viewportRef = ref<HTMLElement | null>(null)
  const hasMore = ref(false)
  const hasLess = ref(false)

  const update = () => {
    const el = viewportRef.value

    if (!el) {
      hasMore.value = false
      hasLess.value = false

      return
    }

    hasMore.value = el.scrollTop + el.clientHeight < el.scrollHeight - 1
    hasLess.value = el.scrollTop > 1
  }

  watch(sources, () => {
    void nextTick(update)
  })

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update)
  })

  return {
    viewportRef,
    hasMore,
    hasLess,
    update
  }
}
