import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

class BookPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.pageNumber = 1;

    this.page = this.addPage(0);

    this.button;
  }

  addPage(number){
    const newPage = this.pageNumber + (number ? number : 1);
    return this.page = newPage;
  }

  connectedCallback() {
    this.render();
    
    
    this.updateButtonLabel();
    // Click event listener for "show more" button
    this.getElement("[data-list-button]").addEventListener("click", () => {
      this.addPage(1);
      const start = (this.page - 1) * BOOKS_PER_PAGE;
      const end = start + BOOKS_PER_PAGE;
      this.createBookPreviews(
        books.slice(start, end),
        this.getElement("[data-list-items]")
      );
      this.updateShowMoreButton();
    });

    // Click event listener for book previews
    this.getElement("[data-list-items]").addEventListener("click", (event) => {
      const pathArray = Array.from(event.composedPath());
      const active = pathArray.find((node) => node?.dataset?.preview);
      if (active) {
        const book = books.find((book) => book.id === active.dataset.preview);
        if (book) {
          this.getElement("[data-list-active]").open = true;
          this.getElement("[data-list-blur]").src = book.image;
          this.getElement("[data-list-image]").src = book.image;
          this.getElement("[data-list-title]").innerText = book.title;
          this.getElement("[data-list-subtitle]").innerText = `${
            authors[book.author]
          } (${new Date(book.published).getFullYear()})`;
          this.getElement("[data-list-description]").innerText = book.description;
        }
      }
    });

    // Close active book overlay
    this.getElement("[data-list-close]").addEventListener("click", () =>
      this.closeOverlay("[data-list-active]")
    );
  }

  render() {
    const { author, id, image, title } = this.dataset;
    const authorName = authors[author]; // Fetch the author's name using the ID

    const html = this.renderList();
    
    this.shadowRoot.innerHTML = `
      <style>
      /* preview */

      .preview {
        border-width: 0;
        width: 100%;
        font-family: Roboto, sans-serif;
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        cursor: pointer;
        text-align: left;
        border-radius: 8px;
        border: 1px solid rgba(var(--color-dark), 0.15);
        background: rgba(var(--color-light), 1);
      }
      
      @media (min-width: 60rem) {
        .preview {
          padding: 1rem;
        }
      }
      
      .preview_hidden {
        display: none;
      }
      
      .preview:hover {
        background: rgba(var(--color-blue), 0.05);
      }
      
      .preview__image {
        width: 48px;
        height: 70px;
        object-fit: cover;
        background: grey;
        border-radius: 2px;
        box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
          0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
      }
      
      .preview__info {
        padding: 1rem;
      }
      
      .preview__title {
        margin: 0 0 0.5rem;
        font-weight: bold;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        color: rgba(var(--color-dark), 0.8)
      }
      
      .preview__author {
        color: rgba(var(--color-dark), 0.4);
      }
      </style>
    `;

    this.shadowRoot.appendChild(html)

    return this.shadowroot;
  }

  renderList() {
    const fragment = document.createDocumentFragment();
    const listItems = document.createElement('div');
    listItems.setAttribute('data-list-items','')
    
    listItems.innerHTML = '';
  
    const startIdx = (this.page - 1) * BOOKS_PER_PAGE;
    const endIdx = startIdx + BOOKS_PER_PAGE;
  
    books.slice(startIdx, endIdx).forEach(({ id, title, author, image }) => {
        const element = document.createElement('button');
        element.classList.add('preview');
        element.setAttribute('data-preview', id);
  
        element.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;
        
        listItems.appendChild(element);
    });
    return listItems;
  }

  updateButtonLabel() {
    const remaining = Math.max(0, books.length - (this.page * BOOKS_PER_PAGE));
    const button = document.querySelector('[data-list-button]');

    button.innerText = `Show more (${remaining})`;
    button.disabled = remaining <= 0;
  }

  getElement(selector) {
    return this.shadowRoot.querySelector(selector) || document.querySelector(selector);
  }

  closeOverlay(selector){
    this.getElement(selector).open = false;
  };

  // Function to update "show more" button text & state
  updateShowMoreButton(){
    const remainingBooks = books.length - this.page * BOOKS_PER_PAGE;
    const button = this.getElement("[data-list-button]");
    button.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining">(${
        remainingBooks > 0 ? remainingBooks : 0
      })</span>
    `;
    button.disabled = remainingBooks <= 0;

    console.log(this.page)
  };

  createBookPreviews(books, container) {
    const fragment = document.createDocumentFragment();
    books.forEach((book) => {
      const preview = document.createElement("book-preview");
      preview.dataset.author = book.author;
      preview.dataset.id = book.id;
      preview.dataset.image = book.image;
      preview.dataset.title = book.title;
      fragment.appendChild(preview);
    });
    container.appendChild(fragment);
  };
}

customElements.define('book-preview', BookPreview);

