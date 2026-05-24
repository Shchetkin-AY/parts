import { PropType, computed, defineComponent } from 'vue'

import type { ButtonColor, ButtonType } from '@/utils'
import { getPrimitiveProp } from '../sharedProps'

export interface ButtonProps {
  ariaLabel?: string
  color?: ButtonColor
  disabled?: boolean
  label: string
  type?: ButtonType
}

export const buttonProps = {
  ariaLabel: getPrimitiveProp(String),
  color: {
    type: String as PropType<ButtonColor>,
    required: false,
    default: 'primary'
  },
  disabled: getPrimitiveProp(Boolean, false, false),
  label: getPrimitiveProp(String, true),
  type: {
    type: String as PropType<ButtonType>,
    required: false,
    default: 'button'
  }
}

export const Button = defineComponent({
  name: 'Button',

  props: buttonProps,

  emits: [ 'click' ],

  setup(props, { emit }) {
    const className = 'button'

    const classes = computed(() => {
      return {
        [className]: true,
        [`${className}--${props.color}`]: true,
        [`${className}--disabled`]: props.disabled
      }
    })
    const resolvedAriaLabel = computed(() => {
      return props.ariaLabel ?? props.label
    })

    const clickHandler = (event: MouseEvent) => {
      emit('click', event)
    }

    const handleClick = (event: MouseEvent): void => {
      if (props.disabled) {
        return
      }
      clickHandler(event)
    }

    const renderLabel = () => {
      return (
        <span class={`${className}__label`} >
          {props.label}
        </span>
      )
    }

    return () => {
      return (
        <button
          aria-label={resolvedAriaLabel.value}
          class={classes.value}
          disabled={props.disabled}
          type={props.type}
          onClick={handleClick}
        >
          {renderLabel()}
        </button>
      )
    }
  }
})
