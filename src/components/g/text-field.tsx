import { PropType, computed, defineComponent } from 'vue'

import { getPrimitiveProp } from '../sharedProps'
import { ComponentNames, InputType, isEmpty } from '@/utils'

export interface TextFieldProps {
  ariaLabel: string
  disabled?: boolean
  clearable?: boolean
  label: string
  max?: number
  min?: number
  modelValue: string
  placeholder?: string
  readonly?: boolean
  rounded?: boolean
  required?: boolean
  suffix?: string
  type: InputType,
  hint?: string,
  error?: boolean
}

export const textFieldProps = {
  ariaLabel: getPrimitiveProp(String, true),
  disabled: getPrimitiveProp(Boolean, false, false),
  clearable: getPrimitiveProp(Boolean, false, false),
  label: getPrimitiveProp(String, true),
  max: getPrimitiveProp(Number),
  min: getPrimitiveProp(Number),
  modelValue: getPrimitiveProp(String, true),
  placeholder: getPrimitiveProp(String),
  readonly: getPrimitiveProp(Boolean, false, false),
  rounded: getPrimitiveProp(Boolean, false, true),
  required: getPrimitiveProp(Boolean, false, true),
  suffix: getPrimitiveProp(String),
  hint: getPrimitiveProp(String),
  error: getPrimitiveProp(Boolean, false, true),
  type: {
    type: String as PropType<InputType>,
    default: undefined
  }
}

const baseClassName = 'g-text-field'

export const GTextField = defineComponent({

  name: ComponentNames['text-field'],

  props: textFieldProps,

  emits: [ 'click', 'update:modelValue', 'blur', 'focus' ],

  setup(props, { emit }) {
    const hasSuffix = computed(() => Boolean(props.suffix))

    const hasHint = computed(() => !isEmpty(props.hint))

    const fieldClassName = computed(() => {
      const result = [ `${baseClassName}__field` ]
      if (props.disabled) {
        result.push(`${baseClassName}__field--disabled`)
      }
      if (props.readonly) {
        result.push(`${baseClassName}__field--readonly`)
      }
      if (props.rounded) {
        result.push(`${baseClassName}__field--rounded`)
      }
      if (props.error) {
        result.push(`${baseClassName}__field--error`)
      }

      return result.join(' ')
    })
    const label = computed(() => {
      if (props.required) {
        return `${props.label} *`
      }

      return props.label
    })

    const clickHandler = (event: MouseEvent): void => {
      emit('click', event)
    }
    const inputHandler = (event: Event): void => {
      const inputElement = event.target as HTMLInputElement
      emit('update:modelValue', inputElement.value)
    }
    const blurHandler = (event: FocusEvent): void => {
      emit('blur', event)
    }
    const focusHandler = (event: FocusEvent): void => {
      emit('focus', event)
    }

    const isClearVisible = computed(() => {
      return props.clearable && Boolean(props.modelValue) && !props.disabled
    })

    const clearValue = (): void => {
      emit('update:modelValue', '')
    }

    const handleClearClick = (event: MouseEvent): void => {
      event.preventDefault()
      event.stopPropagation()
      clearValue()
    }

    const renderLabel = () => {
      if (!props.label) {
        return null
      }

      return (
        <div class={`${baseClassName}__label`}>
          {label.value}
        </div>
      )
    }
    const renderInput = () => {
      return (
        <input
          aria-label={props.ariaLabel}
          class={`${baseClassName}__input`}
          disabled={props.disabled}
          max={props.max}
          min={props.min}
          placeholder={props.placeholder}
          readonly={props.readonly}
          type={props.type}
          value={props.modelValue}
          onClick={clickHandler}
          onInput={inputHandler}
          onBlur={blurHandler}
          onFocus={focusHandler}
        />
      )
    }
    const renderClear = () => {
      if (!isClearVisible.value) {
        return null
      }

      return (
        <span aria-hidden="true" class={`${baseClassName}__clear`} data-text-clear onClick={handleClearClick}>
          <svg
            aria-hidden="true"
            class={`${baseClassName}__clear-icon`}
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
    const renderSuffix = () => {
      if (!hasSuffix.value) {
        return null
      }

      return (
        <span class={`${baseClassName}__suffix`}>
          {props.suffix}
        </span>
      )
    }
    const renderField = () => {
      return (
        <label class={fieldClassName.value}>
          {renderInput()}
          {isClearVisible.value ? renderClear() : renderSuffix()}
        </label>
      )
    }
    const renderHint = () => {
      return (
        <span
          aria-hidden={!hasHint.value}
          class={{
            [`${baseClassName}__hint`]: true,
            [`${baseClassName}__hint--visible`]: hasHint.value
          }}
        >
          {hasHint.value ? props.hint : ''}
        </span>
      )
    }

    return () => {
      return (
        <div class={{
          [baseClassName]: true,
          [`${baseClassName}--error`]: props.error,
          [`${baseClassName}--hint`]: true
        }}
        >
          {renderLabel()}
          {renderField()}
          {renderHint()}
        </div>
      )
    }
  }
})
