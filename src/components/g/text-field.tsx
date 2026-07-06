import { PropType, computed, defineComponent } from 'vue'

import { getPrimitiveProp } from '../sharedProps'
import { ComponentNames, InputType } from '@/utils'

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
  suffix?: string
  type: InputType
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
  suffix: getPrimitiveProp(String),
  type: {
    type: String as PropType<InputType>,
    default: undefined
  }
}

const baseClassName = 'g-text-field'

export const GTextField = defineComponent({

  name: ComponentNames['text-field'],

  props: textFieldProps,

  emits: [ 'click', 'update:modelValue' ],

  setup(props, { emit }) {
    const hasSuffix = computed(() => Boolean(props.suffix))
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

      return result.join(' ')
    })

    const handleClick = (event: MouseEvent): void => {
      emit('click', event)
    }
    const handleInput = (event: Event): void => {
      const inputElement = event.target as HTMLInputElement
      emit('update:modelValue', inputElement.value)
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
          {props.label}
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
          onClick={handleClick}
          onInput={handleInput}
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

    return () => {
      return (
        <div class={baseClassName}>
          {renderLabel()}
          {renderField()}
        </div>
      )
    }
  }
})
