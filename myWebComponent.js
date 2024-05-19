class BookPreview extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById('book-preview-template').content;
      const shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.appendChild(template.cloneNode(true));
    }
  
    connectedCallback() {
      this.shadowRoot.querySelector('.title').innerText = this.getAttribute('title');
      this.shadowRoot.querySelector('.author').innerText = this.getAttribute('author');
      this.shadowRoot.querySelector('.description').innerText = this.getAttribute('description');
    }
  }
  
  customElements.define('book-preview', BookPreview);

  