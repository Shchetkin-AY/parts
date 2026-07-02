import { PropType, SVGAttributes, computed, defineComponent, h } from 'vue'
import { iconPaths } from '@/utils'

export const iconProps = {
  size: {
    type: Number as PropType<number>,
    default: 24
  },

  opacity: {
    type: Number as PropType<number>,
    default: undefined
  },

  rootOpacity: {
    type: Number as PropType<number>,
    default: undefined
  },

  icon: {
    type: String as PropType<string>,
    required: true
  },

  color: {
    type: String as PropType<string>,
    default: undefined
  }
}

export const GIcon = defineComponent({
  name: 'GIcon',

  props: iconProps,

  setup(props) {
    const $class = computed(() => {
      const result: Record<string, boolean> = {
        ['g-icon']: true
      }

      if (props.color && props.color !== 'inherit') {
        result[`g-icon--${props.color}`] = true
      }

      return result
    })

    const renderPath = () => {
      if (props.icon) {
        return iconPaths[props.icon].map(({ name, attributes }) => {
          if (props.opacity && attributes.opacity) {
            attributes.opacity = props.opacity
          }

          const style: SVGAttributes = {}
          if (attributes['stroke-width']) {
            $class.value[`g-icon--stroke-${props.color}`] = true
            style.fill = 'none'
          }

          return h(
            name,
            {
              ...attributes,
              style
            }
          )
        })
      }
    }

    return () =>
      <svg
        class={$class.value}
        style={{ opacity: props.rootOpacity }}
        width={props.size}
        height={props.size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderPath()}
      </svg>
  }
})
