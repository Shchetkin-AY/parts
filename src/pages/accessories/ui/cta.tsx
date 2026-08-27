import { PropType, defineComponent } from 'vue'
import { UiButton } from '@/ui'
import { CatalogCategories, Color } from '@/utils'

export default defineComponent({
  name: 'Cta',

  props: {
    title: {
      type: String as PropType<string>,
      required: true
    },
    description: {
      type: String as PropType<string>,
      required: true
    },
    category: {
      type: String as PropType<CatalogCategories>,
      required: true
    },
    label: {
      type: String as PropType<string>,
      default: 'Подобрать'
    }
  },

  emits: [ 'open' ],

  setup(props, { emit }) {
    const className = 'cta'

    const renderText = () =>
      <div class={`${className}__text`}>
        <div class={`${className}__text-title`}>{props.title}</div>
        <div class={`${className}__text-description`}>{props.description}</div>
      </div>

    const renderButton = () => {
      return (
        <UiButton
          label={props.label}
          color={Color.primary}
          onClick={() => emit('open', props.category)}
        />
      )
    }

    return () =>
      <div class={className}>
        {renderText()}
        {renderButton()}
      </div>
  }
})
