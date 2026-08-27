import { computed, defineComponent } from 'vue'

import { getPrimitiveProp } from '@/ui/shared-props'
import { UiComponentName, numberToPxOrString } from '@/utils'

export interface TextAreaProps {
  ariaLabel: string
  disabled?: boolean
  loading: boolean
  label: string
  modelValue: string
  placeholder?: string
  readonly?: boolean
  suffix?: string
  rows?: number
}

export const textAreaProps = {
  ariaLabel: getPrimitiveProp(String, true),
  disabled: getPrimitiveProp(Boolean, false, false),
  loading: getPrimitiveProp(Boolean, false, false),
  label: getPrimitiveProp(String, true),
  modelValue: getPrimitiveProp(String, true),
  placeholder: getPrimitiveProp(String),
  readonly: getPrimitiveProp(Boolean, false, false),
  suffix: getPrimitiveProp(String),
  rows: getPrimitiveProp(Number, false, 3)
}

const baseClassName = 'isk-text-area'

export const UiTextArea = defineComponent({

  name: UiComponentName['text-area'],

  props: textAreaProps,

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

      return result.join(' ')
    })

    const handleClick = (event: MouseEvent): void => {
      emit('click', event)
    }
    const handleInput = (event: Event): void => {
      const inputElement = event.target as HTMLTextAreaElement
      if (inputElement) {
        inputElement.style.height = 'auto'
        inputElement.style.height = numberToPxOrString(inputElement.scrollHeight)
      }
      emit('update:modelValue', inputElement.value)
    }

    const resolvedRows = computed(() => {
      const rows = props.rows ?? 3

      return Math.max(3, rows)
    })

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
        <textarea
          aria-label={props.ariaLabel}
          class={`${baseClassName}__input`}
          disabled={props.disabled}
          placeholder={props.placeholder}
          readonly={props.readonly}
          rows={resolvedRows.value}
          value={props.modelValue}
          onClick={handleClick}
          onInput={handleInput}
        />
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
          {renderSuffix()}
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

export default UiTextArea
