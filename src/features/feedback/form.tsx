import { FeedbackPayload, FeedbackTypes, isEmpty } from '@/utils'
import { PropType, computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { UiTextArea, UiTextField } from '@/ui'

export default defineComponent({
  name: 'Form',

  props: {
    modelValue: {
      type: Object as PropType<FeedbackPayload>,
      default: () => ({})
    },

    type: {
      type: String as PropType<FeedbackTypes>,
      default: FeedbackTypes.question
    }
  },

  emits: [ 'update:modelValue', 'validation' ],

  setup(props, { emit }) {
    const className = 'feedback__form'

    const errors = reactive<Record<string, string>>({
      phone: '',
      name: ''
    })
    const isNameTouched = ref(false)
    const isPhoneTouched = ref(false)

    const proxy = computed({
      get: () => props.modelValue,
      set: value => {
        emit('update:modelValue', value)
      }
    })
    const subtitle = computed<string>(() => {
      switch (props.type) {
        case FeedbackTypes.question: return 'Оставьте контакты, и специалист поможет подобрать тормозную систему под ваш автомобиль.'
        case FeedbackTypes.order: return 'Заполните форму — мы свяжемся с вами и подготовим подходящую конфигурацию.'
      }
    })
    const isValidPhone = computed(() => {
      const digits = (proxy.value.phone ?? '').replace(/\D/g, '')

      return /^(7|8)\d{10}$/.test(digits)
    })
    const isValidName = computed<boolean>(() => {
      return !isEmpty(proxy.value.name)
    })
    const validation = computed<boolean>(() => {
      return isValidName.value && isValidPhone.value
    })
    const nameHint = computed(() => {
      return isNameTouched.value ? errors.name : ''
    })
    const nameError = computed(() => {
      return isNameTouched.value && !isValidName.value
    })
    const phoneHint = computed(() => {
      return isPhoneTouched.value ? errors.phone : ''
    })
    const phoneError = computed(() => {
      return isPhoneTouched.value && !isValidPhone.value
    })

    const nameFocusHandler = () => {
      isNameTouched.value = false
      errors.name = ''
    }
    const phoneFocusHandler = () => {
      isPhoneTouched.value = false
      errors.phone = ''
    }

    const nameBlurHandler = () => {
      isNameTouched.value = true

      if (isEmpty(proxy.value.name)) {
        errors.name = 'Имя обязательно для заполнения'
      } else {
        errors.name = ''
      }
    }
    const phoneBlurHandler = () => {
      isPhoneTouched.value = true

      if (!isValidPhone.value) {
        errors.phone = 'Введен неверный формат телефона'
      } else {
        errors.phone = ''
      }
    }

    watch(
      () => {
        return validation.value
      },
      value => emit('validation', value)
    )

    onMounted(() => emit('validation', validation.value))

    const renderSubtitle = () => {
      return (
        <div class={`${className}-subtitle`}>{subtitle.value}</div>
      )
    }

    const renderNameField = () => {
      return (
        <UiTextField
          v-model={proxy.value.name}
          ariaLabel="name"
          label="Имя"
          placeholder="Ваше имя"
          hint={nameHint.value}
          error={nameError.value}
          required
          onFocus={nameFocusHandler}
          onBlur={nameBlurHandler}
        />
      )
    }
    const renderPhoneField = () => {
      return (
        <UiTextField
          v-model={proxy.value.phone}
          ariaLabel="phone"
          label="Телефон"
          placeholder="+7 (000) 000 00 00"
          hint={phoneHint.value}
          error={phoneError.value}
          required
          onFocus={phoneFocusHandler}
          onBlur={phoneBlurHandler}
        />
      )
    }
    const renderCommentField = () => {
      return (
        <UiTextArea
          v-model={proxy.value.comment}
          ariaLabel="comment"
          label="Комментарий"
          placeholder="Например, интересует комплект для Ауди А6"
        />
      )
    }

    return () => {
      return (
        <div class={className} >
          {renderSubtitle()}
          {renderNameField()}
          {renderPhoneField()}
          {renderCommentField()}
        </div>
      )
    }
  }
})
