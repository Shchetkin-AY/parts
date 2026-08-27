import { PropType, computed, defineComponent, reactive, ref, watch } from 'vue'
import { UiButton, UiDialog } from '@/ui'
import Form from '@/features/feedback/form'
import { ButtonMode, CatalogCategories, CatalogFilterField, CatalogItem, Color, FeedbackPayload, FeedbackTypes } from '@/utils'

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

    id: {
      type: Number as PropType<CatalogItem['id']>,
      default: undefined
    },

    category: {
      type: String as PropType<CatalogCategories>,
      default: undefined
    },

    filter: {
      type: Object as PropType<Record<CatalogFilterField, string>>,
      default: () => ({})
    },

    topic: {
      type: String as PropType<string>,
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

    const loading = ref(false)
    const validation = ref<boolean>(false)

    const title = computed(() => {
      switch (props.type) {
        case FeedbackTypes.question: return 'Получить консультацию'
        case FeedbackTypes.order: return 'Получить расчет'
      }
    })
    const category = computed(() => {
      switch (props.category) {
        case CatalogCategories.kit: return 'Комплект'
        case CatalogCategories.pads: return 'Колодки'
        case CatalogCategories.discs: return 'Тормозные диски'
        case CatalogCategories.ccb: return 'Карбон-керамика'
        case CatalogCategories.lines: return 'Тормозные магистрали'
      }
    })

    const comment = computed(() => {
      switch (props.type) {
        case FeedbackTypes.question:
          return category.value ? `Интересует: ${category.value}` : props.topic || 'Нужна консультация по подбору'
        case FeedbackTypes.order:
          return `Интересует: ${category.value} ${props.topic || ''}`.trim()
      }
    })

    const payload = reactive<FeedbackPayload>({
      name: '',
      phone: '',
      category: category.value,
      mark: props.filter.mark,
      model: props.filter.model,
      wheelDiameter: props.filter.wheelDiameter ? `R${props.filter.wheelDiameter}` : '',
      goods_id: props.id,
      comment: comment.value
    })

    watch(
      () => [ props.modelValue, props.topic, props.category, props.type ],
      ([ isOpen ]) => {
        if (isOpen) {
          payload.category = category.value
          payload.comment = comment.value
        }
      }
    )

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

        if (response.ok) {
          loading.value = false
          proxy.value = false
        } else {
          loading.value = false
        }
      } catch (error) {
        console.error(error)
        loading.value = false
        proxy.value = false
      }
    }

    const renderForm = () => {
      return <Form
        modelValue={payload}
        onUpdate:modelValue={value => Object.assign(payload, value)}
        type={props.type}
        loading={loading.value}
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
          title={title.value}
          maxWidth={500}
        />
      )
    }
  }
})
