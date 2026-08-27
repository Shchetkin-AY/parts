import { CSSProperties, PropType, computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { Color, GroupButtonItem, Size, numberToPxOrString } from '@/utils'

import { UiIcon } from '@/ui/icon'
import { Primitive } from '@/ui/shared-props'

const className = 'groupButton'
type GroupButtonOption = GroupButtonItem | Primitive

export const GroupButton = defineComponent({
  name: 'GroupButton',

  props: {
    modelValue: {
      type: [ String, Number, Boolean ] as PropType<Primitive>,
      default: undefined
    },
    items: {
      type: Array as PropType<GroupButtonOption[]>,
      default: () => {
        return []
      }
    },
    size: {
      type: String as PropType<Size>,
      default: Size.medium,
      validator: (value: Size): boolean => {
        return Object.values(Size).includes(value)
      }
    },
    fullWidth: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    equalWidth: {
      type: Boolean as PropType<boolean>,
      default: false
    },

    outline: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    readonly: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { emit }) {
    let resizeObserver: ResizeObserver | undefined = undefined
    let animationFrameId: number | undefined = undefined

    const buttonRefs: (HTMLElement | null)[] = []

    const indicatorWidth = ref<number>(0)
    const indicatorLeft = ref<number>(0)
    const holderRef = ref<HTMLElement | null>(null)

    const proxy = computed({
      get: () => {
        return props.modelValue
      },
      set: value => {
        return emit('update:modelValue', value)
      }
    })
    const classes = computed<Record<string, boolean>>(() => {
      return {
        [className]: true,
        [`${className}--${props.size}`]: true,
        [`${className}--fullWidth`]: props.fullWidth,
        [`${className}--equalWidth`]: props.equalWidth,
        [`${className}--outline`]: props.outline,
        [`${className}--readonly`]: props.readonly,
        [`${className}--disabled`]: props.disabled
      }
    })
    const items = computed<GroupButtonItem[]>(() => {
      return props.items.map(item => {
        const itemIsObject = typeof item === 'object' && item !== null
        const value = itemIsObject ? item.value : item
        const label = itemIsObject ? String(item.label ?? item.value) : String(item)
        const icon = itemIsObject ? item.icon : undefined
        const color = itemIsObject ? item.color ?? Color.primary : Color.primary
        const disabled = itemIsObject ? item.disabled ?? false : false

        return {
          value,
          label,
          icon,
          color,
          disabled
        }
      })
    })
    const currentIndex = computed<number>(() => {
      return items.value.findIndex(item => {
        return item.value === proxy.value
      })
    })
    const showIndicator = computed<boolean>(() => {
      return currentIndex.value !== -1 && indicatorWidth.value > 0
    })
    const currentColor = computed<Color>(() => {
      return items.value[currentIndex.value]?.color ?? Color.primary
    })
    const indicatorStyles = computed<CSSProperties>(() => {
      if (showIndicator.value) {
        return {
          width: numberToPxOrString(indicatorWidth.value),
          transform: `translateX(${numberToPxOrString(indicatorLeft.value)})`
        }
      }

      return { display: 'none' }
    })

    const setButtonRef = (element: unknown, index: number): void => {
      buttonRefs[index] = element as HTMLElement | null
      buttonRefs.length = items.value.length
    }
    const updateIndicator = (): void => {
      const currentButton = buttonRefs[currentIndex.value]
      if (currentIndex.value !== -1 && currentButton?.isConnected) {
        const { offsetWidth, offsetLeft } = currentButton
        if (offsetWidth !== indicatorWidth.value) {
          indicatorWidth.value = offsetWidth
        }
        if (offsetLeft !== indicatorLeft.value) {
          indicatorLeft.value = offsetLeft
        }
      } else {
        indicatorWidth.value = 0
        indicatorLeft.value = 0
      }
    }
    const scheduleIndicatorUpdate = (): void => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId)
      }

      animationFrameId = requestAnimationFrame(() => {
        animationFrameId = undefined
        updateIndicator()
      })
    }
    const observeButtons = (): void => {
      if (resizeObserver) {
        for (const button of buttonRefs) {
          if (button) {
            resizeObserver.observe(button)
          }
        }
      }
    }

    const buttonClickHandler = (value: GroupButtonItem['value']): void => {
      if (!props.disabled && !props.readonly) {
        proxy.value = value
      }
    }

    watch(
      [ currentIndex, items ],
      () => {
        observeButtons()
        updateIndicator()
      },
      { flush: 'post' }
    )

    onMounted(() => {
      resizeObserver = new ResizeObserver(() => {
        scheduleIndicatorUpdate()
      })
      if (holderRef.value) {
        resizeObserver.observe(holderRef.value)
      }
      observeButtons()
      updateIndicator()
    })
    onBeforeUnmount(() => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = undefined
      }

      resizeObserver?.disconnect()
    })

    const renderIndicator = () => {
      return (
        <div
          class={`${className}__indicator ${className}__indicator--${currentColor.value}`}
          style={indicatorStyles.value}
        />
      )
    }
    const renderButtonContent = (item: GroupButtonItem) => {
      if (item.icon) {
        let iconSize: number
        if (props.size === Size.medium) {
          iconSize = 24
        } else {
          iconSize = 20
        }

        return (
          <UiIcon
            icon={item.icon}
            size={iconSize}
          />
        )
      }

      return item.label
    }
    const renderButton = (item: GroupButtonItem, index: number) => {
      return (
        <div
          class={{
            [`${className}__button`]: true,
            [`${className}__button--disabled`]: !!item.disabled,
            [`${className}__button--current`]: index === currentIndex.value,
            [`${className}__button--${item.color}`]: true
          }}
          onClick={() => {
            if (!item.disabled) {
              buttonClickHandler(item.value)
            }
          }}
          ref={element => {
            setButtonRef(element, index)
          }}
        >
          {renderButtonContent(item)}
        </div>
      )
    }
    const renderItems = () => {
      return items.value.map((item, index) => {
        return renderButton(item, index)
      })
    }
    const renderHolder = () => {
      return (
        <div
          class={`${className}__holder`}
          ref={holderRef}
        >
          {renderIndicator()}
          {renderItems()}
        </div>
      )
    }

    return () => {
      return (
        <div class={classes.value} >
          {renderHolder()}
        </div>
      )
    }
  }
})

export default GroupButton
