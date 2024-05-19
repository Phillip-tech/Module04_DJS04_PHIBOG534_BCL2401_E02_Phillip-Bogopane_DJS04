// book-preview-component.js
class BookPreview extends HTMLElement {
    constructor() {
      super();
      // Attach a shadow DOM to encapsulate the component's styles and markup
      this.attachShadow({ mode: 'open' });
      // Clone the template content and append it to the shadow DOM
      const template = document.getElementById('book-preview-template');
      const content = template.content.cloneNode(true);
      this.shadowRoot.appendChild(content);
    }
  
    // Define getters and setters for properties
    set title(value) {
      this.shadowRoot.querySelector('.book-title').textContent = value;
    }
  
    set cover(src) {
      this.shadowRoot.querySelector('.book-cover').src = src;
    }
  
    set summary(value) {
      this.shadowRoot.querySelector('.book-summary').textContent = value;
    }
  }
  
  // Define the custom element
  customElements.define('book-preview', BookPreview);
  