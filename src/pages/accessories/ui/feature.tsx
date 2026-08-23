import { PropType, defineComponent } from 'vue'
import { FeatureItem } from '@/utils'

export default defineComponent({
  name: 'AccessoriesFeature',

  props: {
    value: {
      type: Object as PropType<FeatureItem>,
      required: true
    }
  },

  setup(props) {
    const renderTitle = () => {
      return <div class="accessories__feature-title">{props.value.title}</div>
    }

    const renderText = () => {
      return <div class="accessories__feature-description">{props.value.description}</div>
    }

    return () =>
      <div class="accessories__feature">
        {renderTitle()}
        {renderText()}
      </div>
  }
})
