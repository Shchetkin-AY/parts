import { CSSProperties, PropType, computed, defineComponent } from 'vue'

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
  },

  size: {
    type: Number,
    default: 1
  }
}

export const GDivider = defineComponent({
  name: 'GDivider',

  props: dividerProps,

  setup(props) {
    const styles = computed<CSSProperties>(() => {
      const direction = props.type === 'vertical' ? 'width' : 'height'
      const size = `${props.size}px`
      const halfSize = `${props.size / 2}px`

      return {
        'border-radius': halfSize,
        [`min-${direction}`]: size,
        [`max-${direction}`]: size,
        [direction]: size
      }
    })

    return () => {
      return (
        <div
          class={{
            ['g-divider']: true,
            [`g-divider--${props.color}`]: true
          }}
          style={styles.value}
        ></div>
      )
    }
  }
})
