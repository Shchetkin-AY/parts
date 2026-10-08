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
  remove: {
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

  emits: [ 'remove' ],

  setup(props, { emit }) {
    const rootRef = ref<HTMLElement | null>(null)
    const labelRef = ref<HTMLElement | null>(null)

    const classes = computed<Record<string, boolean>>(() => {
      return {
        [UiComponentName.chip]: true,
        [`${UiComponentName.chip}--absolute`]: props.position === 'absolute',

        [`${UiComponentName.chip}--outline`]: props.outline,
        [`${UiComponentName.chip}--remove`]: props.remove,

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

      return getString(props.label) ?? ''
    })

    const removeHandler = () => {
      emit('remove')
    }

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
    const renderClear = () => {
      if (props.remove) {
        return (
          <span
            aria-hidden="true"
            class={`${UiComponentName.chip}__remove`}
            data-chip-remove
            onClick={removeHandler}
          >
            <svg
              aria-hidden="true"
              class={`${UiComponentName.chip}__remove-icon`}
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 8.5L8.5 15.5"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
              <path
                d="M15.5 15.5L8.5 8.5"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
            </svg>
          </span>
        )
      }
    }
    const renderContent = () => {
      return (
        <div class={`${UiComponentName.chip}__content`}>
          {renderLabel()}
          {renderClear()}
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
