import { PropType, defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

import { UiIcon } from '@/components'
import { Color, Icons, SystemCardItem, SystemsSeriesTypes } from '@/utils'

const catalogSeriesByType: Record<SystemsSeriesTypes, string> = {
  [SystemsSeriesTypes.s]: 'S-Series',
  [SystemsSeriesTypes.r]: 'R-Series',
  [SystemsSeriesTypes.n]: 'N-Series',
  [SystemsSeriesTypes.sr]: 'SR-Series'
}

export const HomeSystemCard = defineComponent({
  name: 'HomeSystemCard',

  props: {
    item: {
      type: Object as PropType<SystemCardItem>,
      required: true
    }
  },

  setup(props) {
    const className = 'home-system-card'

    const renderImage = () => {
      return (
        <div class={`${className}__media`}>
          <img
            class={`${className}__image`}
            src={props.item.image}
            alt={props.item.title}
            loading="lazy"
            decoding="async"
          />
        </div>
      )
    }

    const renderOverlay = () => {
      return <div class={`${className}__overlay`} />
    }

    const renderFeatures = () => {
      return (
        <div class={`${className}__features`}>
          {props.item.features.map(feature =>
            <div class={`${className}__feature`} key={feature}>
              <UiIcon icon={Icons.check} color={Color.primary} />
              <span>{feature}</span>
            </div>)}
        </div>
      )
    }

    const renderContent = () => {
      return (
        <div class={`${className}__content`}>
          <header class={`${className}__header`}>
            <div class={`${className}__title`}>{props.item.title}</div>
            <div class={`${className}__subtitle`}>{props.item.subtitle}</div>
          </header>
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
              series: catalogSeriesByType[props.item.type]
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
