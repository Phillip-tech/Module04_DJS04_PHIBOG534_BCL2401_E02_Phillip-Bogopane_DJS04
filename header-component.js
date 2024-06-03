class HeaderComponent extends HTMLElement {
    constructor() {
      super();
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          @import url('./styles.css');
        </style>
        <header class="header">
          <div class="header__inner">
            <div class="header__logo">
              <!-- SVG logo here -->
            </div>
            <div>
              <button class="header__button" data-header-search>
                <!-- Search Icon SVG here -->
              </button>
              <button class="header__button" data-header-settings>
                <!-- Settings Icon SVG here -->
              </button>
            </div>
          </div>
        </header>
      `;
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
  
  customElements.define('header-component', HeaderComponent);
  