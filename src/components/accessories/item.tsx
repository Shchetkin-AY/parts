import { AccessoryItem } from '@/utils'
import { PropType, defineComponent } from 'vue'

export default defineComponent({
  name: 'Item',

  props: {
    value: {
      type: Object as PropType<AccessoryItem>,
      default: () => ({})
    }
  },

  setup(props) {
    const renderImage = () => {
      return (
        <div class="accessories__image">
          <img
            class="accessories__image-item"
            src={props.value.image}
            alt={props.value.title}
            loading="lazy"
          />
        </div>
      )
    }

    const renderDescription = () => {
      if (props.value.description) {
        return (
          <div class="accessories__description">
            {props.value.description}
          </div>
        )
      }
    }
    const renderContent = () => {
      return (
        <div class="accessories__content">
          <div class="accessories__name">
            {props.value.title}
          </div>
          {renderDescription()}
        </div>
      )
    }

    return () => {
      return (
        <div class="accessories__item">
          {renderImage()}
          {renderContent()}
        </div>
      )
    }
  }
})
