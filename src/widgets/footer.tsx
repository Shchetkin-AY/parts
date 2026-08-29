import { PropType, defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'Footer',

  props: {
    class: {
      type: String as PropType<string>,
      default: ''
    }
  },

  setup(props) {
    const renderBrand = () =>
      <div class="footer__brand-column">
        <div class="footer__brand">ISKOR</div>

        <p class="footer__text">
          Официальное подразделение Savanini Systems.
          Центр технологических компетенций в области тормозных систем.
        </p>
      </div>

    const renderCatalog = () =>
      <div class="footer__column">
        <h5 class="footer__title">Каталог</h5>

        <ul class="footer__links">
          <li>
            <RouterLink class="footer__link" to={{ name: 'home' }}>
              Главная
            </RouterLink>
          </li>

          <li>
            <RouterLink class="footer__link" to={{ name: 'catalog' }}>
              Комплекты
            </RouterLink>
          </li>

          <li>
            <RouterLink class="footer__link" to={{ name: 'accessories' }}>
              Комплектующие
            </RouterLink>
          </li>
        </ul>
      </div>

    const renderInformation = () =>
      <div class="footer__column">
        <h5 class="footer__title">Информация</h5>

        <ul class="footer__links">
          <li>
            <a class="footer__link" href="/about">
              О компании
            </a>
          </li>

          <li>
            <a class="footer__link" href="/contacts">
              Контакты
            </a>
          </li>
        </ul>
      </div>

    const renderContacts = () =>
      <div class="footer__column">
        <h5 class="footer__title">Контакты</h5>

        <div class="footer__contacts">
          <p>
            <span>sales@iskor.ru</span>
          </p>
        </div>
      </div>

    const renderGrid = () =>
      <div class="footer__grid">
        {renderBrand()}
        {renderCatalog()}
        {renderInformation()}
        {renderContacts()}
      </div>

    const renderBottom = () =>
      <div class="footer__bottom">
        <div class="footer__meta">
          <span>© 2026 ISKOR ISO 9001:2015</span>
        </div>
      </div>

    const renderFooter = () => {
      return (
        <footer class={[ 'footer', props.class ]}>
          <div class="content-container footer__container">
            {renderGrid()}
            {renderBottom()}
          </div>
        </footer>
      )
    }

    return () => renderFooter()
  }
})
