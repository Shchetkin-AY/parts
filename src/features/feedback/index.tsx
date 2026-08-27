import { PropType, computed, defineComponent, reactive, ref, watch } from 'vue'
import { UiButton, UiDialog, UiIcon } from '@/ui'
import Form from '@/features/feedback/form'
import { ButtonMode, CatalogCategories, CatalogFilterField, CatalogItem, Color, FeedbackPayload, FeedbackTypes, Icons } from '@/utils'

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
    const requestState = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

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
    const requestError = computed(() => {
      if (requestState.value === 'error') {
        return 'Не удалось отправить запрос. Проверьте соединение и попробуйте еще раз.'
      }

      return ''
    })
    const loadingText = computed(() => 'Отправляем запрос...')
    const successTitle = computed(() => 'Запрос успешно отправлен')
    const successText = computed(() => 'Специалист свяжется с вами в ближайшее время.')

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
          requestState.value = 'idle'
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
        requestState.value = 'loading'

        const response = await fetch(import.meta.env.VITE_FEEDBACK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          requestState.value = 'success'
        } else {
          requestState.value = 'error'
        }
      } catch (error) {
        console.error(error)
        requestState.value = 'error'
      } finally {
        loading.value = false
      }
    }

    const renderError = () => {
      if (!requestError.value) {
        return
      }

      return (
        <div class={`${className}__error`} role="alert">
          <div class={`${className}__error-holder`} role="alert">
            {requestError.value}
          </div>
        </div>
      )
    }

    const renderLoading = () => {
      if (!loading.value) {
        return
      }

      return (
        <div class={`${className}__loading`} role="status" aria-live="polite">
          <span class={`${className}__spinner`} aria-hidden="true" />
          <span>{loadingText.value}</span>
        </div>
      )
    }

    const renderForm = () => {
      return (
        <div class={`${className}__body`}>
          {renderError()}
          <Form
            modelValue={payload}
            onUpdate:modelValue={value => Object.assign(payload, value)}
            type={props.type}
            loading={loading.value}
            onValidation={event => validation.value = event }
          />
          {renderLoading()}
        </div>
      )
    }

    const renderSuccess = () => {
      return (
        <div class={`${className}__success`} role="status" aria-live="polite">
          <UiIcon icon={Icons['check-circle']} color={Color.success} size={56} />
          <div class={`${className}__success-title`}>{successTitle.value}</div>
          <div class={`${className}__success-text`}>{successText.value}</div>
        </div>
      )
    }

    const renderFormFooter = () => {
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

    const renderSuccessFooter = () => {
      return (
        <div class={`${className}__dialog-footer ${className}__dialog-footer--success`}>
          <UiButton
            label="Закрыть"
            color={Color.primary}
            onClick={() => proxy.value = false}
          />
        </div>
      )
    }

    const renderBody = () => {
      return requestState.value === 'success' ? renderSuccess() : renderForm()
    }

    const renderFooter = () => {
      return requestState.value === 'success' ? renderSuccessFooter() : renderFormFooter()
    }

    const renderDialog = () => {
      const dialogSlots = {
        default: () => renderBody(),
        footer: () => renderFooter()
      }

      return (
        <UiDialog
          v-slots={dialogSlots}
          v-model={proxy.value}
          title={loading.value || requestState.value === 'idle' ? title.value : undefined}
          minHeight={500}
          maxWidth={500}
          closeOnOverlay={loading.value}
        />
      )
    }

    return () => renderDialog()
  }
})
