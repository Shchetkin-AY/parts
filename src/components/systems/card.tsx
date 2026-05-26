import { SystemCard } from '@/utils'
import { PropType, computed, defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { GIcon } from '@/components'
import { Icons } from '@/utils'

export default defineComponent({
  name: 'SystemsCard',

  props: {
    value: {
      type: Object as PropType<SystemCard>,
      required: true
    }
  },

  setup(props) {
    const classes = computed(() => ({
      'systems-card': true,
      [`systems-card--${props.value.type}`]: true
    }))

    const renderHeader = () => {
      return (
        <div class="systems-card__header">
          <h3 class="systems-card__title">{props.value.title}</h3>
          <p class="systems-card__subtitle">{props.value.subtitle}</p>
        </div>
      )
    }

    const renderImage = () => {
      return (
        <div class="systems-card__media">
          <img
            src={props.value.image}
            alt={props.value.title}
            class="systems-card__image"
          />
        </div>
      )
    }

    const renderFeature = (feature: string) => {
      return (
        <div class="systems-card__feature">
          <GIcon icon={Icons.check} color="primary"/>
          <span>{feature}</span>
        </div>
      )
    }

    const renderFeatures = () => {
      return (
        <div class="systems-card__features">
          {props.value.features.map(feature => renderFeature(feature))}
        </div>
      )
    }

    return () => {
      return (
        <RouterLink class={classes.value} to={{ name: 'catalog' }}>
          {renderImage()}

          <div class="systems-card__overlay" />

          <div class="systems-card__content">
            {renderHeader()}
            {renderFeatures()}
          </div>
        </RouterLink>
      )
    }
  }
})
