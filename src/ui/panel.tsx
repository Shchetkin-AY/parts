import { Color, Icons, UiComponentName, getString } from '@/utils'
import { PropType, computed, defineComponent } from 'vue'
import { UiIcon } from '@/ui'

export const panelProps = {
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: false
  },

  label: {
    type: [ Number, String ] as PropType<string | number>,
    default: undefined
  },

  disabled: {
    type: Boolean as PropType<boolean>,
    default: false
  },

  outline: {
    type: Boolean as PropType<boolean>,
    default: false
  }
}

export const UiPanel = defineComponent({
  name: UiComponentName.panel,

  props: panelProps,

  emits: [ 'update:modelValue' ],

  setup(props, { slots, emit }) {
    const classes = computed<Record<string, boolean>>(() => {
      return {
        [UiComponentName.panel]: true,
        [`${UiComponentName.panel}--arrow`]: true,
        [`${UiComponentName.panel}--outline`]: props.outline,
        [`${UiComponentName.panel}--disabled`]: props.disabled
      }
    })

    const handleHeaderClick = (): void => {
      if (!props.disabled) {
        emit('update:modelValue', !props.modelValue)
      }
    }

    const renderArrow = () => {
      const icon = props.modelValue ? Icons['arrow-up'] : Icons['arrow-down']

      return (
        <UiIcon
          icon={icon}
          size={20}
          color={Color.grey}
        />
      )
    }

    const renderLabel = () => {
      if (props.label !== undefined) {
        return <span class={`${UiComponentName.panel}__label`}>{getString(props.label)}</span>
      }

      if (slots.header) {
        return slots.header()
      }

      return null
    }

    const renderHeader = () => {
      return (
        <div
          class={`${UiComponentName.panel}__header`}
          onClick={handleHeaderClick}
        >
          {renderLabel()}
          {renderArrow()}
        </div>
      )
    }

    const renderBody = () => {
      if (props.modelValue && slots.default) {
        return (
          <div class={`${UiComponentName.panel}__body`}>
            {slots.default()}
          </div>
        )
      }
    }

    return () => {
      return (
        <div class={classes.value}>
          {renderHeader()}
          {renderBody()}
        </div>
      )
    }
  }
})
