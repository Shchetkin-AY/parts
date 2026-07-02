import { CSSProperties, PropType, computed, defineComponent, ref } from 'vue'

import { Colors, ComponentNames, Sizes, getString } from '@/utils'

export const chipProps = {
  label: {
    type: [ String, Number, Boolean ],
    default: undefined
  },

  length: {
    type: Number as PropType<number>,
    default: 25
  },

  size: {
    type: String as PropType<Sizes>,
    default: Sizes.medium
  },

  cut: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  round: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  outline: {
    type: Boolean as PropType<boolean>,
    default: false
  },

  color: {
    type: String as PropType<Colors>,
    default: undefined,
    validator: (value: Colors): boolean => {
      return Object.values(Colors).includes(value)
    }
  },
  position: {
    type: String as PropType<'relative' | 'absolute'>,
    default: 'relative',
    validator: (value: 'relative' | 'absolute'): boolean => {
      return value === 'relative' || value === 'absolute'
    }
  },
  coordinates: {
    type: Object as PropType<Record<string, CSSProperties['top'] | CSSProperties['right'] | CSSProperties['bottom'] | CSSProperties['left']>>,
    default: () => ({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    })
  }
}

export const GChip = defineComponent({
  name: ComponentNames.chip,

  props: chipProps,

  setup(props) {
    const rootRef = ref<HTMLElement | null>(null)
    const labelRef = ref<HTMLElement | null>(null)

    const classes = computed<Record<string, boolean>>(() => {
      return {
        [ComponentNames.chip]: true,
        [`${ComponentNames.chip}--absolute`]: props.position === 'absolute',

        [`${ComponentNames.chip}--round`]: props.round,
        [`${ComponentNames.chip}--outline`]: props.outline,
        [`${ComponentNames.chip}--${props.size}`]: !!props.size,
        [`${ComponentNames.chip}--${props.color}`]: !!props.color
      }
    })

    const contentStyle = computed<CSSProperties>(() => {
      const style: CSSProperties = {
        position: props.position
      }

      if (props.coordinates.top !== undefined) {
        style.top = `${props.coordinates.top}px`
      }
      if (props.coordinates.right !== undefined) {
        style.right = `${props.coordinates.right}px`
      }
      if (props.coordinates.bottom !== undefined) {
        style.bottom = `${props.coordinates.bottom}px`
      }
      if (props.coordinates.left !== undefined) {
        style.left = `${props.coordinates.left}px`
      }

      return style
    })

    const label = computed<string | undefined>(() => {
      if (props.label === undefined) {
        return undefined
      }

      let result = getString(props.label) ?? ''
      if (props.cut && result.length > props.length) {
        result = result.substring(0, props.length) + '...'
      }

      return result
    })

    const renderLabel = () => {
      if (label.value) {
        return (
          <div
            class={`${ComponentNames.chip}__label`}
            ref={labelRef}
            tabindex={-1}
          >
            {label.value}
          </div>
        )
      }
    }
    const renderContent = () => {
      return (
        <div class={`${ComponentNames.chip}__content`}>
          {renderLabel()}
        </div>
      )
    }

    return () => {
      return (
        <div
          class={classes.value}
          style={contentStyle.value}
          ref={rootRef}
        >
          {renderContent()}
        </div>
      )
    }
  }
})
