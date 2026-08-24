import { defineComponent } from 'vue'

import { linesFeatures, linesImages } from '@/data'
import SectionHeading from '@/pages/accessories/ui/section-heading'
import Feature from '@/pages/accessories/ui/feature'
import SectionCta from '@/pages/accessories/ui/cta'

export default defineComponent({
  name: 'AccessoriesLines',

  emits: [ 'order' ],

  setup(_, { emit }) {
    const className = 'lines'

    const renderHeading = () => {
      return (
        <SectionHeading
          eyebrow="В каждом комплекте"
          title="Армированные магистрали"
          description="Три слоя: тефлоновая трубка внутри, оплётка из нержавеющей стали, защитная оболочка PVC снаружи. Фитинги кованые, из нержавеющей стали SUS304."
        />
      )
    }

    const renderFeature = (feature: { title: string;
      description: string }) => {
      return <Feature value={feature} key={feature.title} />
    }

    const renderFeatures = () => {
      return (
        <div class={`${className}__features`}>
          {linesFeatures.map(renderFeature)}
        </div>
      )
    }

    const renderImage = (image: [ string, string ]) => {
      const [ src, alt ] = image

      return (
        <img
          class={`${className}__images-image`}
          src={src}
          alt={alt}
          key={src}
        />
      )
    }
    const renderImages = () => {
      return (
        <div class={`${className}__images`}>
          {linesImages.map(renderImage)}
        </div>
      )
    }

    const renderGrid = () => {
      return (
        <div class={`${className}__grid`}>
          {renderFeatures()}
          {renderImages()}
        </div>
      )
    }
    const renderCta = () => {
      return (
        <SectionCta
          title="Магистрали под вашу конфигурацию"
          description="Подскажем совместимый комплект и варианты фитингов"
          topic="Армированные магистрали"
          label="Подобрать магистрали"
          onOpen={(topic: string) => emit('order', topic)}
        />
      )
    }

    return () => {
      return (
        <div class={className}>
          {renderHeading()}
          {renderGrid()}
          {renderCta()}
        </div>
      )
    }
  }
})
