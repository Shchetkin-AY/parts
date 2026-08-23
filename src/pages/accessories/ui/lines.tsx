import { defineComponent } from 'vue'

import { linesFeatures, linesImages } from '@/data'
import SectionHeading from '@/pages/accessories/ui/section-heading'
import Feature from '@/pages/accessories/ui/feature'
import SectionCta from '@/pages/accessories/ui/cta'

export default defineComponent({
  name: 'AccessoriesLines',

  emits: [ 'order' ],

  setup(_, { emit }) {
    const renderFeature = (feature: { title: string;
      description: string }) => {
      return <Feature value={feature} key={feature.title} />
    }

    const renderFeatures = () => {
      return <div class="accessories-page__feature-list">{linesFeatures.map(renderFeature)}</div>
    }

    const renderImage = (image: [ string, string ]) => {
      const [ src, alt ] = image

      return <img src={src} alt={alt} key={src} />
    }

    const renderImages = () => {
      return <div>{linesImages.map(renderImage)}</div>
    }

    const renderGrid = () => {
      return (
        <div class="accessories-page__lines-grid">
          {renderFeatures()}
          {renderImages()}
        </div>
      )
    }

    const renderContent = () => {
      return (
        <div class="accessories-page__container">
          <SectionHeading
            eyebrow="В каждом комплекте"
            title="Армированные магистрали"
            description="Три слоя: тефлоновая трубка внутри, оплётка из нержавеющей стали, защитная оболочка PVC снаружи. Фитинги кованые, из нержавеющей стали SUS304."
          />
          {renderGrid()}
          <SectionCta
            title="Магистрали под вашу конфигурацию"
            description="Подскажем совместимый комплект и варианты фитингов"
            topic="Армированные магистрали"
            label="Подобрать магистрали"
            onOpen={(topic: string) => emit('order', topic)}
          />
        </div>
      )
    }

    return () =>
      <section class="isk-page__section accessories-page__section accessories-page__section--dark" id="lines">
        {renderContent()}
      </section>
  }
})
