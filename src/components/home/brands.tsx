import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Brands',

  setup() {
    const renderTitle = () => {
      return (
        <div class="brands__title">Установлено на</div>
      )
    }

    const renderContent = () => {
      return (
        <div class="brands-content" >
          {renderTitle()}

          <div class="brands__grid">
            <img src="/brands/benz.svg" alt="Mercedes-Benz" class="brands__item" loading="lazy" decoding="async"/>
            <img src="/brands/bmw.svg" alt="BMW" class="brands__item" loading="lazy" decoding="async"/>
            <img src="/brands/honda.svg" alt="Honda" class="brands__item" loading="lazy" decoding="async"/>
            <img src="/brands/porsche.svg" alt="Porsche" class="brands__item" loading="lazy" decoding="async"/>
            <img src="/brands/vw.svg" alt="vw" class="brands__item" loading="lazy" decoding="async"/>
            <img src="/brands/toyota.svg" alt="Toyota" class="brands__item" loading="lazy" decoding="async"/>
          </div>
        </div>
      )
    }

    return () => {
      return (
        <section class="brands">
          {renderContent()}
        </section>
      )
    }
  }
})
