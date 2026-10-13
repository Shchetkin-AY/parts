import { PropType, defineComponent } from 'vue'
import { FeatureItem } from '@/utils'

export default defineComponent({
  name: 'AccessoriesFeature',

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<FeatureItem>,
      required: true
    }
  },

  setup(props, { attrs }) {
    const renderTitle = () => {
      return <div class="accessories-page__feature-title">{props.value.title}</div>
    }

    const renderText = () => {
      return <div class="accessories-page__feature-description">{props.value.description}</div>
    }

    return () =>
      <div
        class={[
          'accessories-page__feature',
          attrs.class
        ]}
      >
        {renderTitle()}
        {renderText()}
      </div>
  }
})
