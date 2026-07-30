import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Brands',

  setup() {
    const className = 'brands'

    const brands = [ 'benz', 'bmw', 'honda', 'porsche', 'vw', 'toyota' ]

    const renderTitle = () => {
      return (
        <div class="brands__title">Установлено на</div>
      )
    }

    const renderItem = (brand: string) => {
      return (
        <img
          src={`/brands/${brand}.svg`}
          alt={brand}
          class="brands__item"
          loading="lazy"
          decoding="async"/>
      )
    }
    const renderItems = () => {
      return (
        <div class="brands__items">
          {brands.map(brand => {
            return renderItem(brand)
          })}
        </div>
      )
    }

    return () => {
      return (
        <section class={className}>
          {renderTitle()}
          {renderItems()}
        </section>
      )
    }
  }
})
