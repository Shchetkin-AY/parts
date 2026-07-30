import { PaletteGroupTypes, PaletteItem, paletteGroups, paletteItemsByGroup } from '@/utils'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProductColors',

  setup() {
    const className = 'palette'

    const currentItem = ref(paletteItemsByGroup[PaletteGroupTypes.base][0])

    const currentGroup = computed<PaletteGroupTypes>(() => {
      for (const [ group, items ] of Object.entries(paletteItemsByGroup)) {
        if (items.some(item => item.id === currentItem.value.id)) {
          return group as PaletteGroupTypes
        }
      }

      return PaletteGroupTypes.base
    })

    const renderGroupTitle = (title: string) => {
      return (
        <div class={`${className}__group-title`}>
          {title}
        </div>
      )
    }

    const renderItemLabel = (title: string) => {
      return (
        <span class={`${className}__item-label`}>
          {title}
        </span>
      )
    }
    const renderItemInput = (item: PaletteItem) => {
      return (
        <input
          class={{
            [`${className}__item-input`]: true,
            [`${className}__item-input--checked`]: currentItem.value.id === item.id
          }}
          type="radio"
          name="color"
          checked={currentItem.value.id === item.id}
        />
      )
    }
    const renderItemRadio = () => {
      return <span class={`${className}__item-radio`} />
    }
    const renderGroupItem = (item: PaletteItem) => {
      return (
        <div
          class={`${className}__item`}
          onClick={() => currentItem.value = item}
          key={item.id}
        >
          {renderItemInput(item)}
          {renderItemRadio()}
          {renderItemLabel(item.title)}
        </div>
      )
    }
    const renderGroupItems = (items: PaletteItem[]) => {
      return items.map(item => {
        return renderGroupItem(item)
      })
    }
    const renderGroup = (group: PaletteGroupTypes) => {
      return (
        <div class={`${className}__group ${className}__group--${group}`}>
          {renderGroupTitle(paletteGroups[group])}
          {renderGroupItems(paletteItemsByGroup[group])}
        </div>
      )
    }

    const renderSidebar = () => {
      return (
        <div class={`${className}__sidebar`}>
          {Object.values(PaletteGroupTypes).map(renderGroup)}
        </div>
      )
    }

    const renderPreview = () => {
      return (
        <div class={`${className}__preview`}>
          <img
            src={`/colors/${currentGroup.value}/${currentItem.value.id}.webp`}
            alt={currentItem.value.title}
          />
        </div>
      )
    }

    return () =>
      <div class={className}>
        {renderSidebar()}
        {renderPreview()}
      </div>
  }
})
