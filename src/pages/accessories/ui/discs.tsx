import { defineComponent } from 'vue'

import {
  CatalogCategories,
  FeatureItem,
  discFeatures,
  discGallery,
  discSizes,
  discSizesNote
} from '@/utils'
import {
  AccessoriesCta,
  AccessoriesFeature,
  AccessoriesSectionHeading
} from './common'

export default defineComponent({
  name: 'AccessoriesDiscs',

  emits: [ 'order' ],

  setup(_, { emit }) {
    const className = 'discs'

    const renderHeading = () => {
      return (
        <AccessoriesSectionHeading
          eyebrow="282–400 мм"
          title="Тормозные диски"
          description="Составные: рабочее кольцо на алюминиевом центре. Кольца выпускаются в двух чугунных исполнениях и в карбон-керамике. Каждый диск проходит динамическую балансировку."
        />
      )
    }

    const renderFeature = (feature: FeatureItem) => {
      return (
        <AccessoriesFeature
          value={feature}
          key={feature.title}
        />
      )
    }

    const renderFeatures = () => {
      return (
        <div class={`${className}__features`}>
          {discFeatures.map(renderFeature)}
        </div>
      )
    }

    const renderLeadImage = () => {
      return (
        <img
          class={`${className}__split-image`}
          src="/images/accessories/discs-02.webp"
          alt="Составной тормозной диск SAVANINI"
        />
      )
    }

    const renderSplit = () => {
      return (
        <div class={`${className}__split`}>
          {renderLeadImage()}
          {renderFeatures()}
        </div>
      )
    }

    const renderGalleryItem = (item: [ string, string ]) => {
      const [ image, caption ] = item

      return (
        <div
          class={`${className}__gallery-item`}
          key={image}
        >
          <img class={`${className}__gallery-image`} src={image} alt={caption} loading="lazy" />
          <div class={`${className}__gallery-caption`} >{caption}</div>
        </div>
      )
    }

    const renderGallery = () => {
      return (
        <div class={`${className}__gallery`}>
          {discGallery.map(renderGalleryItem)}
        </div>
      )
    }

    const renderTableRow = (row: [ string, string, string ]) => {
      return (
        <tr key={row[0]}>
          {row.map((cell, index) => <td class={index === 0 ? 'is-code' : ''} key={cell}>{cell}</td>)}
        </tr>
      )
    }

    const renderTable = () => {
      return (
        <table>
          <thead>
            <tr>
              <th>Диаметр × толщина, мм</th>
              <th>Масса кольца</th>
              <th>Вентиляция</th>
            </tr>
          </thead>
          <tbody>{discSizes.map(renderTableRow)}</tbody>
        </table>
      )
    }

    const renderSizes = () => {
      return (
        <div class={`${className}__table`}>
          <div class={`${className}__table-title`}>Типоразмеры</div>
          {renderTable()}
          <p class={`${className}__table-note`}>{discSizesNote}</p>
        </div>
      )
    }

    const renderCta = () => {
      return (
        <AccessoriesCta
          title="Не уверены, какое исполнение нужно?"
          description="Подскажем по вашей машине и стилю езды"
          category={CatalogCategories.discs}
          label="Подобрать диски"
          onOpen={(topic: string) => emit('order', topic)}
        />
      )
    }

    return () =>
      <section class={className}>
        {renderHeading()}
        {renderSplit()}
        {renderGallery()}
        {renderSizes()}
        {renderCta()}
      </section>
  }
})
