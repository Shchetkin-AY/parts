import { computed, defineComponent, ref } from 'vue'

import {
  Color,
  PaletteGroupTypes,
  PaletteItem,
  PaletteSelection,
  Size,
  formatPrice,
  paletteGroupPrices,
  paletteGroups,
  paletteItemsByGroup
} from '@/utils'
import { UiChip } from '@/ui'

export default defineComponent({
  name: 'Palette',

  emits: [ 'select' ],

  setup(_, { emit }) {
    const className = 'palette'

    const currentGroup = ref<PaletteGroupTypes>(PaletteGroupTypes.base)
    const currentItem = ref<PaletteItem>(
      paletteItemsByGroup[PaletteGroupTypes.base][0]
    )
    const previewIndex = ref(0)
    const singlePreviewItems = new Set([ 'tiffany', 'pink', 'green', 'gold', 'purple' ])

    const groupDescriptions: Record<PaletteGroupTypes, string> = {
      [PaletteGroupTypes.base]: 'Вакуумное покрытие + анодирование, цвет в самом металле. Не выцветает и не отслаивается: цвет живёт в металле, а не на нём.',
      [PaletteGroupTypes.custom]: 'Вакуумное напыление металлов — фирменный переливающийся цвет. Не окисляется, честно передаёт цвет металла, решает проблему облезающей краски.',
      [PaletteGroupTypes.cerakote]: 'Cerackote — керамика (США). Матовая керамика с металлическими частицами — премиум-отделка. Устойчивость к химии и коррозии.'
    }

    const currentItems = computed(() => {
      return paletteItemsByGroup[currentGroup.value]
    })

    const getPreviewImages = (item: PaletteItem, group: PaletteGroupTypes): string[] => {
      if (item.previews?.length) {
        return item.previews
      }

      const basePath = `/colors/${group}/${item.id}`
      const images = [
        `${basePath}/0.webp`,
        `${basePath}/1.webp`,
        `${basePath}/2.webp`
      ]

      if (singlePreviewItems.has(item.id)) {
        images.splice(2)
      }

      return images
    }

    const previewImages = computed(() => {
      return getPreviewImages(currentItem.value, currentGroup.value)
    })

    const currentPreview = computed(() => {
      return previewImages.value[previewIndex.value] ?? previewImages.value[0]
    })

    const selectGroup = (group: PaletteGroupTypes) => {
      currentGroup.value = group
      const firstItem = paletteItemsByGroup[group][0]
      if (!firstItem) {
        return
      }

      currentItem.value = firstItem
      previewIndex.value = 0

      emit('select', {
        group,
        item: firstItem
      } as PaletteSelection)
    }

    const selectItem = (group: PaletteGroupTypes, item: PaletteItem) => {
      currentGroup.value = group
      currentItem.value = item
      previewIndex.value = 0

      emit('select', {
        group,
        item
      } as PaletteSelection)
    }

    const setPreviewIndex = (index: number) => {
      previewIndex.value = index
    }

    const renderPreviewThumbs = () => {
      if (previewImages.value.length <= 1) {
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

    const renderHeader = () => {
      return (
        <div class={`${className}__header`}>
          <h3 class={`${className}__header-title`}>
            Цвет суппорта
          </h3>
        </div>
      )
    }

    const renderColorGroupPrice = (group: PaletteGroupTypes) => {
      if (group === PaletteGroupTypes.base) {
        return null
      }

      return (
        <UiChip
          label={`+ ${formatPrice(paletteGroupPrices[group])}`}
          size={Size.medium}
          color={Color.info}
        />
      )
    }
    const renderGroupTitle = (group: PaletteGroupTypes) => {
      return (
        <span class={`${className}__group-title`}>
          {paletteGroups[group]}
          {renderColorGroupPrice(group)}
        </span>
      )
    }
    const renderGroupDescription = (group: PaletteGroupTypes) => {
      return (
        <span class={`${className}__group-description`}>
          {groupDescriptions[group]}
        </span>
      )
    }
    const renderGroupContent = (group: PaletteGroupTypes) => {
      return (
        <span class={`${className}__group-content`}>
          {renderGroupTitle(group)}
          {renderGroupDescription(group)}
        </span>
      )
    }

    const renderColorGroup = (group: PaletteGroupTypes) => {
      return (
        <button
          class={{
            [`${className}__group`]: true,
            [`${className}__group--active`]: currentGroup.value === group
          }}
          type="button"
          onClick={() => selectGroup(group)}
          key={group}
        >
          {renderGroupContent(group)}
        </button>
      )
    }
    const renderColorGroups = () => {
      return (
        <div class={`${className}__groups`}>
          {Object.values(PaletteGroupTypes).map(renderColorGroup)}
        </div>
      )
    }

    const renderColor = (item: PaletteItem) => {
      const isActive = currentItem.value.id === item.id

      return (
        <button
          class={{
            [`${className}__preview-color`]: true,
            [`${className}__preview-color--${item.id}`]: true,
            [`${className}__preview-color--active`]: isActive
          }}
          type="button"
          title={item.title}
          aria-label={`Выбрать цвет ${item.title}`}
          aria-pressed={isActive}
          onClick={() => selectItem(currentGroup.value, item)}
          key={item.id}
        >
          <span class={`${className}__preview-color-swatch ${className}__preview-color-swatch--${item.id}`} />
          <span class={`${className}__preview-color-title`} innerHTML={item.title} />
        </button>
      )
    }
    const renderColors = () => {
      return (
        <div class={`${className}__preview-colors`}>
          {currentItems.value.map(renderColor)}
        </div>
      )
    }
    const renderPreviewMainImage = () => {
      return (
        <img
          class={`${className}__preview-image`}
          src={currentPreview.value}
          alt={`Пример цвета ${currentItem.value.title}`}
        />
      )
    }
    const renderPreviewMainChip = () => {
      return (
        <UiChip
          label={'пример цвета'}
          size={Size.medium}
          color={Color['text-muted']}
          position={'absolute'}
          coordinates={{
            bottom: 10,
            left: 10
          }}
        />
      )
    }
    const renderPreviewMain = () => {
      return (
        <div class={`${className}__preview-main`}>
          {renderPreviewMainImage()}
          {renderPreviewMainChip()}
        </div>
      )
    }
    const renderPreviewImages = () => {
      return (
        <div class={`${className}__preview-images`}>
          {renderPreviewMain()}
          {renderPreviewThumbs()}
        </div>
      )
    }
    const renderPreview = () => {
      return (
        <div class={`${className}__preview`}>
          {renderColors()}
          {renderPreviewImages()}
        </div>
      )
    }

    const renderContent = () => {
      return (
        <div class={`${className}__content`}>
          {renderColorGroups()}
          {renderPreview()}
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
