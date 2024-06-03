import { authors } from '../data.js';

class BookPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const { author, id, image, title } = this.dataset;
    const authorName = authors[author]; // Fetch the author's name using the ID
    
    this.shadowRoot.innerHTML = `
      <style>
        .preview {
          display: flex;
          align-items: center;
          border: none;
          background: none;
          cursor: pointer;
          text-align: left;
        }
        .preview__image {
          width: 50px;
          height: 75px;
          margin-right: 10px;
        }
        .preview__info {
          display: flex;
          flex-direction: column;
        }
        .preview__title {
          font-size: 1.2em;
          margin: 0;
        }
        .preview__author {
          font-size: 1em;
          color: gray;
        }
      </style>
      <button class="preview" data-preview="${id}">
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authorName}</div> <!-- Use the author's name here -->
        </div>
      </button>
    `;
  }
}

customElements.define('book-preview', BookPreview);
