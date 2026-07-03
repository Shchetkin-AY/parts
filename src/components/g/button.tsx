import { ButtonHTMLAttributes, PropType, computed, defineComponent } from 'vue'

import { ButtonModes, Colors, ComponentNames, Icons, Sizes, numberToPxOrString } from '@/utils'

import { GIcon } from './icon'

export const buttonProps = {
  label: {
    type: [ String, Number ],
    default: undefined
  },

  size: {
    type: String as PropType<Sizes>,
    default: Sizes.medium
  },

  color: {
    type: String as PropType<Colors>,
    default: undefined,
    validator: (value: Colors): boolean => {
      return Object.values(Colors).includes(value)
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
    type: String as PropType<Colors>,
    default: undefined,
    validator: (value: Colors): boolean => {
      return Object.values(Colors).includes(value)
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
    type: String as PropType<ButtonModes>,
    default: undefined
  }
}

export const GButton = defineComponent({
  name: ComponentNames.button,

  props: buttonProps,

  setup(props) {
    const hasIcon = computed<boolean>(() => !!props.icon)
    const hasLabel = computed<boolean>(() => !!props.label)
    const hasIconOnly = computed<boolean>(() => hasIcon.value && !hasLabel.value)
    const $class = computed<Record<string, boolean>>(() => {
      const result = {
        [ComponentNames.button]: true,

        [`${ComponentNames.button}--small`]: props.size === Sizes.small,
        [`${ComponentNames.button}--medium`]: props.size === Sizes.medium,
        [`${ComponentNames.button}--large`]: props.size === Sizes.large,
        [`${ComponentNames.button}--labeled`]: hasLabel.value,
        [`${ComponentNames.button}--has-icon`]: hasIcon.value,
        [`${ComponentNames.button}--icon-only`]: hasIconOnly.value,
        [`${ComponentNames.button}--${props.mode}`]: !!props.mode,
        [`${ComponentNames.button}--disabled`]: props.disabled,

        [`${ComponentNames.button}--color-${props.color}`]: !!props.color
      }

      return result
    })
    const $style = computed<Record<string, string>>(() => {
      const result: Record<string, string> = {}
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
          <div class={`${ComponentNames.button}__label`}>
            {props.label}
          </div>
        )
      }
    }
    const renderIconContent = () => {
      if (props.icon) {
        return (
          <GIcon
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
          <div class={`${ComponentNames.button}__icon`}>
            {renderIconContent()}
          </div>
        )
      }
    }
    const renderContent = () => {
      return (
        <div
          class={`${ComponentNames.button}__content`}
          style={{ gridTemplateColumns: hasIcon.value && hasLabel.value ? 'auto 1fr' : '1fr' }}
        >
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
