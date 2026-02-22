// My List Page Script - Displays and manages user's saved book collection
import { books as originalBooks, GENRE_LIST } from "./books-data.js";
import { getElementById, querySelector } from "./dom-helpers.js";
import { loadCollection, toggleBookInCollection, loadCustomBooks, } from "./collection-helpers.js";
import { renderBookCard, updateCollectionCount, populateGenreFilters, initializeUI, initializeStorageListener, } from "./ui-helpers.js";
document.addEventListener("DOMContentLoaded", () => {
    // Merge original books with custom books from localStorage
    const allBooks = [...originalBooks, ...loadCustomBooks()];
    // Get references to page elements
    const myBooksContainer = getElementById("myBooks");
    const emptyMessage = getElementById("emptyMessage");
    // If we're not on the My List page, exit early
    if (!myBooksContainer)
        return;
    // Initialize UI components (sidebar, dropdown, counter)
    initializeUI();
    initializeStorageListener();
    // Get references to sidebar elements (for closing after genre selection)
    const sidebar = getElementById("sidebar");
    const hamburgerMenuButton = getElementById("hamburgerMenu");
    const sidebarBackdrop = getElementById("sidebarBackdrop");
    // Load user's current collection
    const collectionSet = loadCollection();
    updateCollectionCount(collectionSet);
    /**
     * Map to quickly find a book's original index by its title
     */
    const bookIndexByTitle = new Map(allBooks.map((book, index) => [book.title, index]));
    // Get references to genre filter elements
    const browseDropdown = getElementById("browseDropdown");
    const desktopGenreList = getElementById("bookGenres");
    const mobileGenreList = getElementById("mobileGenres");
    // Get references to search elements
    const desktopSearchForm = querySelector(".searchbar-input");
    const desktopSearchInput = desktopSearchForm === null || desktopSearchForm === void 0 ? void 0 : desktopSearchForm.querySelector(".search-input");
    const mobileSearchForm = querySelector(".sidebar-search-form");
    const mobileSearchInput = querySelector(".sidebar-search-input");
    /**
     * Populate genre filter lists in both desktop dropdown and mobile sidebar
     */
    populateGenreFilters({
        genreList: GENRE_LIST,
        desktopGenreList: desktopGenreList,
        mobileGenreList: mobileGenreList,
        includeAllOption: true,
    });
    const renderMyBooks = (booksToRender) => {
        // Show empty state message if no books
        if (!booksToRender || booksToRender.length === 0) {
            if (emptyMessage)
                emptyMessage.style.display = "block";
            myBooksContainer.innerHTML = "";
            return;
        }
        // Hide empty message and render books
        if (emptyMessage)
            emptyMessage.style.display = "none";
        const currentCollection = loadCollection();
        myBooksContainer.innerHTML = booksToRender
            .map((book) => {
            const originalIndex = bookIndexByTitle.get(book.title);
            return renderBookCard({
                book,
                originalIndex: originalIndex,
                inCollection: currentCollection.has(book.title),
            });
        })
            .join("");
    };
    const handleGenreClick = (event) => {
        const target = event.target;
        // Only handle link clicks
        if (target.tagName !== "A")
            return;
        event.preventDefault();
        const selectedGenre = target.dataset.genre || target.textContent;
        // Get current saved books
        const currentCollection = loadCollection();
        const savedBooks = allBooks.filter((book) => currentCollection.has(book.title));
        // Filter by genre (or show all if "All" selected)
        const filteredResults = selectedGenre === "All"
            ? savedBooks
            : savedBooks.filter((book) => book.genre === selectedGenre);
        renderMyBooks(filteredResults);
        // Close desktop dropdown
        if (browseDropdown)
            browseDropdown.classList.remove("show");
        // Close mobile sidebar if open
        if (sidebar && sidebar.classList.contains("is-open")) {
            sidebar.classList.remove("is-open");
            if (sidebarBackdrop)
                sidebarBackdrop.classList.remove("is-on");
            if (hamburgerMenuButton) {
                hamburgerMenuButton.classList.remove("is-active");
                hamburgerMenuButton.setAttribute("aria-expanded", "false");
            }
            document.body.style.overflow = "";
        }
    };
    // Initial render - show all saved books
    const initialMyBooks = allBooks.filter((book) => collectionSet.has(book.title));
    renderMyBooks(initialMyBooks);
    myBooksContainer.addEventListener("click", (event) => {
        var _a;
        const target = event.target;
        // Mobile: Toggle book flip on click (anywhere on card except buttons)
        const bookElement = target.closest(".book");
        // If clicked on edit/delete buttons or add-to-collection, don't flip
        if (target.closest(".card-overlay") ||
            target.classList.contains("add-btn")) {
            // If clicking buttons, do nothing and let other handlers deal with it
            if (!target.classList.contains("add-btn"))
                return;
        }
        else if (bookElement) {
            // Toggle flip for card clicks (not on buttons)
            bookElement.classList.toggle("flipped");
            return; // Don't process add-btn logic
        }
        // Only respond to clicks on the add/remove button
        if (!target.classList.contains("add-btn"))
            return;
        // Find the parent card and get its data-index attribute
        const card = target.closest(".product-card");
        const bookIndex = Number((_a = card === null || card === void 0 ? void 0 : card.dataset) === null || _a === void 0 ? void 0 : _a.index);
        // Validate the index is a valid number
        if (!Number.isFinite(bookIndex))
            return;
        // Get the book from the master array
        const book = allBooks[bookIndex];
        if (!book)
            return;
        // Toggle the book in/out of collection
        const toggleResult = toggleBookInCollection(book.title);
        const isInCollectionNow = toggleResult.inCollection;
        const updatedCollectionSet = toggleResult.collectionSet;
        // Update button text immediately
        target.textContent = isInCollectionNow
            ? "Remove from Collection"
            : "Add to Collection";
        // Update the collection counter badge
        updateCollectionCount(updatedCollectionSet);
        // Refresh the list so removed books disappear immediately
        const updatedBooks = allBooks.filter((book) => updatedCollectionSet.has(book.title));
        renderMyBooks(updatedBooks);
    });
    // Attach genre click handlers to both lists
    if (desktopGenreList) {
        desktopGenreList.addEventListener("click", handleGenreClick);
    }
    if (mobileGenreList) {
        mobileGenreList.addEventListener("click", handleGenreClick);
    }
    const filterMyBooks = (searchQuery) => {
        const normalizedQuery = (searchQuery || "").trim().toLowerCase();
        const currentCollection = loadCollection();
        const myBooks = allBooks.filter((book) => currentCollection.has(book.title));
        // If no query, show all saved books; otherwise filter
        const filteredBooks = !normalizedQuery
            ? myBooks
            : myBooks.filter((book) => `${book.title} ${book.author} ${book.genre}`
                .toLowerCase()
                .includes(normalizedQuery));
        renderMyBooks(filteredBooks);
    };
    if (desktopSearchForm && desktopSearchInput) {
        desktopSearchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            filterMyBooks(desktopSearchInput.value);
        });
    }
    if (mobileSearchForm && mobileSearchInput) {
        mobileSearchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            filterMyBooks(mobileSearchInput.value);
        });
    }
});
