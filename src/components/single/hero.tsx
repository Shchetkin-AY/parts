import { PropType, defineComponent } from 'vue'

import { type CatalogItem, Colors, Icons } from '@/utils'
import { GIcon } from '@/components/g/icon'

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

    const renderInfo = () => {
      return (
        <div class="product-page__hero-series">
          {props.item.brand} {props.item.series}
        </div>
      )
    }

    const renderModel = () => {
      return (
        <h1 class="product-page__hero-title">
          {String(props.item.model)}
        </h1>
      )
    }

    const renderDescription = () => {
      return (
        <p class="product-page__hero-description">
          {props.item.description}
        </p>
      )
    }

    const renderHeader = () => {
      return (
        <div class="product-page__hero-header">
          {renderInfo()}
          {renderModel()}
        </div>
      )
    }

    const renderStatIcon = (icon: Icons) => {
      return (
        <GIcon icon={icon} color={Colors.primary} size={40} />
      )
    }
    const renderStat = (label: string, icon: Icons, value: string) => {
      return (
        <div class="product-page__hero-stat">
          {renderStatIcon(icon)}
          <div class="product-page__hero-stat-copy">
            <span class="product-page__hero-stat-value">{value}</span>
            <span class="product-page__hero-stat-label">{label}</span>
          </div>
        </div>
      )
    }

    const renderHeroStats = () => {
      return (
        <div class="product-page__hero-stats">
          {stats.map(stat => renderStat(stat.label, stat.icon, stat.value))}
        </div>
      )
    }

    return () => {
      return (
        <div class="product-page__hero-content">
          {renderHeader()}
          {renderDescription()}
          {renderHeroStats()}
        </div>
      )
    }
  }
})
