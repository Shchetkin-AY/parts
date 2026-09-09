import { computed, defineComponent, ref } from 'vue'

import {
  Color,
  RotorCenterItem,
  RotorCenterSelection, Size, formatPrice,
  rotorCenterItems
} from '@/utils'
import { UiChip } from '@/ui'

export default defineComponent({
  name: 'RotorCenter',

  emits: [ 'select' ],

  setup(_, { emit }) {
    const className = 'rotor-center'

    const currentItem = ref(rotorCenterItems[0])
    const previewIndex = ref(0)

    const previewImages = computed(() => {
      return currentItem.value.previews ?? []
    })

    const currentPreview = computed(() => {
      return previewImages.value[previewIndex.value] ?? previewImages.value[0]
    })

    const hasPreviewThumbs = computed(() => previewImages.value.length > 0)

    const selectItem = (item: RotorCenterItem) => {
      currentItem.value = item
      previewIndex.value = 0

      emit('select', { item } as RotorCenterSelection)
    }

    const setPreviewIndex = (index: number) => {
      previewIndex.value = index
    }

    const renderHeader = () => {
      return (
        <div class={`${className}__header`}>
          <h3 class={`${className}__header-title`}>
            Центр диска под вашу ступицу
          </h3>
        </div>
      )
    }

    const renderItemPrice = (item: RotorCenterItem) => {
      if (item.price <= 0) {
        return null
      }

      return (
        <UiChip
          label={`+ ${formatPrice(item.price)}`}
          size={Size.medium}
          color={Color.warning}
        />
      )
    }

    const renderItem = (item: RotorCenterItem) => {
      const isActive = currentItem.value.id === item.id

      return (
        <button
          class={{
            [`${className}__item`]: true,
            [`${className}__item--active`]: isActive
          }}
          type="button"
          onClick={() => selectItem(item)}
          key={item.id}
        >
          <span class={`${className}__item-content`}>
            <span class={`${className}__item-title`}>
              {item.title}
              {renderItemPrice(item)}
            </span>
            <span class={`${className}__item-description`}>
              {item.description}
            </span>
          </span>
        </button>
      )
    }

    const renderItems = () => {
      return (
        <div class={`${className}__items`}>
          {rotorCenterItems.map(renderItem)}
        </div>
      )
    }

    const renderPreviewThumbs = () => {
      if (!hasPreviewThumbs.value) {
        return null
      }

      return (
        <div class={`${className}__preview-thumbs`}>
          {previewImages.value.map((src, index) =>
            <button
              class={{
                [`${className}__preview-thumb`]: true,
                [`${className}__preview-thumb--active`]: index === previewIndex.value
              }}
              type="button"
              aria-label={`Превью ${index + 1}`}
              onClick={() => setPreviewIndex(index)}
              key={src}
            >
              <img src={src} alt="" />
            </button>)}
        </div>
      )
    }

    const renderPreviewMain = () => {
      return (
        <div class={`${className}__preview-main`}>
          <img
            class={`${className}__preview-image`}
            src={currentPreview.value}
            alt={`Центр диска ${currentItem.value.title}`}
          />
          <UiChip
            label="пример цвета"
            size={Size.medium}
            color={Color['text-muted']}
            position="absolute"
            coordinates={{
              bottom: 10,
              left: 10
            }}
          />
        </div>
      )
    }

    const renderContent = () => {
      return (
        <div class={`${className}__content`}>
          {renderItems()}
          <div class={`${className}__preview`}>
            {renderPreviewMain()}
            {renderPreviewThumbs()}
          </div>
        </div>
      )
    }

    return () => {
      return (
        <section class={className}>
          {renderHeader()}
          {renderContent()}
        </section>
      )
    }
  }
})
