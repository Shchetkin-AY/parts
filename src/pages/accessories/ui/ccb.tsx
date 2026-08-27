import { defineComponent } from 'vue'

import { ccbFeatures, ccbMetrics, weightCompare, weightCompareNote } from '@/data'
import SectionHeading from '@/pages/accessories/ui/section-heading'
import Feature from '@/pages/accessories/ui/feature'
import SectionCta from '@/pages/accessories/ui/cta'
import { CatalogCategories, CcbMetric, FeatureItem, WeightCompareItem } from '@/utils'
import { useViewportStore } from '@/stores'

export default defineComponent({
  name: 'Ccb',

  emits: [ 'order' ],

  setup(_, { emit }) {
    const viewportStore = useViewportStore()

    const className = 'ccb'

    const renderMetric = (metric: CcbMetric) => {
      return (
        <div
          class={`${className}__metrics-item`}
          key={metric.label}
        >
          {metric.value}
          <div class={`${className}__metrics-label`}>{metric.label}</div>
        </div>
      )
    }

    const renderMetrics = () => {
      return (
        <div class={`${className}__metrics`}>
          {ccbMetrics.map(renderMetric)}
        </div>
      )
    }

    const renderWeightBar = (item: WeightCompareItem) => {
      return (
        <div class={`${className}__weight-item`} key={item.label}>
          <div class={`${className}__weight-label`}>{item.label}</div>
          <div class={`${className}__weight-value`}>{item.value}</div>
          <div class={`${className}__weight-bar ${className}__weight-bar--${item.modifier}`} />
        </div>
      )
    }

    const renderWeightCompare = () => {
      return (
        <div class={`${className}__weight`}>
          {weightCompare.map(renderWeightBar)}
          <div class={`${className}__weight-note`}>{weightCompareNote}</div>
        </div>
      )
    }

    const renderImage = () => {
      return (
        <img
          class={`${className}__wide-image`}
          src="/images/accessories/ccb-macro.webp"
          alt="Макро карбон-керамического кольца SAVANINI"
        />
      )
    }
    const renderWideNote = () => {
      return (
        <div class={`${className}__wide-note`}>
          Поверхность карбида кремния · твёрдость 800 HB
        </div>
      )
    }
    const renderWide = () => {
      if (viewportStore.size.width > 760) {
        return (
          <div class={`${className}__wide`}>
            {renderImage()}
            {renderWideNote()}
          </div>
        )
      }
    }

    const renderRingsImage = () => {
      return (
        <img
          class={`${className}__rings-image`}
          src="/images/accessories/ccb-rings.webp"
          alt="Чугунное и карбон-керамическое кольцо SAVANINI"
        />
      )
    }

    const renderRings = () => {
      return (
        <div class={`${className}__rings`}>
          {renderRingsImage()}
          <div class={`${className}__rings-features`}>
            {renderMetrics()}
            {renderWeightCompare()}
          </div>
        </div>
      )
    }

    const renderFeature = (feature: FeatureItem) => {
      return (
        <Feature
          value={feature}
          key={feature.title}
        />
      )
    }

    const renderFeatures = () => {
      return (
        <div class={`${className}__features`}>
          {ccbFeatures.map(renderFeature)}
        </div>
      )
    }

    const renderCta = () => {
      return (
        <SectionCta
          title="Карбон-керамика для вашего автомобиля"
          description="Подготовим предложение с учётом конфигурации и задач"
          category={CatalogCategories.ccb}
          label="Получить предложение"
          onOpen={(category: CatalogCategories) => emit('order', category)}
        />
      )
    }

    return () =>
      <section class={className} id="ccb">
        <SectionHeading
          eyebrow="Опция дисков"
          title="Карбон-керамика CCB"
          description="Кольцо формуется из углеволокна со связующей смолой, рабочая поверхность покрыта карбидом кремния твёрдостью 800 HB."
        />
        {renderWide()}
        {renderRings()}
        {renderFeatures()}
        {renderCta()}
      </section>
  }
})
