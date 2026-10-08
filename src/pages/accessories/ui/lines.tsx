import { defineComponent } from 'vue'

import { linesFeatures } from '@/data'
import { CatalogCategories } from '@/utils'
import {
  AccessoriesCta,
  AccessoriesFeature,
  AccessoriesSectionHeading
} from './common'

export default defineComponent({
  name: 'AccessoriesLines',

  emits: [ 'order' ],

  setup(_, { emit }) {
    const className = 'lines'

    const renderHeading = () => {
      return (
        <AccessoriesSectionHeading
          eyebrow="В каждом комплекте"
          title="Армированные магистрали"
          description="Три слоя: тефлоновая трубка внутри, оплётка из нержавеющей стали, защитная оболочка PVC снаружи. Фитинги кованые, из нержавеющей стали SUS304."
        />
      )
    }

    const renderFeature = (feature: { title: string;
      description: string }) => {
      return <AccessoriesFeature value={feature} key={feature.title} />
    }

    const renderFeatures = () => {
      return (
        <div class={`${className}__features`}>
          {linesFeatures.map(renderFeature)}
        </div>
      )
    }

    const renderImage = () => {
      return (
        <img
          class={`${className}__image`}
          src={'/images/accessories/hoses-01.webp'}
          alt={'Армированные тормозные шланги SAVANINI'}
          key={'/images/accessories/hoses-01.webp'}
        />
      )
    }

    const renderGrid = () => {
      return (
        <div class={`${className}__grid`}>
          {renderFeatures()}
          {renderImage()}
        </div>
      )
    }
    const renderCta = () => {
      return (
        <AccessoriesCta
          title="Магистрали под вашу конфигурацию"
          description="Подскажем совместимый комплект и варианты фитингов"
          category={CatalogCategories.lines}
          label="Подобрать магистрали"
          onOpen={(category: CatalogCategories) => emit('order', category)}
        />
      )
    }

    return () => {
      return (
        <section class={className}>
          {renderHeading()}
          {renderGrid()}
          {renderCta()}
        </section>
      )
    }
  }
})
