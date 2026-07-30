import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProductHighlight',

  setup() {
    return () =>
      <section class="product-highlight">
        <div class="content-container">
          <div class="product-highlight__heading">
            <span class="product-highlight__eyebrow">The Collection</span>
            <h2 class="product-highlight__title">Продукция</h2>
          </div>

          <div class="product-highlight__grid">
            <article class="product-highlight__card product-highlight__card--wide">
              <img
                class="product-highlight__image"
                alt="Composite brake discs"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyt70oC18csm-6Xa5c6amepci-_9KAuuIxdPBH0DzUTG5ji2mRu3yl_PlW-0y6klFQHJ7TvbVXN2m-BgEgF24SbAfdU9IO94ExBAcnR6rsEY7xMkxiC_LXu3s-oJW_MBbZzWfEzmA4hGrqdceV5tJIKPlsoUHslHL32nZXAK0Vb_XLS4yox1BiRZqMHCgHXdc7SGC5m17dg1GSUrnauwKIvyUhC0h4YK5lCLb1N0L5BxKt5LbhmlOnIEbfC_cGyVFWwkVv9He6oYM"
              />
              <div class="product-highlight__overlay">
                <h3 class="product-highlight__card-title">Тормозные диски</h3>
                <p class="product-highlight__card-text">Композитные диски с плавающим ротором и системой направленной вентиляции.</p>
              </div>
            </article>

            <article class="product-highlight__card">
              <img
                class="product-highlight__image"
                alt="Carbon fiber air intake"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_l6tCx5tfShbawo4w7b_vv34maL0vKjaYY_oDyKnN-v8LqNKN6lh7_Lm3bGUnqEgO2q6JFRQLyjzNcf8n2Sn_AdBOS0Ixg6qY26ajXqvq-yAG_wfiCuy0Wz1tHykFvBIzJQYddwFVm5vaJlazPiZEeHh7whO-6Re8b1SKyFBzVpqzJciMezmPmzovwqgP1dP9e7l-Xws1zfQymRA0QSGSi3sCLWxlNbfwihVA6eedc41G5oGbSJPe8tUenBax6D0_dCq11co0Wng"
              />
              <div class="product-highlight__overlay">
                <h3 class="product-highlight__card-title product-highlight__card-title--small">Впускные системы</h3>
              </div>
            </article>

            <article class="product-highlight__card product-highlight__card--engineering">
              <div class="product-highlight__engineering-overlay" />
              <div class="product-highlight__engineering-content">
                <span class="material-symbols-outlined product-highlight__engineering-icon">engineering</span>
                <h3 class="product-highlight__engineering-title">Custom Engineering</h3>
                <p class="product-highlight__engineering-text">Индивидуальное проектирование тормозных систем под нестандартные кулаки и вылеты дисков.</p>
                <button class="product-highlight__engineering-button">Запрос инженеру</button>
              </div>
            </article>

            <article class="product-highlight__card product-highlight__card--wide">
              <img
                class="product-highlight__image"
                alt="Bolt-on brake kits"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUG9BZ1ULHKP7wkTzaM89XChhcMaa92ZjZAg0s0PkjMuPyK-PgtICTFSfSvgLfR2WM2Hy5VN87xQc3IgForJ5l6_VKYWtMrK0Ch2RSfgdloeFhYqmjVOMZCJEQ6OrP_DJyBoouGGiJtMz7_qZBCxhN0VIvP5DYUGpkFumPnw9UqayMnm2kqJ-2v4WsmF0KBAqOkL9itcuCFtE2qO6brNij6c_51wB7elA0xNe7qRXxvGRcuZ0_oz5r6CWuKwoQKGR8EEt85YhWSUE"
              />
              <div class="product-highlight__overlay">
                <h3 class="product-highlight__card-title">Готовые киты</h3>
                <p class="product-highlight__card-text">Протестированные Bolt-on решения. Установка в штатные места без доработок.</p>
              </div>
            </article>
          </div>
        </div>
      </section>
  }
})
