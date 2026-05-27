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
            <img src="brands/benz.svg" alt="brand" class="brands__item"/>
            <img src="brands/bmw.svg" alt="brand" class="brands__item"/>
            <img src="brands/honda.svg" alt="brand" class="brands__item"/>
            <img src="brands/ferrari.svg" alt="brand" class="brands__item"/>
            <img src="brands/toyota.svg" alt="brand" class="brands__item"/>
            <img src="brands/porsche.svg" alt="brand" class="brands__item"/>
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

