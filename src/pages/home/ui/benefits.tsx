import { computed, defineComponent } from 'vue'
import { UiIcon } from '@/components'
import { BenefitItem, Color, Icons } from '@/utils'
import { benefitItems } from '@/data'
import { useViewportStore } from '@/stores'

export default defineComponent({
  name: 'Benefits',

  setup() {
    const viewportStore = useViewportStore()

    const className = 'benefits'

    const iconSize = computed<number>(() => {
      if (viewportStore.size.width > 720) {
        return 46
      }

      return 28
    })

    const renderItemIcon = (icon: Icons) => {
      return (
        <div class={`${className}__item-icon`}>
          <UiIcon icon={icon} size={iconSize.value} color={Color.primary} />
        </div>
      )
    }
    const renderItemContent = (title: string, text: string) => {
      return (
        <div class={`${className}__item-content`}>
          <div class={`${className}__item-title`}>{title}</div>
          <div class={`${className}__item-text`}>{text}</div>
        </div>
      )
    }

    const renderItem = ({ icon, title, text }: BenefitItem) => {
      return (
        <article class={`${className}__item`} >
          {renderItemIcon(icon)}
          {renderItemContent(title, text)}
        </article>
      )
    }

    const renderItems = () => {
      return benefitItems.map(item => {
        return renderItem(item)
      })
    }

    return () => {
      return (
        <div class={className}>
          {renderItems()}
        </div>
      )
    }
  }
})
