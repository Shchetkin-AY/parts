import { ComponentNames, Icons, Colors, getString } from '@/utils'
import { PropType, computed, defineComponent } from 'vue'
import { GIcon } from '@/components'

export const panelProps = {
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: false
  },

  label: {
    type: [Number, String] as PropType<string | number>,
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

export const GPanel = defineComponent({
  name: ComponentNames.panel,

  props: panelProps,

  emits: ['update:modelValue'],

  setup(props, { slots, emit }) {
    const classes = computed<Record<string, boolean>>(() => {
      return {
        [ComponentNames.panel]: true,
        [`${ComponentNames.panel}--arrow`]: true,
        [`${ComponentNames.panel}--outline`]: props.outline,
        [`${ComponentNames.panel}--disabled`]: props.disabled
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
        <GIcon
          icon={icon}
          size={20}
          color={Colors.grey}
        />
      )
    }

    const renderLabel = () => {
      if (props.label !== undefined) {
        return <span class={`${ComponentNames.panel}__label`}>{getString(props.label)}</span>
      }

      if (slots.header) {
        return slots.header()
      }

      return null
    }

    const renderHeader = () => {
      return (
        <div
          class={`${ComponentNames.panel}__header`}
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
          <div class={`${ComponentNames.panel}__body`}>
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