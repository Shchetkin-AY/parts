import { PropType, computed, defineComponent, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { UiButton, UiDialog } from '@/ui'
import Form from '@/features/feedback/form'
import { ButtonMode, Color, FeedbackPayload, FeedbackTypes } from '@/utils'

const className = 'feedback'

export default defineComponent({
  name: 'Feedback',

  props: {
    modelValue: {
      type: Boolean as PropType<boolean>,
      default: false
    },

    type: {
      type: String as PropType<FeedbackTypes>,
      default: FeedbackTypes.question
    },

    topic: {
      type: String,
      default: ''
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

    const updatePayload = (value: FeedbackPayload) => {
      Object.assign(payload, value)
    }

    const setTopic = () => {
      payload.comment = props.topic ? `Интересует: ${props.topic}` : ''
    }

    watch(
      () => [ props.modelValue, props.topic ],
      ([ isOpen, topic ], previous) => {
        if (isOpen && (!previous?.[0] || topic !== previous?.[1])) {
          setTopic()
        }
      }
    )

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
        modelValue={payload}
        type={props.type}
        onUpdate:modelValue={updatePayload}
        onValidation={event => validation.value = event }
      />
    }

    const renderFooter = () => {
      return (
        <div class={`${className}__dialog-footer`}>
          <UiButton
            label={'Закрыть'}
            mode={ButtonMode.flat}
            color={Color.muted}
            disabled={loading.value}
            onClick={() => {
              proxy.value = false
            }}
          />
          <UiButton
            label={'Отправить'}
            color={Color.primary}
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
        <UiDialog
          v-slots={dialogSlots}
          v-model={proxy.value}
          title={'Получить консультацию'}
          maxWidth={500}
        />
      )
    }
  }
})
