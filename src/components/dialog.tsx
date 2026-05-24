import { PropType, Teleport, computed, defineComponent, watchEffect } from 'vue'
import type { CatalogItem } from '@/data/catalog'

export interface CatalogProductDialogProps {
  item: CatalogItem | null
  open: boolean
}

export const catalogProductDialogProps = {
  item: {
    type: Object as PropType<CatalogItem | null>,
    required: false,
    default: null
  },
  open: {
    type: Boolean,
    required: false,
    default: false
  }
}

const baseClassName = 'catalog-product-dialog'

const normalize = (value: number | string): string => {
  return String(value).trim()
}

const formatPrice = (value: number | string): string => {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) {
    return 'По запросу'
  }

  return `$${numberValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

export const CatalogProductDialog = defineComponent({
  name: 'CatalogProductDialog',
  props: catalogProductDialogProps,
  emits: [ 'close' ],

  setup(props, { emit }) {
    const title = computed(() => {
      if (!props.item) {
        return ''
      }

      return [ props.item.series, props.item.model ].map(normalize).filter(Boolean).join(' ')
    })
    const detailRows = computed(() => {
      if (!props.item) {
        return []
      }

      return [
        {
          label: 'Категория',
          value: normalize(props.item.category)
        },
        {
          label: 'Бренд',
          value: normalize(props.item.brand)
        },
        {
          label: 'Серия',
          value: normalize(props.item.series)
        },
        {
          label: 'Марка авто',
          value: normalize(props.item.vehicleBrand)
        },
        {
          label: 'Модель авто',
          value: normalize(props.item.vehicleModel)
        },
        {
          label: 'Диаметр диска',
          value: `${normalize(props.item.discDiameterMm)} мм`
        },
        {
          label: 'Поршни',
          value: normalize(props.item.pistonCount)
        },
        {
          label: 'Покрытие',
          value: normalize(props.item.coating)
        },
        {
          label: 'Применение',
          value: normalize(props.item.application)
        },
        {
          label: 'Статус данных',
          value: normalize(props.item.dataStatus)
        }
      ].filter(row => row.value)
    })
    const price = computed(() => {
      if (!props.item) {
        return ''
      }

      return formatPrice(props.item.priceUsd)
    })

    const close = (): void => {
      emit('close')
    }

    watchEffect(onCleanup => {
      if (!props.open) {
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

    const renderRows = () => {
      return detailRows.value.map(row => {
        return (
          <div class={`${baseClassName}__row`}>
            <span class={`${baseClassName}__row-label`}>{row.label}</span>
            <span class={`${baseClassName}__row-value`}>{row.value}</span>
          </div>
        )
      })
    }
    const renderDialog = () => {
      if (!props.open || !props.item) {
        return null
      }

      return (
        <Teleport to="body">
          <div class={baseClassName} onClick={close}>
            <div class={`${baseClassName}__surface`} onClick={event => event.stopPropagation()}>
              <button
                aria-label="Закрыть"
                class={[ 'material-symbols-outlined', `${baseClassName}__close` ]}
                type="button"
                onClick={close}
              >
                close
              </button>

              <div class={`${baseClassName}__header`}>
                <h3 class={`${baseClassName}__title`}>{title.value}</h3>
                <span class={`${baseClassName}__price`}>{price.value}</span>
              </div>

              <div class={`${baseClassName}__content`}>
                {renderRows()}
              </div>
            </div>
          </div>
        </Teleport>
      )
    }

    return () => renderDialog()
  }
})
