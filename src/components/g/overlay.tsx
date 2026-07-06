import { ComponentNames } from '@/utils'
import { Transition, computed, defineComponent, onBeforeUnmount, onMounted } from 'vue'

export const GOverlay = defineComponent({
  name: ComponentNames.overlay,

  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { emit }) {
    const proxy = computed<boolean>({
      get: () => {
        return props.modelValue
      },
      set: (value: boolean) => {
        return emit('update:modelValue', value)
      }
    })

    const clickHandler = () => {
      proxy.value = false
    }
    const escHandler = (event: KeyboardEvent) => {
      if (~[ 'esc', 'escape' ].indexOf(event.key.toLocaleLowerCase())) {
        proxy.value = false
      }
    }

    onMounted(() => {
      return document.documentElement.addEventListener('keyup', escHandler)
    })
    onBeforeUnmount(() => {
      return document.documentElement.removeEventListener('keyup', escHandler)
    })

    const renderContent = () => {
      return (
        <div
          v-show={proxy.value}
          class={ComponentNames.overlay}
          onClick={clickHandler}
          onWheel={event => {
            return event.preventDefault()
          }}
        />
      )
    }

    return () => {
      return (
        <Transition name="show-overlay">
          {renderContent()}
        </Transition>
      )
    }
  }

})
