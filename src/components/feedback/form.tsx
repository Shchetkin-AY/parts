import { FeedbackPayload, isEmpty } from '@/utils'
import { PropType, computed, defineComponent, onMounted, watch } from 'vue'
import { GTextArea, GTextField } from '@/components/g'

const className = 'feedback__form'

export default defineComponent({
  name: 'Form',

  props: {
    modelValue: {
      type: Object as PropType<FeedbackPayload>,
      default: () => ({})
    }
  },

  emits: [ 'update:modelValue', 'validation' ],

  setup(props, { emit }) {
    const proxy = computed({
      get: () => props.modelValue,
      set: value => {
        emit('update:modelValue', value)
      }
    })
    const isValidPhone = computed(() => {
      const digits = proxy.value.phone.replace(/\D/g, '')

      return /^(7|8)\d{10}$/.test(digits)
    })
    const isValidName = computed<boolean>(() => {
      return !isEmpty(proxy.value.name)
    })
    const validation = computed<boolean>(() => {
      return isValidName.value && isValidPhone.value
    })

    watch(
      () => {
        return validation.value
      },
      value => emit('validation', value)
    )

    onMounted(() => emit('validation', validation.value))

    const renderSubtitle = () => {
      return (
        <div class={`${className}-subtitle`}>
          Оставьте контакты, и специалист поможет подобрать тормозную систему под ваш автомобиль.
        </div>
      )
    }

    const renderNameField = () => {
      return (
        <GTextField
          v-model={proxy.value.name}
          ariaLabel="name"
          label="Имя"
          placeholder="Ваше имя"
          clearable
        />
      )
    }
    const renderPhoneField = () => {
      return (
        <GTextField
          v-model={proxy.value.phone}
          ariaLabel="phone"
          label="Телефон"
          placeholder="+7 (000) 000 00 00"
          clearable
        />
      )
    }
    const renderCommentField = () => {
      return (
        <GTextArea
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
