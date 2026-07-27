import { PropType, defineComponent } from 'vue'

import { type CatalogItem, Colors, Icons } from '@/utils'
import { GIcon } from '@/components/g/icon'
import { useViewportStore } from '@/stores'

interface Stat {
  label: string
  value: string
  icon: Icons
}

export const ProductHero = defineComponent({
  name: 'ProductHero',

  props: {
    item: {
      type: Object as PropType<CatalogItem>,
      required: true
    }
  },

  setup(props) {
    const viewportStore = useViewportStore()

    const className = 'product-hero'

    const stats: Stat[] = [
      {
        label: 'Количество поршней',
        icon: Icons.piston,
        value: `${props.item.pistonCount} шт`
      },
      {
        label: 'Диаметр диска',
        icon: Icons['wheel-diameter'],
        value: `${props.item.discDiameter} мм`
      },
      {
        label: 'Диаметр колес',
        icon: Icons.wheel,
        value: props.item.wheelDiameter
      },
      {
        label: 'Площадь поршней',
        icon: Icons.square,
        value: `${props.item.pistonArea} см²`
      },
      {
        label: 'Покрытие',
        icon: Icons.drop,
        value: props.item.coating
      },
      {
        label: 'Применение',
        icon: Icons.ui,
        value: props.item.application
      }
    ]

    const renderSeries = () => {
      return (
        <div class={`${className}__header-series`}>
          {props.item.brand} {props.item.series}
        </div>
      )
    }

    const renderModel = () => {
      return (
        <h1 class={`${className}__header-model`}>
          {props.item.model}
        </h1>
      )
    }

    const renderHeader = () => {
      return (
        <div class={`${className}__header`}>
          {renderSeries()}
          {renderModel()}
        </div>
      )
    }

    const renderDescription = () => {
      return (
        <p class={`${className}__description`}>
          {props.item.description}
        </p>
      )
    }

    const renderStatIcon = (icon: Icons) => {
      if (viewportStore.size.width > 1400) {
        return (
          <GIcon icon={icon} color={Colors.primary} size={40} />
        )
      }
    }
    const renderStatContent = (label: string, value: string) => {
      return (
        <div class={`${className}__stat-content`}>
          <span class={`${className}__stat-content-value`}>{value}</span>
          <span class={`${className}__stat-content-label`}>{label}</span>
        </div>
      )
    }
    const renderStat = (label: string, icon: Icons, value: string) => {
      return (
        <div class={`${className}__stat`}>
          {renderStatIcon(icon)}
          {renderStatContent(label, value)}
        </div>
      )
    }

    const renderHeroStats = () => {
      if (viewportStore.size.width > 1320) {
        return (
          <div class={`${className}__stats`}>
            {stats.map(stat => {
              return renderStat(stat.label, stat.icon, stat.value)
            })}
          </div>
        )
      }
    }

    return () => {
      return (
        <div class={className}>
          {renderHeader()}
          {renderDescription()}
          {renderHeroStats()}
        </div>
      )
    }
  }
})
