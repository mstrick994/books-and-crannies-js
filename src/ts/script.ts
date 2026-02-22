// Home Page Script - Handles book browsing, filtering, and search

import type { Book, FilterState } from "./types.js";
import { books as originalBooks, GENRE_LIST } from "./books-data.js";
import {
  getElementById,
  querySelector,
  querySelectorAll,
} from "./dom-helpers.js";
import {
  loadCollection,
  saveCollection,
  toggleBookInCollection,
  loadCustomBooks,
  saveCustomBooks,
} from "./collection-helpers.js";
import {
  renderBookCard,
  updateCollectionCount,
  populateGenreFilters,
  initializeUI,
  initializeStorageListener,
  getUniqueGenres,
} from "./ui-helpers.js";

const productCardsContainer = getElementById("productCards");

// Merge original books with custom books from localStorage
const books = [...originalBooks, ...loadCustomBooks()];

// Only run if we're on the home page (has product cards container)
if (productCardsContainer) {
  // Navigation & Genre Filters
  const desktopGenreList = getElementById("bookGenres");
  const mobileGenreList = getElementById("mobileGenres");
  const browseDropdown = getElementById("browseDropdown");

  // Search Elements
  const desktopSearchForm = querySelector(".searchbar-input");
  const mobileSearchForm = querySelector(".sidebar-search-form");
  const desktopSearchInput = querySelector(
    ".search-input",
  ) as HTMLInputElement | null;
  const mobileSearchInput = querySelector(
    ".sidebar-search-input",
  ) as HTMLInputElement | null;
  const searchBySelect = getElementById("searchBy") as HTMLSelectElement | null;
  const mobileSearchBySelect = getElementById(
    "sidebarSearchBy",
  ) as HTMLSelectElement | null;

  // Add Book Modal Elements
  const addBookModal = getElementById("addBookModal");
  const closeModal = getElementById("closeModal");
  const cancelBtn = getElementById("cancelBtn");
  const bookGenreDropdown = getElementById(
    "bookGenre",
  ) as HTMLSelectElement | null;
  const customGenreInput = getElementById(
    "customGenre",
  ) as HTMLInputElement | null;
  const uploadRadio = getElementById("uploadImage") as HTMLInputElement | null;
  const browseRadio = getElementById("browseImage") as HTMLInputElement | null;
  const bookImageFile = getElementById("bookImage") as HTMLInputElement | null;
  const bookImageUrl = getElementById(
    "bookImageUrl",
  ) as HTMLInputElement | null;

  // Delete Confirmation Modal Elements
  const deleteConfirmModal = getElementById("deleteConfirmModal");
  const closeDeleteModal = getElementById("closeDeleteModal");
  const cancelDeleteBtn = getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = getElementById("confirmDeleteBtn");
  let bookIndexToDelete: number | null = null;

  // Edit mode tracking
  const modalTitle =
    document.querySelector<HTMLHeadingElement>(".add-book-modal h2");
  let editingBookIndex: number | null = null;

  // Initialize UI components (sidebar, dropdown, counter)
  initializeUI();
  initializeStorageListener();

  // Load user's current collection
  const collectionSet = loadCollection();
  updateCollectionCount(collectionSet);

  /**
   * Map to quickly find a book's original index by its title
   * This is crucial for the data-index attribute on cards, which must
   * reference the correct book in the master array even after filtering
   */
  const bookIndexByTitle = new Map(
    books.map((book, index) => [book.title, index]),
  );

  const filters: FilterState = {
    searchQuery: "",
    searchBy: "all",
    selectedGenre: null,
    selectedYear: null,
    showOnlyTrending: null,
  };

  const normalizeText = (text: string): string =>
    (text || "").toString().trim().toLowerCase();

  const matchesSearchFacet = (book: Book, searchQuery: string): boolean => {
    // If no search query, filter by best-sellers or trending if selected
    if (!searchQuery) {
      if (filters.searchBy === "best-sellers") return book.best_seller;
      if (filters.searchBy === "trending") return book.trending;
      return true;
    }

    // If searching for best-sellers only
    if (filters.searchBy === "best-sellers") {
      return (
        book.best_seller &&
        `${book.title} ${book.author} ${book.genre}`
          .toLowerCase()
          .includes(searchQuery)
      );
    }

    // If searching for trending only
    if (filters.searchBy === "trending") {
      return (
        book.trending &&
        `${book.title} ${book.author} ${book.genre}`
          .toLowerCase()
          .includes(searchQuery)
      );
    }

    // Search by specific field
    if (filters.searchBy === "title") {
      return book.title.toLowerCase().includes(searchQuery);
    }
    if (filters.searchBy === "author") {
      return book.author.toLowerCase().includes(searchQuery);
    }

    // Search across all fields (title, author, genre)
    return `${book.title} ${book.author} ${book.genre}`
      .toLowerCase()
      .includes(searchQuery);
  };

  const applyAllFilters = (): void => {
    const searchQuery = normalizeText(filters.searchQuery);

    // Chain filter operations (each filter narrows down the results)
    const filteredBooks = books
      .filter((book) => matchesSearchFacet(book, searchQuery))
      .filter(
        (book) =>
          !filters.selectedGenre || book.genre === filters.selectedGenre,
      )
      .filter(
        (book) =>
          filters.selectedYear == null || book.year === filters.selectedYear,
      )
      .filter(
        (book) =>
          filters.showOnlyTrending == null ||
          book.trending === filters.showOnlyTrending,
      );

    // Show message if no books match
    if (filteredBooks.length === 0) {
      productCardsContainer.innerHTML = "<p>No books found.</p>";
      return;
    }

    renderBooks(filteredBooks);
  };

  /**
   * Populate the genre filter lists in both desktop dropdown and mobile sidebar
   */
  populateGenreFilters({
    genreList: GENRE_LIST,
    desktopGenreList: desktopGenreList,
    mobileGenreList: mobileGenreList,
    includeAllOption: true,
  });

  const handleGenreClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    // Only handle link clicks, not other elements
    if (target.tagName !== "A") return;

    // Skip the "My Books" link (handled separately)
    if (target.classList.contains("my-books-btn")) return;

    event.preventDefault();

    const selectedGenre =
      (target as HTMLAnchorElement).dataset.genre || target.textContent;
    filters.selectedGenre = selectedGenre === "All" ? null : selectedGenre;
    applyAllFilters();

    // Close dropdown after selection
    browseDropdown?.classList.remove("show");
  };

  // Attach genre click handlers to both lists
  desktopGenreList?.addEventListener(
    "click",
    handleGenreClick as EventListener,
  );
  mobileGenreList?.addEventListener("click", handleGenreClick as EventListener);

  const renderBooks = (booksToRender: Book[]): void => {
    const currentCollection = loadCollection();

    // Add Book button HTML
    const addBookButtonHtml = `<button class="add-book">Add Book</button>`;

    // Map each book to its HTML string, then join them all together
    const bookCardsHtml = booksToRender
      .map((book) => {
        const originalIndex = bookIndexByTitle.get(book.title);
        return renderBookCard({
          book,
          originalIndex: originalIndex!,
          inCollection: currentCollection.has(book.title),
        });
      })
      .join("");

    // Prepend the Add Book button before all book cards
    productCardsContainer.innerHTML = addBookButtonHtml + bookCardsHtml;
  };

  // Initial render - show all books
  renderBooks(books);

  if (desktopSearchForm && desktopSearchInput) {
    // Handle search submission
    desktopSearchForm.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      filters.searchQuery = desktopSearchInput.value;
      applyAllFilters();
    });

    // Clear search results immediately when user clears the search box
    desktopSearchInput.addEventListener("input", () => {
      if (
        desktopSearchInput.value.trim() === "" &&
        filters.searchQuery !== ""
      ) {
        filters.searchQuery = "";
        applyAllFilters();
      }
    });

    // Escape key clears search and shows all results
    desktopSearchInput.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      desktopSearchInput.value = "";
      filters.searchQuery = "";
      applyAllFilters();
    });
  }

  if (mobileSearchForm && mobileSearchInput) {
    mobileSearchForm.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      filters.searchQuery = mobileSearchInput.value;
      applyAllFilters();
    });

    mobileSearchInput.addEventListener("input", () => {
      if (mobileSearchInput.value.trim() === "" && filters.searchQuery !== "") {
        filters.searchQuery = "";
        applyAllFilters();
      }
    });

    mobileSearchInput.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      mobileSearchInput.value = "";
      filters.searchQuery = "";
      applyAllFilters();
    });
  }

  if (searchBySelect) {
    searchBySelect.addEventListener("change", (event: Event) => {
      filters.searchBy = (event.target as HTMLSelectElement).value;
      applyAllFilters();
    });
  }

  if (mobileSearchBySelect) {
    mobileSearchBySelect.addEventListener("change", (event: Event) => {
      filters.searchBy = (event.target as HTMLSelectElement).value;
      applyAllFilters();
    });
  }

  productCardsContainer.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    // Only respond to clicks on the add/remove button
    if (!target.classList.contains("add-btn")) return;

    // Find the parent card and get its data-index attribute
    const card = target.closest(".product-card") as HTMLElement;
    const bookIndex = Number(card?.dataset?.index);

    // Validate the index is a valid number
    if (!Number.isFinite(bookIndex)) return;

    // Get the book from the master array
    const book = books[bookIndex];
    if (!book) return;

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
  });

  // Mobile: Toggle book flip on click
  productCardsContainer.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Find if we clicked on a book element
    const bookElement = target.closest(".book") as HTMLElement;

    // If clicked on edit/delete buttons or add-to-collection, don't flip
    if (
      target.closest(".card-overlay") ||
      target.classList.contains("add-btn")
    ) {
      return;
    }

    // Toggle the flipped class on mobile
    if (bookElement) {
      bookElement.classList.toggle("flipped");
    }
  });

  // Add a new book modal window
  productCardsContainer.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    // Check if clicked element is the Add Book button
    if (!target.classList.contains("add-book")) return;
    // Get the modal element
    const modal = getElementById("addBookModal");
    if (!modal) return;

    // Reset edit mode
    editingBookIndex = null;
    if (modalTitle) modalTitle.textContent = "Add New Book";
    const submitBtn = document.querySelector<HTMLButtonElement>(".btn-submit");
    if (submitBtn) submitBtn.textContent = "Add Book";

    // Show the modal (remove hidden class)
    modal.classList.remove("hidden");
  });

  // Modal Image Radio Buttons
  browseRadio?.addEventListener("change", () => {
    bookImageFile?.classList.add("hidden");
    bookImageFile?.removeAttribute("required");
    bookImageUrl?.classList.remove("hidden");
    bookImageUrl?.setAttribute("required", "");
  });

  uploadRadio?.addEventListener("change", () => {
    bookImageUrl?.classList.add("hidden");
    bookImageUrl?.removeAttribute("required");
    bookImageFile?.classList.remove("hidden");
    bookImageFile?.setAttribute("required", "");
  });

  // Cancel or close out of Add Book Modal
  closeModal?.addEventListener("click", () => {
    addBookModal?.classList.add("hidden");
    editingBookIndex = null;
    if (modalTitle) modalTitle.textContent = "Add a New Book";
    const submitBtn = document.querySelector<HTMLButtonElement>(".btn-submit");
    if (submitBtn) submitBtn.textContent = "Add Book";
  });

  cancelBtn?.addEventListener("click", () => {
    addBookModal?.classList.add("hidden");
    editingBookIndex = null;
    if (modalTitle) modalTitle.textContent = "Add a New Book";
    const submitBtn = document.querySelector<HTMLButtonElement>(".btn-submit");
    if (submitBtn) submitBtn.textContent = "Add Book";
  });

  // Mobile sidebar "Add a Book" button
  const mobileAddBookBtn = getElementById("mobileAddBookBtn");
  mobileAddBookBtn?.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    // Close mobile sidebar
    const sidebar = getElementById("sidebar");
    const backdrop = querySelector(".sidebar-backdrop");
    const hamburgerMenu = getElementById("hamburgerMenu");
    sidebar?.classList.remove("is-open");
    backdrop?.classList.remove("is-on");
    document.body.style.overflow = "";
    hamburgerMenu?.classList.remove("is-active");
    hamburgerMenu?.setAttribute("aria-expanded", "false");
    // Open add book modal
    addBookModal?.classList.remove("hidden");
  });

  // Populate genre dropdown with standard genres + "Other" option
  GENRE_LIST.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    bookGenreDropdown?.appendChild(option);
  });

  // Add "Other" option at the end
  const otherOption = document.createElement("option");
  otherOption.value = "Other";
  otherOption.textContent = "Other";
  bookGenreDropdown?.appendChild(otherOption);

  // Toggle custom genre input when "Other" is selected
  bookGenreDropdown?.addEventListener("change", () => {
    if (bookGenreDropdown.value === "Other") {
      customGenreInput?.classList.remove("hidden");
      customGenreInput?.setAttribute("required", "");
      bookGenreDropdown.removeAttribute("required");
    } else {
      customGenreInput?.classList.add("hidden");
      customGenreInput?.removeAttribute("required");
      bookGenreDropdown.setAttribute("required", "");
    }
  });

  // Browse or upload image

  const readImageFile = async (
    fileInput: HTMLInputElement | null,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const file = fileInput?.files?.[0];
      if (!file) {
        reject("No file selected");
        return;
      }
      const reader = new FileReader();

      //  When reading succeeds
      reader.onload = () => {
        resolve(reader.result as string);
      };

      //  When reading fails
      reader.onerror = () => {
        reject("Error reading file"); // FAIL - reading error
      };

      //  Start reading
      reader.readAsDataURL(file);
    });
  };

  // Form submission

  const addBookForm = document.getElementById("addBookForm");
  addBookForm?.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    console.log("Form submitted!"); // DEBUG

    // Get form field values
    const titleInput = getElementById("bookTitle") as HTMLInputElement;
    const authorInput = getElementById("bookAuthor") as HTMLInputElement;
    const genreSelect = getElementById("bookGenre") as HTMLSelectElement;
    const yearInput = getElementById("bookYear") as HTMLInputElement;
    const descriptionInput = getElementById(
      "bookDescription",
    ) as HTMLTextAreaElement;
    const bestSellerCheckbox = getElementById(
      "bookBestSeller",
    ) as HTMLInputElement;
    const trendingCheckbox = getElementById("bookTrending") as HTMLInputElement;
    const linkInput = getElementById("bookLink") as HTMLInputElement;

    const title = titleInput?.value || "";
    const author = authorInput?.value || "";
    const year = Number(yearInput?.value || "0000");
    const description = descriptionInput?.value || "";
    const bestSeller = bestSellerCheckbox?.checked || false;
    const trending = trendingCheckbox?.checked || false;
    const link = linkInput?.value || "";

    // Handle genre (use custom if "Other" selected)
    let genre = genreSelect?.value || "";
    if (genre === "Other") {
      genre = customGenreInput?.value || "";
    }

    // Handle image (upload or URL)
    let image = "";
    if (uploadRadio?.checked) {
      image = await readImageFile(bookImageFile);
    } else {
      image = bookImageUrl?.value || "";
    }

    // Create new book object
    const newBook: Book = {
      title: title,
      author: author,
      genre: genre,
      year: year,
      best_seller: bestSeller,
      trending: trending,
      description: description,
      image: image,
      link: link,
    };

    // Check if we're editing or adding a new book
    if (editingBookIndex !== null) {
      // EDIT MODE: Update existing book
      const oldTitle = books[editingBookIndex].title;
      books[editingBookIndex] = newBook;

      // Update the Map if title changed
      if (oldTitle !== newBook.title) {
        bookIndexByTitle.delete(oldTitle);
        bookIndexByTitle.set(newBook.title, editingBookIndex);
      }

      // Update collection if the old title was in it
      const currentCollection = loadCollection();
      if (currentCollection.has(oldTitle) && oldTitle !== newBook.title) {
        currentCollection.delete(oldTitle);
        currentCollection.add(newBook.title);
        saveCollection(currentCollection);
      }

      // Reset edit mode
      editingBookIndex = null;
      if (modalTitle) modalTitle.textContent = "Add New Book";
    } else {
      // ADD MODE: Add new book
      books.push(newBook);
      bookIndexByTitle.set(newBook.title, books.length - 1);
    }

    // Save custom books to localStorage (only the new ones, not originals)
    const customBooks = books.slice(originalBooks.length);
    saveCustomBooks(customBooks);

    // Re-render to show new book
    renderBooks(books);

    // Close modal and reset form
    addBookModal?.classList.add("hidden");
    (event.target as HTMLFormElement).reset();
    editingBookIndex = null;
    if (modalTitle) modalTitle.textContent = "Add a New Book";
    const submitBtn = document.querySelector<HTMLButtonElement>(".btn-submit");
    if (submitBtn) submitBtn.textContent = "Add Book";
    customGenreInput?.classList.add("hidden");
    customGenreInput?.removeAttribute("required");
    bookGenreDropdown?.setAttribute("required", "");
  });

  // Edit book functionality - handle click on edit button
  productCardsContainer.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Check if clicked element is the edit button
    if (target.classList.contains("edit-btn") || target.closest(".edit-btn")) {
      const button = target.closest(".edit-btn") as HTMLElement;
      if (!button) return;
      const bookIndex = Number(button.dataset.bookIndex);
      const book = books[bookIndex];

      // Set edit mode
      editingBookIndex = bookIndex;
      if (modalTitle) modalTitle.textContent = "Edit Book";
      const submitBtn = document.querySelector<HTMLButtonElement>(".btn-submit");
      if (submitBtn) submitBtn.textContent = "Save Changes";

      // Get form elements
      const titleInput = getElementById("bookTitle") as HTMLInputElement;
      const authorInput = getElementById("bookAuthor") as HTMLInputElement;
      const yearInput = getElementById("bookYear") as HTMLInputElement;
      const descriptionInput = getElementById(
        "bookDescription",
      ) as HTMLTextAreaElement;
      const linkInput = getElementById("bookLink") as HTMLInputElement;
      const genreSelect = getElementById("bookGenre") as HTMLSelectElement;
      const bestSellerCheckbox = getElementById(
        "bookBestSeller",
      ) as HTMLInputElement;
      const trendingCheckbox = getElementById(
        "bookTrending",
      ) as HTMLInputElement;
      const imageUrlInput = getElementById("bookImageUrl") as HTMLInputElement;
      const customGenreField = getElementById(
        "customGenre",
      ) as HTMLInputElement;
      const customGenreGroup = getElementById("customGenreContainer");

      // Populate form with book data
      if (titleInput) titleInput.value = book.title;
      if (authorInput) authorInput.value = book.author;
      if (yearInput) yearInput.value = book.year.toString();
      if (descriptionInput) descriptionInput.value = book.description;
      if (linkInput) linkInput.value = book.link;

      // Handle genre
      if (genreSelect) {
        const genreArray = Array.from(GENRE_LIST);
        if (genreArray.indexOf(book.genre) !== -1) {
          genreSelect.value = book.genre;
          customGenreGroup?.classList.add("hidden");
        } else {
          genreSelect.value = "Other";
          customGenreGroup?.classList.remove("hidden");
          if (customGenreField) customGenreField.value = book.genre;
        }
      }

      // Handle checkboxes
      if (bestSellerCheckbox) bestSellerCheckbox.checked = book.best_seller;
      if (trendingCheckbox) trendingCheckbox.checked = book.trending;

      // Set image URL (we'll use URL input for existing images)
      if (imageUrlInput) imageUrlInput.value = book.image;
      if (browseRadio) browseRadio.checked = true;
      if (uploadRadio) uploadRadio.checked = false;
      bookImageUrl?.classList.remove("hidden");
      bookImageFile?.classList.add("hidden");
      bookImageUrl?.setAttribute("required", "");
      bookImageFile?.removeAttribute("required");

      // Show modal
      addBookModal?.classList.remove("hidden");
      return;
    }

    // Check if clicked element is the delete button
    if (
      target.classList.contains("delete-btn") ||
      target.closest(".delete-btn")
    ) {
      const button = target.closest(".delete-btn") as HTMLElement;
      if (!button) return;
      const bookIndex = Number(button.dataset.bookIndex);
      bookIndexToDelete = bookIndex;
      deleteConfirmModal?.classList.remove("hidden");
      return;
    }
  });

  // Close delete modal
  closeDeleteModal?.addEventListener("click", () => {
    deleteConfirmModal?.classList.add("hidden");
    bookIndexToDelete = null;
  });

  // Cancel delete
  cancelDeleteBtn?.addEventListener("click", () => {
    deleteConfirmModal?.classList.add("hidden");
    bookIndexToDelete = null;
  });

  // Confirm delete
  confirmDeleteBtn?.addEventListener("click", () => {
    if (bookIndexToDelete === null) return;

    const bookToDelete = books[bookIndexToDelete];

    // Remove from books array
    books.splice(bookIndexToDelete, 1);

    // Rebuild the bookIndexByTitle Map
    bookIndexByTitle.clear();
    books.forEach((book, index) => {
      bookIndexByTitle.set(book.title, index);
    });

    // Save updated custom books to localStorage
    const customBooks = books.slice(originalBooks.length);
    saveCustomBooks(customBooks);

    // Remove from collection if it was there
    const collectionSet = loadCollection();
    if (collectionSet.has(bookToDelete.title)) {
      const toggleResult = toggleBookInCollection(bookToDelete.title);
      // Update the collection counter badge
      updateCollectionCount(toggleResult.collectionSet);
    }

    // Re-render books
    renderBooks(books);

    // Close modal
    deleteConfirmModal?.classList.add("hidden");
    bookIndexToDelete = null;
  });

  /**
   * Handle search queries from URL (e.g., redirected from login page)
   * URL format: index.html?q=search+term
   */
  const urlParams = new URLSearchParams(window.location.search);
  const queryFromUrl = urlParams.get("q");

  if (queryFromUrl) {
    // Pre-fill search box with query from URL
    desktopSearchInput && (desktopSearchInput.value = queryFromUrl);
    filters.searchQuery = queryFromUrl;
    applyAllFilters();
  }
}
