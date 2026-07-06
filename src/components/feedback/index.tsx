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
    const loading = ref(false)

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

    const submitHandler = async (event: MouseEvent) => {
      event.stopPropagation()

      if (loading.value) {
        return
      }

      try {
        loading.value = true

        const response = await fetch(import.meta.env.VITE_FEEDBACK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          throw new Error('Ошибка отправки формы')
        }

        proxy.value = false
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
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
            disabled={loading.value}
            onClick={() => {
              proxy.value = false
            }}
          />
          <GButton
            label={'Отправить'}
            color={Colors.primary}
            disabled={!validation.value || loading.value}
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
          v-slots={dialogSlots}
          v-model={proxy.value}
          title={'Получить консультацию'}
          maxWidth={500}
        />
      )
    }
  }
})
