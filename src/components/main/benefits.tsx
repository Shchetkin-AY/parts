import { computed, defineComponent } from 'vue'
import { GIcon } from '@/components'
import { BenefitsItem, BenefitsItems, Colors, Icons } from '@/utils'
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
          <GIcon icon={icon} size={iconSize.value} color={Colors.primary} />
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

    const renderItem = ({ icon, title, text }: BenefitsItem) => {
      return (
        <article class={`${className}__item`} >
          {renderItemIcon(icon)}
          {renderItemContent(title, text)}
        </article>
      )
    }

    const renderItems = () => {
      return BenefitsItems.map(item => {
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
