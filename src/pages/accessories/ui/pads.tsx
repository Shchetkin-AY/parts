import { computed, defineComponent, ref } from 'vue'

import { axisLabels, pads } from '@/data'
import SectionHeading from '@/pages/accessories/ui/section-heading'
import SectionCta from '@/pages/accessories/ui/cta'
import { PadComposition, PadId } from '@/utils'

export default defineComponent({
  name: 'AccessoriesPads',

  emits: [ 'order' ],

  setup(_, { emit }) {
    const activePad = ref<PadId>(pads[0].id)

    const className = 'pads'

    const selectedPad = computed<PadComposition>(() => {
      return pads.find(pad => pad.id === activePad.value) ?? pads[0]
    })

    const renderHeading = () => {
      return (
        <SectionHeading
          eyebrow="Четыре состава"
          title="Колодки"
          description="В каждом комплекте штатно стоит F600, остальные составы подбираются под режим эксплуатации и меняются при переходе на трек."
        />
      )
    }

    const renderAxis = () => {
      return (
        <div class={`${className}__panel-axis`}>
          {axisLabels.map(label => {
            return (
              <span key={label}>{label}</span>
            )
          })
          }
        </div>
      )
    }

    const renderScaleTitle = (title: string) => {
      return (
        <div class={`${className}__panel-scale-title`}>
          {title}
        </div>
      )
    }
    const renderScaleBar = (id: PadId) => {
      return <i class={`${className}__panel-bar ${className}__panel-bar--${id}`} />
    }
    const renderBarRange = (range: [number, number]) => {
      return (
        <div class={`${className}__panel-scale-range`}>
          {range[0]}–{range[1]}
        </div>
      )
    }
    const renderScale = (pad: PadComposition) => {
      return (
        <div
          class={{
            [`${className}__panel-scale`]: true,
            [`${className}__panel-scale--active`]: activePad.value === pad.id
          }}
          onMouseenter={() => activePad.value = pad.id}
          key={pad.id}
        >
          {renderScaleTitle(pad.title)}
          {renderScaleBar(pad.id)}
          {renderBarRange(pad.range)}
        </div>
      )
    }
    const renderScales = () => {
      return (
        <div class={`${className}__panel-scales`}>
          {pads.map(renderScale)}
          {renderAxis()}
        </div>
      )
    }

    const renderPanelTitle = () => {
      return (
        <div class={`${className}__panel-info-title`}>
          {[ selectedPad.value.title, selectedPad.value.subtitle ].join(' - ')}
        </div>
      )
    }
    const renderPanelValue = () => {
      return (
        <div class={`${className}__panel-info-value`}>
          {selectedPad.value.usage}
        </div>
      )
    }
    const renderPanelDescription = () => {
      return (
        <div class={`${className}__panel-info-description`}>{selectedPad.value.description}</div>
      )
    }
    const renderPanelInfo = () => {
      return (
        <div class={`${className}__panel-info`}>
          {renderPanelTitle()}
          {renderPanelValue()}
          {renderPanelDescription()}
        </div>
      )
    }

    const renderPanel = () => {
      return (
        <div class={`${className}__panel`}>
          <div class={`${className}__panel-title`}>Рабочие температуры составов</div>
          {renderScales()}
          {renderPanelInfo()}
        </div>
      )
    }

    const renderCardImage = (pad: PadComposition) => {
      return (
        <img
          class={`${className}__card-image`}
          src={pad.image}
          alt={`${pad.title} — ${pad.subtitle}`}
          loading="lazy"
        />
      )
    }
    const renderCardTitle = (pad: PadComposition) => {
      return (
        <div class={`${className}__card-title`}>
          {pad.title}
        </div>
      )
    }
    const renderCardSubtitle = (pad: PadComposition) => {
      return (
        <div class={`${className}__card-subtitle`}>
          {pad.subtitle}
        </div>
      )
    }
    const renderCardDescription = (pad: PadComposition) => {
      return (
        <div class={`${className}__card-description`}>
          {pad.description}
        </div>
      )
    }
    const renderCardInfo = (pad: PadComposition) => {
      return (
        <div class={`${className}__card-info`}>
          {renderCardTitle(pad)}
          {renderCardSubtitle(pad)}
          {renderCardDescription(pad)}
        </div>
      )
    }
    const renderCard = (pad: PadComposition) => {
      return (
        <div
          class={`${className}__card`}
          key={pad.id}
        >
          {renderCardImage(pad)}
          {renderCardInfo(pad)}
        </div>
      )
    }

    const renderCards = () => {
      return (
        <div class={`${className}__cards`}>
          {pads.map(renderCard)}
        </div>
      )
    }

    return () => {
      return (
        <section class={className}>
          {renderHeading()}
          {renderPanel()}
          {renderCards()}
          <SectionCta
            title="Подберём состав под ваш режим езды"
            description="Уточним автомобиль, задачи и подходящую колодку"
            topic="Колодки"
            label="Подобрать колодки"
            onOpen={(topic: string) => emit('order', topic)}
          />
        </section>
      )
    }
  }
})
