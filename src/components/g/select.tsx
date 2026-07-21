import { PropType, computed, defineComponent, ref, watch } from 'vue'

import { ComponentNames, type MenuItem, type MenuPosition, type SelectOption } from '@/utils'
import { GMenu } from '@/components'
import { getPrimitiveProp } from '@/components/sharedProps'

export interface SelectProps {
  modelValue: string
  ariaLabel: string
  clearable?: boolean
  disabled?: boolean
  label: string
  options: SelectOption[]
  placeholder?: string
  rounded?: boolean
  required?: boolean
}

export const selectProps = {
  ariaLabel: getPrimitiveProp(String, true),
  clearable: getPrimitiveProp(Boolean, false, false),
  disabled: getPrimitiveProp(Boolean, false, false),
  label: getPrimitiveProp(String, true),
  modelValue: getPrimitiveProp(String, true),
  options: {
    type: Array as PropType<SelectOption[]>,
    required: true,
    default: () => []
  },
  placeholder: getPrimitiveProp(String),
  rounded: getPrimitiveProp(Boolean, false, true),
  required: getPrimitiveProp(Boolean, false, false)
}

const baseClassName = 'g-select'

export const GSelect = defineComponent({
  name: ComponentNames.select,

  props: selectProps,

  emits: [ 'update:modelValue' ],

  setup(props, { emit }) {
    const triggerReference = ref<HTMLButtonElement | null>(null)
    const menuPosition = ref<MenuPosition | null>(null)

    const fieldClassName = computed(() => {
      const result = [ `${baseClassName}__field` ]
      if (isFieldDisabled.value) {
        result.push(`${baseClassName}__field--disabled`)
      }
      if (menuPosition.value !== null) {
        result.push(`${baseClassName}__field--active`)
      }
      if (props.rounded) {
        result.push(`${baseClassName}__field--rounded`)
      }

      return result.join(' ')
    })
    const menuItems = computed<MenuItem[]>(() => {
      return props.options.map(option => {
        return {
          ariaLabel: option.ariaLabel,
          disabled: option.disabled,
          id: option.value,
          isActive: option.value === props.modelValue,
          label: option.label,
          role: 'menuitemradio'
        }
      })
    })
    const selectedOption = computed(() => {
      const result = props.options.find(option => {
        return option.value === props.modelValue
      })

      return result ?? null
    })
    const isFieldDisabled = computed(() => {
      return props.disabled || menuItems.value.length === 0
    })
    const isClearVisible = computed(() => {
      return props.clearable && Boolean(props.modelValue) && !props.disabled
    })
    const resolvedAriaLabel = computed<string>(() => {
      return props.ariaLabel ?? props.label ?? ''
    })
    const label = computed(() => {
      if (props.required) {
        return `${props.label} *`
      }

      return props.label
    })

    const closeMenu = (): void => {
      menuPosition.value = null
    }
    const toggleMenu = (): void => {
      if (isFieldDisabled.value) {
        return
      }

      if (menuPosition.value) {
        closeMenu()

        return
      }

      if (!triggerReference.value) {
        return
      }

      const triggerBounds = triggerReference.value.getBoundingClientRect()

      menuPosition.value = {
        minWidth: triggerBounds.width,
        x: triggerBounds.left,
        y: triggerBounds.bottom + 4
      }
    }
    const handleMenuSelect = (optionValue: string): void => {
      emit('update:modelValue', optionValue)
    }
    const clearValue = (): void => {
      emit('update:modelValue', '')
      closeMenu()
    }
    const handleFieldClick = (event: MouseEvent): void => {
      if (!isClearVisible.value) {
        toggleMenu()

        return
      }

      const eventTarget = event.target

      if (eventTarget instanceof Element && eventTarget.closest('[data-select-clear]')) {
        event.preventDefault()
        event.stopPropagation()
        clearValue()

        return
      }

      toggleMenu()
    }

    watch(isFieldDisabled, value => {
      if (!value) {
        return
      }

      closeMenu()
    })

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
    const renderSelectedOptionText = (text: string) => {
      return (
        <span class={`${baseClassName}__option-text`}>
          {text}
        </span>
      )
    }
    const renderSelectedOption = () => {
      if (!selectedOption.value) {
        return null
      }

      return renderSelectedOptionText(selectedOption.value.label)
    }
    const renderPlaceholder = () => {
      if (selectedOption.value || !props.placeholder) {
        return null
      }

      return (
        <span class={`${baseClassName}__placeholder`}>
          {props.placeholder}
        </span>
      )
    }
    const renderValue = () => {
      if (!selectedOption.value) {
        return null
      }

      return <span class={`${baseClassName}__value`}>{renderSelectedOption()}</span>
    }
    const renderArrow = () => {
      return (
        <svg
          aria-hidden="true"
          class={`${baseClassName}__arrow`}
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 10L12 14L8 10"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          />
        </svg>
      )
    }
    const renderClear = () => {
      if (!isClearVisible.value) {
        return null
      }

      return (
        <span aria-hidden="true" class={`${baseClassName}__clear`} data-select-clear>
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
    const renderField = () => {
      return (
        <button
          aria-expanded={menuPosition.value !== null}
          aria-haspopup="menu"
          aria-label={resolvedAriaLabel.value}
          class={fieldClassName.value}
          disabled={isFieldDisabled.value}
          ref={triggerReference}
          type="button"
          onClick={handleFieldClick}
        >
          {renderPlaceholder()}
          {renderValue()}
          {isClearVisible.value ? renderClear() : renderArrow()}
        </button>
      )
    }
    const renderMenu = () => {
      return (
        <GMenu
          anchorElement={triggerReference.value}
          ariaLabel={resolvedAriaLabel.value}
          items={menuItems.value}
          menuPosition={menuPosition.value}
          onClose={closeMenu}
          onSelect={handleMenuSelect}
        />
      )
    }

    return () => {
      return (
        <div class={baseClassName}>
          {renderLabel()}
          {renderField()}
          {renderMenu()}
        </div>
      )
    }
  }
})
