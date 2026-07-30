import { CSSProperties, PropType, computed, defineComponent, ref } from 'vue'

import { Color, Size, UiComponentName, getString } from '@/utils'

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
    type: String as PropType<Size>,
    default: Size.medium
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
    type: String as PropType<Color>,
    default: undefined,
    validator: (value: Color): boolean => {
      return Object.values(Color).includes(value)
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

export const UiChip = defineComponent({
  name: UiComponentName.chip,

  props: chipProps,

  setup(props) {
    const rootRef = ref<HTMLElement | null>(null)
    const labelRef = ref<HTMLElement | null>(null)

    const classes = computed<Record<string, boolean>>(() => {
      return {
        [UiComponentName.chip]: true,
        [`${UiComponentName.chip}--absolute`]: props.position === 'absolute',

        [`${UiComponentName.chip}--round`]: props.round,
        [`${UiComponentName.chip}--outline`]: props.outline,
        [`${UiComponentName.chip}--${props.size}`]: !!props.size,
        [`${UiComponentName.chip}--${props.color}`]: !!props.color
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
            class={`${UiComponentName.chip}__label`}
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
        <div class={`${UiComponentName.chip}__content`}>
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
