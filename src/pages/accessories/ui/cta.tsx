import { PropType, defineComponent } from 'vue'
import { UiButton } from '@/ui'
import { Color } from '@/utils'

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
    topic: {
      type: String as PropType<string>,
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

    const renderButton = () =>
      <UiButton label={props.label} color={Color.primary} onClick={() => emit('open', props.topic)} />

    return () =>
      <div class={className}>
        {renderText()}
        {renderButton()}
      </div>
  }
})
