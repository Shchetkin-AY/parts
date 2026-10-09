import { PropType, computed, defineComponent } from 'vue'

import { Primitive, UiComponentName } from '@/utils'

export const UiCheckbox = defineComponent({
  name: UiComponentName.checkbox,

  props: {
    modelValue: {
      type: [ Boolean, String, Number ] as PropType<Primitive>,
      default: false
    },

    trueValue: {
      type: [ Boolean, String, Number ] as PropType<Primitive>,
      default: true
    },
    falseValue: {
      type: [ Boolean, String, Number ] as PropType<Primitive>,
      default: false
    },

    label: {
      type: String as PropType<string>,
      default: undefined
    },

    ariaLabel: {
      type: String as PropType<string>,
      default: undefined
    },

    disabled: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { slots, emit }) {
    const className = UiComponentName.checkbox

    const isChecked = computed(() => props.modelValue === props.trueValue)
    const accessibleLabel = computed(() => props.ariaLabel ?? props.label)
    const classes = computed(() => ({
      [className]: true,
      [`${className}--checked`]: isChecked.value,
      [`${className}--disabled`]: props.disabled
    }))

    const toggle = () => {
      if (props.disabled) {
        return
      }

      const value = isChecked.value ? props.falseValue : props.trueValue
      emit('update:modelValue', value)
    }

    const labelClickHandler = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a')) {
        return
      }

      toggle()
    }

    const renderMark = () => {
      return (
        <svg
          class={`${className}__check-mark`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="9"
          viewBox="0 0 13 9"
        >
          <path d="M11.6869 1L4.52228 8L1.26562 4.81818" />
        </svg>
      )
    }

    const renderControl = () => {
      return (
        <button
          class={`${className}__control`}
          type="button"
          role="checkbox"
          aria-label={accessibleLabel.value}
          aria-checked={isChecked.value}
          disabled={props.disabled}
          onClick={toggle}
        >
          {renderMark()}
        </button>
      )
    }

    const renderLabel = () => {
      if (slots.default ?? props.label) {
        return (
          <div class={`${className}__label`} onClick={labelClickHandler}>
            {slots.default ? slots.default() : props.label}
          </div>
        )
      }
    }

    return () =>
      <div class={classes.value}>
        {renderControl()}
        {renderLabel()}
      </div>
  }
})
