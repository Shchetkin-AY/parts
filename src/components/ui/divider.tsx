import { UiComponentName } from '@/utils'
import { PropType, defineComponent } from 'vue'

export const dividerProps = {
  type: {
    type: String,
    default: 'horizontal',
    validator: (value: string): boolean => {
      return !!~[ 'horizontal', 'vertical' ].indexOf(value)
    }
  },
  color: {
    type: String as PropType<string>,
    default: 'border'
  }
}

export const UiDivider = defineComponent({
  name: UiComponentName.divider,

  props: dividerProps,

  setup(props) {
    return () => {
      return (
        <div
          class={{
            ['isk-divider']: true,
            [`isk-divider--${props.color}`]: true,
            [`isk-divider--${props.type}`]: true
          }}
        ></div>
      )
    }
  }
})
