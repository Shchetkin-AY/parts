import { ButtonHTMLAttributes, PropType, computed, defineComponent } from 'vue'

import { ButtonMode, Color, Icons, Size, UiComponentName, numberToPxOrString } from '@/utils'

import { UiIcon } from '@/ui/icon'

export const buttonProps = {
  label: {
    type: [ String, Number ],
    default: undefined
  },

  size: {
    type: String as PropType<Size>,
    default: Size.medium
  },

  color: {
    type: String as PropType<Color>,
    default: undefined,
    validator: (value: Color): boolean => {
      return Object.values(Color).includes(value)
    }
  },
  icon: {
    type: String as PropType<Icons>,
    default: undefined,
    validator: (value: Icons): boolean => {
      return Object.values(Icons).includes(value)
    }
  },
  iconColor: {
    type: String as PropType<Color>,
    default: undefined,
    validator: (value: Color): boolean => {
      return Object.values(Color).includes(value)
    }
  },
  iconSize: {
    type: Number,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },

  type: {
    type: String as PropType<ButtonHTMLAttributes['type']>,
    default: 'button'
  },

  tabindex: {
    type: Number as PropType<ButtonHTMLAttributes['tabindex']>,
    default: undefined
  },

  onClick: {
    type: Function as PropType<(event: MouseEvent) => void>,
    default: undefined
  },
  onMouseover: {
    type: Function as PropType<(event: MouseEvent) => void>,
    default: undefined
  },
  onMouseout: {
    type: Function as PropType<(event: MouseEvent) => void>,
    default: undefined
  },

  minWidth: {
    type: [ String, Number ],
    default: undefined
  },
  maxWidth: {
    type: [ String, Number ],
    default: undefined
  },
  width: {
    type: [ String, Number ],
    default: undefined
  },

  mode: {
    type: String as PropType<ButtonMode>,
    default: undefined
  }
}

export const UiButton = defineComponent({
  name: UiComponentName.button,

  props: buttonProps,

  setup(props) {
    const hasIcon = computed<boolean>(() => !!props.icon)
    const hasLabel = computed<boolean>(() => !!props.label)
    const hasIconOnly = computed<boolean>(() => hasIcon.value && !hasLabel.value)
    const $class = computed<Record<string, boolean>>(() => {
      const result = {
        [UiComponentName.button]: true,

        [`${UiComponentName.button}--small`]: props.size === Size.small,
        [`${UiComponentName.button}--medium`]: props.size === Size.medium,
        [`${UiComponentName.button}--large`]: props.size === Size.large,
        [`${UiComponentName.button}--labeled`]: hasLabel.value,
        [`${UiComponentName.button}--has-icon`]: hasIcon.value,
        [`${UiComponentName.button}--icon-only`]: hasIconOnly.value,
        [`${UiComponentName.button}--${props.mode}`]: !!props.mode,
        [`${UiComponentName.button}--disabled`]: props.disabled,

        [`${UiComponentName.button}--color-${props.color}`]: !!props.color
      }

      return result
    })
    const gridTemplateColumns = computed(() => {
      const result = [ '1fr' ]
      if (hasIcon.value && hasLabel.value) {
        result.unshift('auto')
      }

      return result.join(' ')
    })
    const $style = computed<Record<string, string>>(() => {
      const result: Record<string, string> = {
        gridTemplateColumns: gridTemplateColumns.value
      }
      const items = [ 'minWidth', 'maxWidth', 'width' ]

      for (const item of items) {
        const key = item as keyof typeof buttonProps
        if (typeof props[key] === 'string' || typeof props[key] === 'number') {
          result[key] = numberToPxOrString(props[key])
        }
      }

      return result
    })

    const renderLabel = () => {
      if (hasLabel.value) {
        return (
          <div class={`${UiComponentName.button}__label`}>
            {props.label}
          </div>
        )
      }
    }
    const renderIconContent = () => {
      if (props.icon) {
        return (
          <UiIcon
            icon={props.icon}
            color={props.iconColor ?? 'inherit'}
            size={props.iconSize ?? 18}
          />
        )
      }
    }
    const renderIcon = () => {
      if (hasIcon.value) {
        return (
          <div class={`${UiComponentName.button}__icon`}>
            {renderIconContent()}
          </div>
        )
      }
    }
    const renderContent = () => {
      return (
        <div class={`${UiComponentName.button}__content`} >
          {renderIcon()}
          {renderLabel()}
        </div>
      )
    }

    return () => {
      return (
        <button
          class={$class.value}
          style={$style.value}
          type={props.type}
          tabindex={props.tabindex}
          aria-label={hasIconOnly.value ? String(props.icon) : undefined}
          disabled={props.disabled}
          onClick={props.onClick}
          onMouseover={props.onMouseover}
          onMouseout={props.onMouseout}
        >
          {renderContent()}
        </button>
      )
    }
  }
})
