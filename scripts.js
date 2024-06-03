// Importing data and constants from external module
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

// Importing functions and custom elements from other files
import {
  getElement,
  createBookPreviews,
  createOptions,
  applyTheme,
} from "./functions.js";
import "./book-preview.js";
import "./search-filter.js";
import "./theme-toggler.js";
import "./header-component.js";

// Initialize page number and matches array
let page = 1;
let matches = books;

// Initial rendering of book previews
createBookPreviews(
  matches.slice(0, BOOKS_PER_PAGE),
  getElement("[data-list-items]")
);

// Populate genre and author dropdowns
createOptions(genres, "All Genres", getElement("[data-search-genres]"));
createOptions(authors, "All Authors", getElement("[data-search-authors]"));

// Apply theme based on user's preferred color scheme
applyTheme(
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day"
);

// Function to update "show more" button text & state
const updateShowMoreButton = () => {
  const remainingBooks = matches.length - page * BOOKS_PER_PAGE;
  const button = getElement("[data-list-button]");
  button.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining">(${
      remainingBooks > 0 ? remainingBooks : 0
    })</span>
  `;
  button.disabled = remainingBooks <= 0;
};

// Update "Show more" button initially
updateShowMoreButton();

// Function to close overlay
const closeOverlay = (selector) => {
  getElement(selector).open = false;
};

// Function to open overlay
const openOverlay = (selector, focusSelector = null) => {
  getElement(selector).open = true;
  if (focusSelector) getElement(focusSelector).focus();
};

// Function to apply search filters to book data
const applySearchFilters = (filters) => {
  return books.filter((book) => {
    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;
    const genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);
    return titleMatch && authorMatch && genreMatch;
  });
};

// Event listeners

// Close search overlay
getElement("[data-search-cancel]").addEventListener("click", () =>
  closeOverlay("[data-search-overlay]")
);

// Close settings overlay
getElement("[data-settings-cancel]").addEventListener("click", () =>
  closeOverlay("[data-settings-overlay]")
);

// Open search overlay
getElement("[data-header-search]").addEventListener("click", () =>
  openOverlay("[data-search-overlay]", "[data-search-title]")
);

// Open settings overlay
getElement("[data-header-settings]").addEventListener("click", () =>
  openOverlay("[data-settings-overlay]")
);

// Close active book overlay
getElement("[data-list-close]").addEventListener("click", () =>
  closeOverlay("[data-list-active]")
);

// Submit event listener for settings form
getElement("[data-settings-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);
  applyTheme(theme);
  closeOverlay("[data-settings-overlay]");
});

// Submit event listener for search form
getElement("[data-search-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  matches = applySearchFilters(filters);
  page = 1;
  getElement("[data-list-message]").classList.toggle(
    "list__message_show",
    matches.length < 1
  );
  getElement("[data-list-items]").innerHTML = "";
  createBookPreviews(
    matches.slice(0, BOOKS_PER_PAGE),
    getElement("[data-list-items]")
  );
  updateShowMoreButton();
  window.scrollTo({ top: 0, behavior: "smooth" });
  closeOverlay("[data-search-overlay]");
});

// Click event listener for "show more" button
getElement("[data-list-button]").addEventListener("click", () => {
  page++;
  const start = (page - 1) * BOOKS_PER_PAGE;
  const end = start + BOOKS_PER_PAGE;
  createBookPreviews(
    matches.slice(start, end),
    getElement("[data-list-items]")
  );
  updateShowMoreButton();
});

// Click event listener for book previews
getElement("[data-list-items]").addEventListener("click", (event) => {
  const pathArray = Array.from(event.composedPath());
  const active = pathArray.find((node) => node?.dataset?.preview);
  if (active) {
    const book = books.find((book) => book.id === active.dataset.preview);
    if (book) {
      getElement("[data-list-active]").open = true;
      getElement("[data-list-blur]").src = book.image;
      getElement("[data-list-image]").src = book.image;
      getElement("[data-list-title]").innerText = book.title;
      getElement("[data-list-subtitle]").innerText = `${
        authors[book.author]
      } (${new Date(book.published).getFullYear()})`;
      getElement("[data-list-description]").innerText = book.description;
    }
  }
});