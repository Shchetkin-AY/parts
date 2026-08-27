import { ButtonMode, Color, FeedbackPayload, FeedbackTypes, Size, isEmpty } from '@/utils'
import { PropType, computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { UiButton, UiTextArea, UiTextField } from '@/ui'
import { ChannelsLabels, FeedbackChannels } from '@/utils/feedback/channels'

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
    },

    loading: {
      type: Boolean as PropType<boolean>,
      default: false
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
        case FeedbackTypes.question: return 'Оставьте контакты, и специалист поможет подобрать тормозную систему под ваш автомобиль'
        case FeedbackTypes.order: return 'Заполните форму — мы подготовим расчет под ваш автомобиль и свяжемся с Вами'
      }
    })

    const phoneFieldProps = computed(() => {
      const result = {
        ariaLabel: 'phone',
        label: 'Телефон',
        placeholder: '+7 (000) 000 00 00',
        hint: phoneHint.value,
        error: phoneError.value,
        disabled: props.loading,
        required: true,
        onFocus: phoneFocusHandler,
        onBlur: phoneBlurHandler
      }

      switch (proxy.value.channel) {
        case FeedbackChannels.telegram: {
          result.label = 'Номер телефона или имя пользователя'
          result.placeholder = '+7 (000) 000 00 00 или @username'
          break
        }
      }

      return result
    })

    const isValidPhone = computed(() => {
      const value = proxy.value.phone ?? ''
      const digits = value.replace(/\D/g, '')

      return /^(7|8)\d{10}$/.test(digits) ||
        proxy.value.channel === FeedbackChannels.telegram && /^@[a-zA-Z0-9_]+$/.test(value)
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
        errors.phone = proxy.value.channel === FeedbackChannels.telegram
          ? 'Введите телефон или ник, начинающийся с @'
          : 'Введен неверный формат телефона'
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
    const renderChannel = (channel: FeedbackChannels) => {
      return (
        <UiButton
          label={ChannelsLabels[channel]}
          color={Color[channel]}
          size={Size.small}
          mode={proxy.value.channel === channel ? undefined : ButtonMode.outline}
          onClick={() => proxy.value.channel = channel}
        />
      )
    }
    const renderChannelsButtons = () => {
      return Object.values(FeedbackChannels).map(type => {
        return renderChannel(type)
      })
    }
    const renderChannels = () => {
      return (
        <div class={`${className}-channels`}>
          {renderChannelsButtons()}
        </div>
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
          disabled={props.loading}
          required
          onFocus={nameFocusHandler}
          onBlur={nameBlurHandler}
        />
      )
    }
    const renderPhoneField = () => {
      return (
        <UiTextField v-model={proxy.value.phone} {...phoneFieldProps.value} />
      )
    }
    const renderCommentField = () => {
      return (
        <UiTextArea
          v-model={proxy.value.comment}
          disabled={props.loading}
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
          {renderChannels()}
          {renderNameField()}
          {renderPhoneField()}
          {renderCommentField()}
        </div>
      )
    }
  }
})
