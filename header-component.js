class HeaderComponent extends HTMLElement {
    constructor() {
      super();
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
        /* header */

        .header {
          background-color: rgba(var(--color-force-dark), 0.9);
          position: sticky;
          top: 0;
          left: 0;
        }
        
        .header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 70rem;
          padding: 0 1rem;
          margin: 0 auto;
        }
        
        .header__logo {
          padding: 1.5rem 0 1.5rem 0.5rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        
        .header__shape {
          height: 1rem;
          margin-right: 0.75rem;
          fill: rgb(var(--color-blue));
          display: none;
        }
        
        @media (min-width: 30rem) {
          .header__shape {
            display: block;
          }
        }
        
        .header__text {
          height: 1rem;
          fill: rgba(var(--color-force-light), 1);
        }
        
        @media (min-width: 30rem) {
          .header__text {
            height: 1.25rem;
            fill: rgba(var(--color-force-light), 1);
          }
        }
        
        .header__icon {
          width: 1.5rem;
          height: 1.5rem;
          fill: rgba(var(--color-force-light), 1);
        }
        
        .header__button {
          background-color: rgba(var(--color-force-light), 0.1);
          transition: background-color 0.1s;
          border-width: 0;
          border-radius: 6px;
          height: 2.5rem;
          width: 2.5rem;
          cursor: pointer;
          margin-right: 0.25rem;
        }
        
        .header__button:hover {
          background-color: rgba(var(--color-force-light), 0.2);
        }
        
        .header__button:active {
          background-color: rgba(var(--color-force-light), 0.3);
        }
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
  