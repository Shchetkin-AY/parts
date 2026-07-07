import { CSSProperties, PropType, Teleport, Transition, computed, defineComponent, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { Colors, ComponentNames, Icons, numberToPxOrString } from '@/utils'
import { GOverlay } from './overlay'
import { GButton } from './button'

export const DialogProps = {
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: false
  },

  title: {
    type: String as PropType<string>,
    default: undefined
  },

  minHeight: {
    type: [ String, Number ],
    default: 0
  },
  maxHeight: {
    type: [ String, Number ],
    default: 'none'
  },
  height: {
    type: [ String, Number ],
    default: 'auto'
  },
  minWidth: {
    type: [ String, Number ],
    default: 0
  },
  maxWidth: {
    type: [ String, Number ],
    default: 'none'
  },
  width: {
    type: [ String, Number ],
    default: '100%'
  }

}

export const GDialog = defineComponent({

  name: ComponentNames.dialog,

  props: DialogProps,

  emits: [ 'update:modelValue', 'close' ],

  setup(props, { emit, slots }) {
    const windowWidth = ref(window.innerWidth)

    const proxy = computed({
      get: () => props.modelValue,
      set: value => {
        emit('update:modelValue', value)
      }
    })

    const isMobile = computed(() => windowWidth.value < 768)

    const transitionClass = computed<string>(() => {
      const result = [ 'show-dialog' ]
      if (isMobile.value) {
        result.push('mobile')
      }

      return result.join('--')
    })

    const holderStyle = computed<CSSProperties>(() => {
      const result = {}
      if (!isMobile.value) {
        Object.assign(result, {
          minHeight: numberToPxOrString(props.minHeight),
          maxHeight: numberToPxOrString(props.maxHeight),
          height: numberToPxOrString(props.height),
          minWidth: numberToPxOrString(props.minWidth),
          maxWidth: numberToPxOrString(props.maxWidth),
          width: numberToPxOrString(props.width)
        })
      }

      return result
    })

    const close = () => {
      proxy.value = false
    }

    watchEffect(onCleanup => {
      if (!proxy.value) {
        return
      }

      const handleEscape = (event: KeyboardEvent): void => {
        if (event.key !== 'Escape') {
          return
        }

        close()
      }

      document.addEventListener('keydown', handleEscape)

      onCleanup(() => {
        document.removeEventListener('keydown', handleEscape)
      })
    })

    const handleResize = () => {
      windowWidth.value = window.innerWidth
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      proxy.value = false
    })

    const renderCloseButton = () => {
      if (!isMobile.value) {
        return (
          <GButton
            class={`${ComponentNames.dialog}__close`}
            icon={Icons.close}
            iconColor={Colors.grey}
            onClick={() => {
              return proxy.value = false
            }}
          />
        )
      }
    }

    const renderTitle = () => {
      if (props.title) {
        return <h1 class={`${ComponentNames.dialog}__title`}>{props.title}</h1>
      }
    }
    const renderHeader = () => {
      if (slots.header ?? props.title) {
        let headerContent
        if (slots.header) {
          headerContent = slots.header()
        } else {
          headerContent = renderTitle()
        }

        return (
          <div class={`${ComponentNames.dialog}__header`} >
            {headerContent}
          </div>
        )
      }
    }
    const renderBody = () => {
      if (slots.default) {
        return (
          <div
            class={`${ComponentNames.dialog}__body`}
            onWheel={event => {
              return event.stopPropagation()
            }}
          >
            {slots.default()}
          </div>
        )
      }
    }

    const renderFooter = () => {
      if (slots.footer) {
        return (
          <div class={`${ComponentNames.dialog}__footer`} >
            {slots.footer()}
          </div>
        )
      }
    }

    const renderHolder = () => {
      return (
        <div
          class={`${ComponentNames.dialog}__holder`}
          style={holderStyle.value}
        >
          {renderCloseButton()}
          {renderHeader()}
          {renderBody()}
          {renderFooter()}
        </div>
      )
    }

    const renderOverlay = () => {
      return (
        <GOverlay v-model={proxy.value} />
      )
    }

    const renderGroup = () => {
      if (proxy.value) {
        return (
          <div class={{
            [ComponentNames.dialog]: true,
            [`${ComponentNames.dialog}--mobile`]: isMobile.value
          }}
          >
            {renderHolder()}
            {renderOverlay()}
          </div>
        )
      }
    }

    return () => {
      return (
        <Teleport to={'body'} >
          <Transition name={transitionClass.value} >
            {renderGroup()}
          </Transition>
        </Teleport>
      )
    }
  }
})
