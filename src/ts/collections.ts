// My List Page Script - Displays and manages user's saved book collection

import type { Book } from "./types.js";
import { books as originalBooks, GENRE_LIST } from "./books-data.js";
import { getElementById, querySelector } from "./dom-helpers.js";
import {
  loadCollection,
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
} from "./ui-helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  // Merge original books with custom books from localStorage
  const allBooks = [...originalBooks, ...loadCustomBooks()];

  // Get references to page elements
  const myBooksContainer = getElementById("myBooks");
  const emptyMessage = getElementById("emptyMessage");

  // Modal references
  const addBookModal = getElementById("addBookModal");
  const closeModalBtn = getElementById("closeModal");
  const cancelBtn = getElementById("cancelBtn");
  const deleteConfirmModal = getElementById("deleteConfirmModal");
  const closeDeleteModal = getElementById("closeDeleteModal");
  const cancelDeleteBtn = getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = getElementById("confirmDeleteBtn");
  const modalTitle = document.querySelector<HTMLHeadingElement>(".modal-title");
  const bookGenreDropdown = getElementById(
    "bookGenre",
  ) as HTMLSelectElement | null;
  const customGenreInput = getElementById(
    "customGenre",
  ) as HTMLInputElement | null;
  const bookImageFile = getElementById("bookImage") as HTMLInputElement | null;
  const bookImageUrl = getElementById(
    "bookImageUrl",
  ) as HTMLInputElement | null;
  const uploadRadio = getElementById("uploadImage") as HTMLInputElement | null;
  const browseRadio = getElementById("browseImage") as HTMLInputElement | null;

  let editingBookIndex: number | null = null;
  let bookIndexToDelete: number | null = null;

  // If we're not on the My List page, exit early
  if (!myBooksContainer) return;

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
  const bookIndexByTitle = new Map(
    allBooks.map((book, index) => [book.title, index]),
  );

  // Get references to genre filter elements
  const browseDropdown = getElementById("browseDropdown");
  const desktopGenreList = getElementById("bookGenres");
  const mobileGenreList = getElementById("mobileGenres");

  // Get references to search elements
  const desktopSearchForm = querySelector(".searchbar-input");
  const desktopSearchInput = desktopSearchForm?.querySelector(
    ".search-input",
  ) as HTMLInputElement | null;
  const mobileSearchForm = querySelector(".sidebar-search-form");
  const mobileSearchInput = querySelector(
    ".sidebar-search-input",
  ) as HTMLInputElement | null;

  /**
   * Populate genre filter lists in both desktop dropdown and mobile sidebar
   */
  populateGenreFilters({
    genreList: GENRE_LIST,
    desktopGenreList: desktopGenreList,
    mobileGenreList: mobileGenreList,
    includeAllOption: true,
  });

  const renderMyBooks = (booksToRender: Book[]): void => {
    // Show empty state message if no books
    if (!booksToRender || booksToRender.length === 0) {
      if (emptyMessage) emptyMessage.style.display = "block";
      myBooksContainer.innerHTML = "";
      return;
    }

    // Hide empty message and render books
    if (emptyMessage) emptyMessage.style.display = "none";
    const currentCollection = loadCollection();

    myBooksContainer.innerHTML = booksToRender
      .map((book) => {
        const originalIndex = bookIndexByTitle.get(book.title);
        return renderBookCard({
          book,
          originalIndex: originalIndex!,
          inCollection: currentCollection.has(book.title),
        });
      })
      .join("");
  };

  const handleGenreClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    // Only handle link clicks
    if (target.tagName !== "A") return;
    event.preventDefault();

    const selectedGenre =
      (target as HTMLAnchorElement).dataset.genre || target.textContent;

    // Get current saved books
    const currentCollection = loadCollection();
    const savedBooks = allBooks.filter((book) =>
      currentCollection.has(book.title),
    );

    // Filter by genre (or show all if "All" selected)
    const filteredResults =
      selectedGenre === "All"
        ? savedBooks
        : savedBooks.filter((book) => book.genre === selectedGenre);

    renderMyBooks(filteredResults);

    // Close desktop dropdown
    if (browseDropdown) browseDropdown.classList.remove("show");

    // Close mobile sidebar if open
    if (sidebar && sidebar.classList.contains("is-open")) {
      sidebar.classList.remove("is-open");
      if (sidebarBackdrop) sidebarBackdrop.classList.remove("is-on");
      if (hamburgerMenuButton) {
        hamburgerMenuButton.classList.remove("is-active");
        hamburgerMenuButton.setAttribute("aria-expanded", "false");
      }
      document.body.style.overflow = "";
    }
  };

  // Initial render - show all saved books
  const initialMyBooks = allBooks.filter((book) =>
    collectionSet.has(book.title),
  );
  renderMyBooks(initialMyBooks);

  myBooksContainer.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Mobile: Toggle book flip on click (anywhere on card except buttons)
    const bookElement = target.closest(".book") as HTMLElement;

    // Handle edit button
    if (target.classList.contains("edit-btn") || target.closest(".edit-btn")) {
      const button = target.closest(".edit-btn") as HTMLElement;
      if (!button) return;
      const bookIndex = Number(button.dataset.bookIndex);
      const book = allBooks[bookIndex];

      editingBookIndex = bookIndex;
      if (modalTitle) modalTitle.textContent = "Edit Book";
      const submitBtn =
        document.querySelector<HTMLButtonElement>(".btn-submit");
      if (submitBtn) submitBtn.textContent = "Save Changes";

      const titleInput = getElementById("bookTitle") as HTMLInputElement;
      const authorInput = getElementById("bookAuthor") as HTMLInputElement;
      const yearInput = getElementById("bookYear") as HTMLInputElement;
      const descriptionInput = getElementById(
        "bookDescription",
      ) as HTMLTextAreaElement;
      const linkInput = getElementById("bookLink") as HTMLInputElement;
      const customGenreGroup = getElementById("customGenreContainer");
      const bestSellerCheckbox = getElementById(
        "bookBestSeller",
      ) as HTMLInputElement;
      const trendingCheckbox = getElementById(
        "bookTrending",
      ) as HTMLInputElement;
      const imageUrlInput = getElementById("bookImageUrl") as HTMLInputElement;

      if (titleInput) titleInput.value = book.title;
      if (authorInput) authorInput.value = book.author;
      if (yearInput) yearInput.value = book.year.toString();
      if (descriptionInput) descriptionInput.value = book.description;
      if (linkInput) linkInput.value = book.link;

      if (bookGenreDropdown) {
        const genreArray = Array.from(GENRE_LIST);
        if (genreArray.indexOf(book.genre) !== -1) {
          bookGenreDropdown.value = book.genre;
          customGenreGroup?.classList.add("hidden");
        } else {
          bookGenreDropdown.value = "Other";
          customGenreGroup?.classList.remove("hidden");
          if (customGenreInput) customGenreInput.value = book.genre;
        }
      }

      if (bestSellerCheckbox) bestSellerCheckbox.checked = book.best_seller;
      if (trendingCheckbox) trendingCheckbox.checked = book.trending;
      if (imageUrlInput) imageUrlInput.value = book.image;
      if (browseRadio) browseRadio.checked = true;
      if (uploadRadio) uploadRadio.checked = false;
      bookImageUrl?.classList.remove("hidden");
      bookImageFile?.classList.add("hidden");
      bookImageUrl?.setAttribute("required", "");
      bookImageFile?.removeAttribute("required");

      addBookModal?.classList.remove("hidden");
      return;
    }

    // Handle delete button
    if (
      target.classList.contains("delete-btn") ||
      target.closest(".delete-btn")
    ) {
      const button = target.closest(".delete-btn") as HTMLElement;
      if (!button) return;
      bookIndexToDelete = Number(button.dataset.bookIndex);
      deleteConfirmModal?.classList.remove("hidden");
      return;
    }

    // If clicked on overlay but not a button, don't flip
    if (target.closest(".card-overlay")) return;

    // Mobile flip toggle
    if (bookElement && !target.classList.contains("add-btn")) {
      bookElement.classList.toggle("flipped");
      return;
    }

    // Only respond to clicks on the add/remove button
    if (!target.classList.contains("add-btn")) return;

    // Find the parent card and get its data-index attribute
    const card = target.closest(".product-card") as HTMLElement;
    const bookIndex = Number(card?.dataset?.index);

    // Validate the index is a valid number
    if (!Number.isFinite(bookIndex)) return;

    // Get the book from the master array
    const book = allBooks[bookIndex];
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

    // Refresh the list so removed books disappear immediately
    const updatedBooks = allBooks.filter((book) =>
      updatedCollectionSet.has(book.title),
    );
    renderMyBooks(updatedBooks);
  });

  // Attach genre click handlers to both lists
  if (desktopGenreList) {
    desktopGenreList.addEventListener(
      "click",
      handleGenreClick as EventListener,
    );
  }
  if (mobileGenreList) {
    mobileGenreList.addEventListener(
      "click",
      handleGenreClick as EventListener,
    );
  }

  const filterMyBooks = (searchQuery: string): void => {
    const normalizedQuery = (searchQuery || "").trim().toLowerCase();
    const currentCollection = loadCollection();
    const myBooks = allBooks.filter((book) =>
      currentCollection.has(book.title),
    );

    // If no query, show all saved books; otherwise filter
    const filteredBooks = !normalizedQuery
      ? myBooks
      : myBooks.filter((book) =>
          `${book.title} ${book.author} ${book.genre}`
            .toLowerCase()
            .includes(normalizedQuery),
        );

    renderMyBooks(filteredBooks);
  };

  if (desktopSearchForm && desktopSearchInput) {
    desktopSearchForm.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      filterMyBooks(desktopSearchInput.value);
    });
  }

  if (mobileSearchForm && mobileSearchInput) {
    mobileSearchForm.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      filterMyBooks(mobileSearchInput.value);
    });
  }

  // Populate genre dropdown in the edit modal
  GENRE_LIST.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    bookGenreDropdown?.appendChild(option);
  });
  const otherOption = document.createElement("option");
  otherOption.value = "Other";
  otherOption.textContent = "Other";
  bookGenreDropdown?.appendChild(otherOption);

  // Toggle custom genre input when "Other" is selected
  bookGenreDropdown?.addEventListener("change", () => {
    const customGenreGroup = getElementById("customGenreContainer");
    if (bookGenreDropdown.value === "Other") {
      customGenreGroup?.classList.remove("hidden");
      customGenreInput?.classList.remove("hidden");
      customGenreInput?.setAttribute("required", "");
      bookGenreDropdown.removeAttribute("required");
    } else {
      customGenreGroup?.classList.add("hidden");
      customGenreInput?.classList.add("hidden");
      customGenreInput?.removeAttribute("required");
      bookGenreDropdown.setAttribute("required", "");
    }
  });

  // Modal radio button toggle
  uploadRadio?.addEventListener("change", () => {
    bookImageFile?.classList.remove("hidden");
    bookImageFile?.setAttribute("required", "");
    bookImageUrl?.classList.add("hidden");
    bookImageUrl?.removeAttribute("required");
  });
  browseRadio?.addEventListener("change", () => {
    bookImageFile?.classList.add("hidden");
    bookImageFile?.removeAttribute("required");
    bookImageUrl?.classList.remove("hidden");
    bookImageUrl?.setAttribute("required", "");
  });

  const resetModalState = () => {
    addBookModal?.classList.add("hidden");
    editingBookIndex = null;
    if (modalTitle) modalTitle.textContent = "Add a New Book";
    const submitBtn = document.querySelector<HTMLButtonElement>(".btn-submit");
    if (submitBtn) submitBtn.textContent = "Add Book";
  };

  // Close add/edit modal
  closeModalBtn?.addEventListener("click", resetModalState);
  cancelBtn?.addEventListener("click", resetModalState);

  // Close delete modal
  closeDeleteModal?.addEventListener("click", () => {
    deleteConfirmModal?.classList.add("hidden");
    bookIndexToDelete = null;
  });
  cancelDeleteBtn?.addEventListener("click", () => {
    deleteConfirmModal?.classList.add("hidden");
    bookIndexToDelete = null;
  });

  // Confirm delete
  confirmDeleteBtn?.addEventListener("click", () => {
    if (bookIndexToDelete === null) return;
    const bookToDelete = allBooks[bookIndexToDelete];

    allBooks.splice(bookIndexToDelete, 1);
    bookIndexByTitle.clear();
    allBooks.forEach((book, index) => bookIndexByTitle.set(book.title, index));

    const customBooks = allBooks.slice(originalBooks.length);
    saveCustomBooks(customBooks);

    const currentCollection = loadCollection();
    if (currentCollection.has(bookToDelete.title)) {
      const toggleResult = toggleBookInCollection(bookToDelete.title);
      updateCollectionCount(toggleResult.collectionSet);
    }

    const updatedBooks = allBooks.filter((b) => loadCollection().has(b.title));
    renderMyBooks(updatedBooks);
    deleteConfirmModal?.classList.add("hidden");
    bookIndexToDelete = null;
  });

  // Add/Edit book form submission
  const addBookForm = getElementById("addBookForm");
  addBookForm?.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

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
    const imageUrlInput = getElementById("bookImageUrl") as HTMLInputElement;
    const imageFileInput = getElementById("bookImage") as HTMLInputElement;
    const customGenreField = getElementById("customGenre") as HTMLInputElement;

    let genre = genreSelect?.value || "";
    if (genre === "Other" && customGenreField?.value)
      genre = customGenreField.value;

    let image = "";
    if (
      imageUrlInput &&
      !imageUrlInput.classList.contains("hidden") &&
      imageUrlInput.value
    ) {
      image = imageUrlInput.value;
    } else if (imageFileInput?.files?.[0]) {
      image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject("Error reading file");
        reader.readAsDataURL(imageFileInput.files![0]);
      });
    }

    const updatedBook: Book = {
      title: titleInput?.value || "",
      author: authorInput?.value || "",
      genre,
      year: Number(yearInput?.value || 0),
      description: descriptionInput?.value || "",
      best_seller: bestSellerCheckbox?.checked || false,
      trending: trendingCheckbox?.checked || false,
      link: linkInput?.value || "",
      image,
    };

    if (editingBookIndex !== null) {
      allBooks[editingBookIndex] = updatedBook;
    }

    bookIndexByTitle.clear();
    allBooks.forEach((book, index) => bookIndexByTitle.set(book.title, index));
    const customBooks = allBooks.slice(originalBooks.length);
    saveCustomBooks(customBooks);

    const updatedCollection = loadCollection();
    const updatedBooks = allBooks.filter((b) => updatedCollection.has(b.title));
    renderMyBooks(updatedBooks);

    addBookModal?.classList.add("hidden");
    (event.target as HTMLFormElement).reset();
    editingBookIndex = null;
    customGenreInput?.classList.add("hidden");
    customGenreInput?.removeAttribute("required");
    bookGenreDropdown?.setAttribute("required", "");
  });
});
