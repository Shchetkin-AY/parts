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
    const images = computed(() => [
      `/images/products/${props.value.toLowerCase()}/1.webp`,
      `/images/products/${props.value.toLowerCase()}/2.webp`,
      `/images/products/${props.value.toLowerCase()}/3.webp`,
      '/images/accessories/pads.webp',
      '/images/accessories/discs.webp'
    ])

    const currentImage = ref(images.value[0])

    watch(images, value => {
      currentImage.value = value[0]
    })

    const renderMainImage = () => {
      return (
        <div class="product-gallery__main">
          <img
            class="product-gallery__main-image"
            src={currentImage.value}
          />
        </div>
      )
    }

    const renderThumbnail = (image: string) => {
      return (
        <div
          class={{
            'product-gallery__thumb': true,
            'product-gallery__thumb--active': image === currentImage.value
          }}
          onClick={() => {
            currentImage.value = image
          }}
        >
          <img
            class="product-gallery__thumb-image"
            src={image}
            alt=""
          />
        </div>
      )
    }

    const renderThumbnails = () => {
      return (
        <div class="product-gallery__thumbs">
          {images.value.map(renderThumbnail)}
        </div>
      )
    }

    return () =>
      <div class="product-gallery">
        {renderThumbnails()}
        {renderMainImage()}
      </div>
  }
})
