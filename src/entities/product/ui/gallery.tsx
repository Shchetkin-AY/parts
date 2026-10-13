import { CatalogItem } from '@/utils'
import { PropType, computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'ProductGallery',

  props: {
    value: {
      type: String as PropType<CatalogItem['series']>,
      required: true
    }
  },

  setup(props) {
    const className = 'product-gallery'

    const images = computed(() => {
      const series = props.value.toLowerCase()

      return [
        `/images/products/${series}/0.webp`,
        `/images/products/${series}/1.webp`,
        `/images/products/${series}/2.webp`,
        '/images/accessories/pads.webp',
        '/images/accessories/discs.webp'
      ]
    })

    const currentImage = ref(images.value[0])

    watch(
      () => images.value,
      value => {
        currentImage.value = value[0]
      }
    )

    const clickHandler = (image: string) => {
      currentImage.value = image
    }

    const renderMainImage = () => {
      return (
        <div class={`${className}__main`}>
          <img
            class={`${className}__main-image`}
            src={currentImage.value}
          />
        </div>
      )
    }

    const renderThumbnail = (image: string) => {
      return (
        <div
          class={{
            [`${className}__thumb`]: true,
            [`${className}__thumb--active`]: image === currentImage.value
          }}
          onClick={() => clickHandler(image)}
        >
          <img
            class={`${className}__thumb-image`}
            src={image}
            alt=""
          />
        </div>
      )
    }

    const renderThumbnails = () => {
      return (
        <div
          class={`${className}__thumbs`}>
          {images.value.map(renderThumbnail)}
        </div>
      )
    }

    return () => {
      return (
        <div class={className}>
          {renderThumbnails()}
          {renderMainImage()}
        </div>
      )
    }
  }
})
