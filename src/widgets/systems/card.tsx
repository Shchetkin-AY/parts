import { Color, SystemCardItem, SystemsSeriesTypes } from '@/utils'
import { PropType, defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { UiIcon } from '@/ui'
import { Icons } from '@/utils'

const catalogSeriesByType: Record<SystemsSeriesTypes, string> = {
  [SystemsSeriesTypes.s]: 'S-Series',
  [SystemsSeriesTypes.r]: 'R-Series',
  [SystemsSeriesTypes.n]: 'N-Series',
  [SystemsSeriesTypes.sr]: 'SR-Series'
}

export default defineComponent({
  name: 'SystemsCard',

  props: {
    value: {
      type: Object as PropType<SystemCardItem>,
      required: true
    }
  },

  setup(props) {
    const className = 'systems-card'

    const renderImage = () => {
      return (
        <div class={`${className}__media`}>
          <img
            class={`${className}__image`}
            src={props.value.image}
            alt={props.value.title}
            loading="lazy"
            decoding="async"
          />
        </div>
      )
    }
    const renderOverlay = () => {
      return <div class={`${className}__overlay`} />
    }

    const renderFeature = (feature: string) => {
      return (
        <div class={`${className}__feature`}>
          <UiIcon icon={Icons.check} color={Color.primary} />
          <span>{feature}</span>
        </div>
      )
    }

    const renderHeader = () => {
      return (
        <div class={`${className}__header`}>
          <div class={`${className}__title`}>{props.value.title}</div>
          <div class={`${className}__subtitle`}>{props.value.subtitle}</div>
        </div>
      )
    }
    const renderFeatures = () => {
      return (
        <div class={`${className}__features`}>
          {props.value.features.map(feature => renderFeature(feature))}
        </div>
      )
    }
    const renderContent = () => {
      return (
        <div class={`${className}__content`}>
          {renderHeader()}
          {renderFeatures()}
        </div>
      )
    }

    return () => {
      return (
        <RouterLink
          class={className}
          to={{
            name: 'catalog',
            query: {
              series: catalogSeriesByType[props.value.type]
            }
          }}
        >
          {renderImage()}
          {renderOverlay()}
          {renderContent()}
        </RouterLink>
      )
    }
  }
})
