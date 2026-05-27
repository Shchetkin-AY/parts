import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer',

  setup() {
    return () =>
      <footer class="footer">
        <div class="content-container footer__container">
          <div class="footer__grid">
            <div class="footer__brand-column">
              <div class="footer__brand">ISKOR</div>
              <p class="footer__text">
                Официальное подразделение Savanini Systems. Центр технологических компетенций в области тормозных систем.
              </p>
            </div>

            <div class="footer__column">
              <ul class="footer__links">
              </ul>
            </div>

            <div class="footer__column">
              <ul class="footer__links">
              </ul>
            </div>

            <div class="footer__column">
              <h5 class="footer__title">Контакты</h5>
              <div class="footer__contacts">
                <p><span>sales@steelcore.ru</span></p>
              </div>
            </div>
          </div>

          <div class="footer__bottom">
            <div class="footer__copyright">
              © 2024 Steel Core Engineering. All rights reserved. Precision forged in aircraft grade aluminum.
            </div>
            <div class="footer__meta">
              <span>Privacy Policy</span>
              <span>ISO 9001:2015</span>
            </div>
          </div>
        </div>
      </footer>
  }
})
