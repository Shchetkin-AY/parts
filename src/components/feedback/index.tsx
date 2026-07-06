import { PropType, computed, defineComponent, onBeforeUnmount, reactive, ref } from 'vue'
import { GButton, GDialog } from '@/components/g'
import Form from '@/components/feedback/form'
import { ButtonModes, Colors, FeedbackPayload } from '@/utils'

export default defineComponent({
  name: 'Feedback',

  props: {
    modelValue: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },

  emits: [ 'update:modelValue' ],

  setup(props, { emit }) {
    const proxy = computed({
      get: () => props.modelValue,
      set: value => {
        emit('update:modelValue', value)
      }
    })

    const validation = ref<boolean>(false)

    const payload = reactive<FeedbackPayload>({
      name: '',
      phone: '',
      comment: ''
    })

    onBeforeUnmount(() => {
      payload.name = ''
      payload.phone = ''
      payload.comment = ''
    })

    const submitHandler = (event: MouseEvent) => {
      event.stopPropagation()
    }

    const renderForm = () => {
      return <Form
        v-model={payload}
        onValidation={event => validation.value = event }
      />
    }

    const renderFooter = () => {
      return (
        <div class={'feedback__dialog-footer'}>
          <GButton
            label={'Закрыть'}
            mode={ButtonModes.flat}
            color={Colors.muted}
            onClick={() => {
              proxy.value = false
            }}
          />
          <GButton
            label={'Отправить'}
            color={Colors.primary}
            disabled={!validation.value}
            onClick={submitHandler}
          />
        </div>
      )
    }

    return () => {
      const dialogSlots = {
        default: () => renderForm(),
        footer: () => renderFooter()
      }

      return (
        <GDialog
          class={'feedback__dialog'}
          v-slots={dialogSlots}
          v-model={proxy.value}
          title={'Получить консультацию'}
          maxWidth={500}
        />
      )
    }
  }
})
