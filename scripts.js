

import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Define book object
class Book {
    constructor({ id, title, author, image, genres }) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.image = image;
        this.genres = genres;
    }
}

// Define book list object
class BookList {
    constructor() {
        this.page = 1;
        this.matches = books.map(bookData => new Book(bookData));
        this.render();
        this.addEventListeners();
        this.populateGenreList();
        this.populateAuthorList();
        this.setTheme();
        this.updateButtonLabel();
    }

    render() 
    {
        const fragment = document.createDocumentFragment();
        const listItems = document.querySelector('[data-list-items]');
        
        listItems.innerHTML = '';

        const startIdx = (this.page - 1) * BOOKS_PER_PAGE;
        const endIdx = startIdx + BOOKS_PER_PAGE;

        this.matches.slice(startIdx, endIdx).forEach(({ id, title, author, image }) => {
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
            
            fragment.appendChild(element);
        });

        listItems.appendChild(fragment);
        this.updateButtonLabel();
    }

    addEventListeners() {
        // Event listener for loading more books
        document.querySelector('[data-list-button]').addEventListener('click', () => {
            this.page++;
            this.render();
        });

        // Event listeners for UI elements
        document.querySelector('[data-search-cancel]').addEventListener('click', () => {
            document.querySelector('[data-search-overlay]').open = false;
        });

        document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
            document.querySelector('[data-settings-overlay]').open = false;
        });

        document.querySelector('[data-header-search]').addEventListener('click', () => {
            document.querySelector('[data-search-overlay]').open = true;
            document.querySelector('[data-search-title]').focus();
        });

        document.querySelector('[data-header-settings]').addEventListener('click', () => {
            document.querySelector('[data-settings-overlay]').open = true;
        });

        document.querySelector('[data-list-close]').addEventListener('click', () => {
            document.querySelector('[data-list-active]').open = false;
        });

        document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const { theme } = Object.fromEntries(formData);

            this.setTheme(theme);

            document.querySelector('[data-settings-overlay]').open = false;
        });


        document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const filters = Object.fromEntries(formData);
            const result = [];

            for (const book of books) {
                let genreMatch = filters.genre === 'any';

                for (const singleGenre of book.genres) {
                    if (genreMatch) break;
                    if (singleGenre === filters.genre) { genreMatch = true; }
                }

                if (
                    (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
                    (filters.author === 'any' || book.author === filters.author) && 
                    genreMatch
                ) {
                    result.push(book);
                }
            }

            this.page = 1;
            this.matches = result;

            if (result.length < 1) {
                document.querySelector('[data-list-message]').classList.add('list__message_show');
            } else {
                document.querySelector('[data-list-message]').classList.remove('list__message_show');
            }

            this.render();
            document.querySelector('[data-search-overlay]').open = false;
        });

        document.querySelector('[data-list-items]').addEventListener('click', (event) => {
            const pathArray = Array.from(event.path || event.composedPath());
            let active = null;

            for (const node of pathArray) {
                if (active) break;

                if (node?.dataset?.preview) {
                    let result = null;

                    for (const singleBook of books) {
                        if (result) break;
                        if (singleBook.id === node?.dataset?.preview) result = singleBook;
                    } 
                
                    active = result;
                }
            }
            
            if (active) {
                document.querySelector('[data-list-active]').open = true;
                document.querySelector('[data-list-blur]').src = active.image;
                document.querySelector('[data-list-image]').src = active.image;
                document.querySelector('[data-list-title]').innerText = active.title;
                document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
                document.querySelector('[data-list-description]').innerText = active.description;
            }
        });
    }

    populateGenreList() {
        const genreSelect = document.querySelector('[data-search-genres]');
        genreSelect.innerHTML = '';

        const anyOption = document.createElement('option');
        anyOption.value = 'any';
        anyOption.innerText = 'All Genres';
        genreSelect.appendChild(anyOption);

        for (const [id, name] of Object.entries(genres)) {
            const option = document.createElement('option');
            option.value = id;
            option.innerText = name;
            genreSelect.appendChild(option);
        }
    }

    populateAuthorList() {
        const authorSelect = document.querySelector('[data-search-authors]');
        authorSelect.innerHTML = '';
    
        const anyOption = document.createElement('option');
        anyOption.value = 'any';
        anyOption.innerText = 'All Authors';
        authorSelect.appendChild(anyOption);
    
        for (const [id, name] of Object.entries(authors)) {
            const option = document.createElement('option');
            option.value = id;
            option.innerText = name;
            authorSelect.appendChild(option);
        }
    }


    setTheme(themename) {
        const getTheme = themename !== undefined ? themename : localStorage.getItem('theme');
        
        let theme;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches || getTheme === 'night') {
            document.querySelector('[data-settings-theme]').value = 'night';
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
            theme = 'night';
        } else {
            document.querySelector('[data-settings-theme]').value = 'day';
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255')
            theme = 'day';
        }
        localStorage.setItem('theme', theme);
    }


    updateButtonLabel() {
        const remaining = Math.max(0, this.matches.length - (this.page * BOOKS_PER_PAGE));
        const button = document.querySelector('[data-list-button]');

        button.innerText = `Show more (${remaining})`;
        button.disabled = remaining <= 0;
    }
}

// Initialize book list
const bookList = new BookList();

