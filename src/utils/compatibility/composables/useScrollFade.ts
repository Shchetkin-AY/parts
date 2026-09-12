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
  update: () => void
}

/**
 * Отслеживает вертикальный скролл контейнера и сообщает,
 * есть ли ещё контент ниже видимой области.
 *
 * `sources` — реактивные источники, при изменении которых нужно
 * пересчитать флаг. Обычно это список данных и флаг открытия панели.
 */
export const useScrollFade = (
  sources: WatchSource[] = []
): UseScrollFadeReturn => {
  const viewportRef = ref<HTMLElement | null>(null)
  const hasMore = ref(false)

  const update = () => {
    const el = viewportRef.value

    if (!el) {
      hasMore.value = false

      return
    }

    const canScroll = el.scrollHeight > el.clientHeight + 1
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4

    hasMore.value = canScroll && !atBottom
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
    update
  }
}
