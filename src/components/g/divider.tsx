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

export const GDivider = defineComponent({
  name: 'GDivider',

  props: dividerProps,

  setup(props) {
    return () => {
      return (
        <div
          class={{
            ['g-divider']: true,
            [`g-divider--${props.color}`]: true,
            [`g-divider--${props.type}`]: true
          }}
        ></div>
      )
    }
  }
})
