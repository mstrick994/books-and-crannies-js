// UI Helpers - Functions for rendering and managing user interface elements

import type {
  Book,
  PopulateGenreOptions,
  RenderBookCardOptions,
} from "./types.js";
import { getElementById } from "./dom-helpers.js";
import { loadCollection } from "./collection-helpers.js";
import { ORIGINAL_BOOKS_COUNT } from "./books-data.js";

export const updateCollectionCount = (
  collectionSet: Set<string> = loadCollection(),
): void => {
  const collectionSize = collectionSet.size;

  const desktopCounter = getElementById("myBooksCount");
  const mobileCounter = getElementById("myBooksCountMobile");

  if (desktopCounter) desktopCounter.textContent = String(collectionSize);
  if (mobileCounter) mobileCounter.textContent = String(collectionSize);
};

export const initializeSidebar = (): void => {
  const sidebar = getElementById("sidebar");
  const hamburgerMenuButton = getElementById("hamburgerMenu");
  const sidebarBackdrop = getElementById("sidebarBackdrop");

  // Exit function early if required elements don't exist on this page
  if (!sidebar || !hamburgerMenuButton || !sidebarBackdrop) return;

  // Open/close sidebar when hamburger button is clicked
  hamburgerMenuButton.addEventListener("click", () => {
    // Toggle classes
    const isOpen = sidebar.classList.toggle("is-open");
    sidebarBackdrop.classList.toggle("is-on");

    // Prevent body scrolling when sidebar is open
    document.body.style.overflow = isOpen ? "hidden" : "";

    // Update hamburger button appearance and accessibility
    hamburgerMenuButton.classList.toggle("is-active", isOpen);
    hamburgerMenuButton.setAttribute("aria-expanded", String(isOpen));
  });

  // Close sidebar when backdrop (dark overlay) is clicked
  sidebarBackdrop.addEventListener("click", () => {
    sidebar.classList.remove("is-open");
    sidebarBackdrop.classList.remove("is-on");
    document.body.style.overflow = "";
    hamburgerMenuButton.classList.remove("is-active");
    hamburgerMenuButton.setAttribute("aria-expanded", "false");
  });
};

export const initializeBrowseDropdown = (): void => {
  const dropdownButton = document.querySelector(".dropbtn");
  const dropdownMenu = getElementById("browseDropdown");

  if (!dropdownButton || !dropdownMenu) return;

  // Toggle dropdown visibility when button is clicked
  dropdownButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  // Close dropdown when clicking outside of it
  window.addEventListener("click", (event: MouseEvent) => {
    // Check if click was outside the dropdown container
    if (!(event.target as Element).closest(".browse-dropdown")) {
      dropdownMenu.classList.remove("show");
    }
  });
};

export const getUniqueGenres = (booksArray: Book[]): string[] => {
  // Map each book to its genre, then convert to Set (removes duplicates), then back to Array
  return [...new Set((booksArray || []).map((book) => book.genre))];
};

export const populateGenreFilters = ({
  genreList,
  desktopGenreList,
  mobileGenreList,
  includeAllOption = false,
}: PopulateGenreOptions): void => {
  if (!desktopGenreList || !mobileGenreList) return;

  const uniqueGenres = [...genreList];

  // Add "All" option first if requested
  if (includeAllOption) {
    uniqueGenres.unshift("All"); // Add "All" to beginning of array
  }

  // Add each genre to both desktop and mobile lists
  uniqueGenres.forEach((genre) => {
    // Create desktop genre link
    const desktopLi = document.createElement("li");
    const desktopLink = document.createElement("a");
    desktopLink.href = "#";
    desktopLink.textContent = genre;
    desktopLink.dataset.genre = genre;
    desktopLi.appendChild(desktopLink);
    desktopGenreList.appendChild(desktopLi);

    // Create mobile genre link
    const mobileLi = document.createElement("li");
    const mobileLink = document.createElement("a");
    mobileLink.href = "#";
    mobileLink.textContent = genre;
    mobileLink.dataset.genre = genre;
    mobileLi.appendChild(mobileLink);
    mobileGenreList.appendChild(mobileLi);
  });
};

export const renderBookCard = ({
  book,
  originalIndex,
  inCollection,
}: RenderBookCardOptions): string => {
  // Check if this is a newly added book (can be deleted/edited)
  const isNewBook = originalIndex >= ORIGINAL_BOOKS_COUNT;

  // Template literal creates the HTML structure as a string
  return `
    <div class="product-card" data-index="${originalIndex}">
      ${
        isNewBook
          ? `
      <!-- Edit/Delete Overlay -->
      <div class="card-overlay">
        <button class="overlay-btn edit-btn" data-book-index="${originalIndex}" title="Edit book" aria-label="Edit book">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="overlay-btn delete-btn" data-book-index="${originalIndex}" title="Delete book" aria-label="Delete book">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      `
          : ""
      }
      
      <!-- Cover / Flipbook Area -->
      <div class="card-cover">
        <div class="book">
          <div class="inner">
            <p>${book.description}</p>  
            <button class="read-btn">
              <a href="${book.link}" target="_blank" rel="noopener">Read Online</a>
            </button>
          </div>
          <div class="cover">
            ${
              book.best_seller
                ? `<span class="best-seller-tag">Best Seller</span>`
                : ""
            }
            ${book.trending ? `<span class="trending-tag">Trending</span>` : ""}
            <img src="${book.image}" alt="${book.title} cover" />
          </div>
        </div>
      </div>

      <!-- Info Area -->
      <div class="card-info">
        <h4 class="card-title">Title:</h4>
        <span class="title-value">${book.title}</span>
        <h4 class="card-author">Author:</h4>
        <span class="author-value">${book.author}</span>
        <h4 class="card-year">Year:</h4>
        <span class="genre-year">${book.year}</span>
        <h4 class="card-genre">Genre:</h4>
        <span class="genre-value">${book.genre}</span>
      </div>

      <!-- Add Button -->
      <button class="add-btn">
        ${inCollection ? "Remove from Collection" : "Add to Collection"}
      </button>
    </div>
  `;
};

export const initializeUI = (): void => {
  updateCollectionCount();
  initializeSidebar();
  initializeBrowseDropdown();
};

export const initializeStorageListener = (): void => {
  window.addEventListener("storage", (event: StorageEvent) => {
    if (event.key === "collection") {
      updateCollectionCount();
    }
  });
};
