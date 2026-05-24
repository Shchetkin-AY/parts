import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TechnicalExcellence',

  setup() {
    return () =>
      <section class="technical-excellence">
        <div class="content-container technical-excellence__container">
          <div class="technical-excellence__row">
            <div class="technical-excellence__media technical-excellence__media--factory">
              <img
                class="technical-excellence__image technical-excellence__image--grayscale"
                alt="Automated factory floor with CNC lines"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfuEmTmXsHtC7kTerC1JlJAm4FQf5AgxbpkJSQ9mAsRKWZvQjSwKQFu_eJ0eOvUeHwHYiTWZxRGDcoPEqIhLnBLAOMBcuBaKgfhOn3mpKXOg9960ArdsxpF46BpfOZ03oI2W-fRbEM7Xnm9BU2YFxW1ehk-3B4JsK6DObbJ9Ai8ERXaW_a6u2V643y6WhZIOZw_VVOz42xpC1XM4d4wxnxZH-hp9YRsP7F2BFPfULaIxB3cJ7imGwm6JPd3bLudp5uLZKppI9VPg4"
              />
              <div class="technical-excellence__factory-overlay" />
              <div class="technical-excellence__stats">
                <div class="technical-excellence__stat">
                  <span class="technical-excellence__stat-value">4200 m²</span>
                  <span class="technical-excellence__stat-label">Площадь завода</span>
                </div>
                <div class="technical-excellence__stat">
                  <span class="technical-excellence__stat-value">50+</span>
                  <span class="technical-excellence__stat-label">CNC Центров</span>
                </div>
              </div>
            </div>

            <div class="technical-excellence__copy">
              <span class="technical-excellence__eyebrow">Scale &amp; Infrastructure</span>
              <h2 class="technical-excellence__title">Индустрия 4.0</h2>
              <p class="technical-excellence__text">
                Производственный комплекс Savanini — это цифровая экосистема MES/WMS. Полная прослеживаемость каждой детали от слитка алюминия до финальной лазерной гравировки.
              </p>
              <ul class="technical-excellence__list">
                <li class="technical-excellence__item"><span />Интегрированная система управления качеством MES</li>
                <li class="technical-excellence__item"><span />Автоматизированные склады WMS</li>
              </ul>
            </div>
          </div>

          <div class="technical-excellence__row">
            <div class="technical-excellence__copy technical-excellence__copy--control">
              <span class="technical-excellence__eyebrow">Testing Protocols</span>
              <h2 class="technical-excellence__title">Абсолютный <br />Контроль</h2>
              <p class="technical-excellence__text">
                Стабилизация металла в течение 72 часов при 580°C снимает внутренние напряжения. Каждый суппорт проходит серию гидравлических испытаний.
              </p>
              <div class="technical-excellence__pressure-grid">
                <div class="technical-excellence__pressure">
                  <div class="technical-excellence__pressure-value">0.4 MPa</div>
                  <div class="technical-excellence__pressure-label">Low Pressure</div>
                </div>
                <div class="technical-excellence__pressure">
                  <div class="technical-excellence__pressure-value">12 MPa</div>
                  <div class="technical-excellence__pressure-label">Service Load</div>
                </div>
                <div class="technical-excellence__pressure">
                  <div class="technical-excellence__pressure-value technical-excellence__pressure-value--accent">30 MPa</div>
                  <div class="technical-excellence__pressure-label">Extreme Peak</div>
                </div>
              </div>
            </div>

            <div class="technical-excellence__media technical-excellence__media--cnc">
              <img
                class="technical-excellence__image"
                alt="CNC milling process with high-pressure coolant"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlIb0t8maZwKWhj3bleaT95ehNCpkITobvWRq24yIbbakBZ5689Gc0VgD5BWZKxUFiAy4_5xFKbfqvB3pnPRK6I43NudPlETEttv-ycF2RMGCo-mBLntJUbhZgJfBJCGtwjKjNsuar1yxNOypVDA_XhSUW0T_bjaYAT3M8_vi_RDXB2WGVyx1cA5KAa6WWK5jnVU86NJXJkOUMm27uZ8rcJQXGT32P-uusoDgIyvZgD-4fBXstJtvtDLLesO4IIUZx30ck01qF5G8"
              />
              <div class="technical-excellence__cnc-overlay" />
            </div>
          </div>
        </div>
      </section>
  }
})
