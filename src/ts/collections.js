// My List Page Script - Displays and manages user's saved book collection
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { books as originalBooks, GENRE_LIST } from "./books-data.js";
import { getElementById, querySelector } from "./dom-helpers.js";
import { loadCollection, toggleBookInCollection, loadCustomBooks, saveCustomBooks, } from "./collection-helpers.js";
import { renderBookCard, updateCollectionCount, populateGenreFilters, initializeUI, initializeStorageListener, } from "./ui-helpers.js";
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
    const modalTitle = document.querySelector(".modal-title");
    const bookGenreDropdown = getElementById("bookGenre");
    const customGenreInput = getElementById("customGenre");
    const bookImageFile = getElementById("bookImage");
    const bookImageUrl = getElementById("bookImageUrl");
    const uploadRadio = getElementById("uploadImage");
    const browseRadio = getElementById("browseImage");
    let editingBookIndex = null;
    let bookIndexToDelete = null;
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
        // Handle edit button
        if (target.classList.contains("edit-btn") || target.closest(".edit-btn")) {
            const button = target.closest(".edit-btn");
            if (!button)
                return;
            const bookIndex = Number(button.dataset.bookIndex);
            const book = allBooks[bookIndex];
            editingBookIndex = bookIndex;
            if (modalTitle)
                modalTitle.textContent = "Edit Book";
            const submitBtn = document.querySelector(".btn-submit");
            if (submitBtn)
                submitBtn.textContent = "Save Changes";
            const titleInput = getElementById("bookTitle");
            const authorInput = getElementById("bookAuthor");
            const yearInput = getElementById("bookYear");
            const descriptionInput = getElementById("bookDescription");
            const linkInput = getElementById("bookLink");
            const customGenreGroup = getElementById("customGenreContainer");
            const bestSellerCheckbox = getElementById("bookBestSeller");
            const trendingCheckbox = getElementById("bookTrending");
            const imageUrlInput = getElementById("bookImageUrl");
            if (titleInput)
                titleInput.value = book.title;
            if (authorInput)
                authorInput.value = book.author;
            if (yearInput)
                yearInput.value = book.year.toString();
            if (descriptionInput)
                descriptionInput.value = book.description;
            if (linkInput)
                linkInput.value = book.link;
            if (bookGenreDropdown) {
                const genreArray = Array.from(GENRE_LIST);
                if (genreArray.indexOf(book.genre) !== -1) {
                    bookGenreDropdown.value = book.genre;
                    customGenreGroup === null || customGenreGroup === void 0 ? void 0 : customGenreGroup.classList.add("hidden");
                }
                else {
                    bookGenreDropdown.value = "Other";
                    customGenreGroup === null || customGenreGroup === void 0 ? void 0 : customGenreGroup.classList.remove("hidden");
                    if (customGenreInput)
                        customGenreInput.value = book.genre;
                }
            }
            if (bestSellerCheckbox)
                bestSellerCheckbox.checked = book.best_seller;
            if (trendingCheckbox)
                trendingCheckbox.checked = book.trending;
            if (imageUrlInput)
                imageUrlInput.value = book.image;
            if (browseRadio)
                browseRadio.checked = true;
            if (uploadRadio)
                uploadRadio.checked = false;
            bookImageUrl === null || bookImageUrl === void 0 ? void 0 : bookImageUrl.classList.remove("hidden");
            bookImageFile === null || bookImageFile === void 0 ? void 0 : bookImageFile.classList.add("hidden");
            bookImageUrl === null || bookImageUrl === void 0 ? void 0 : bookImageUrl.setAttribute("required", "");
            bookImageFile === null || bookImageFile === void 0 ? void 0 : bookImageFile.removeAttribute("required");
            addBookModal === null || addBookModal === void 0 ? void 0 : addBookModal.classList.remove("hidden");
            return;
        }
        // Handle delete button
        if (target.classList.contains("delete-btn") ||
            target.closest(".delete-btn")) {
            const button = target.closest(".delete-btn");
            if (!button)
                return;
            bookIndexToDelete = Number(button.dataset.bookIndex);
            deleteConfirmModal === null || deleteConfirmModal === void 0 ? void 0 : deleteConfirmModal.classList.remove("hidden");
            return;
        }
        // If clicked on overlay but not a button, don't flip
        if (target.closest(".card-overlay"))
            return;
        // Mobile flip toggle
        if (bookElement && !target.classList.contains("add-btn")) {
            bookElement.classList.toggle("flipped");
            return;
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
    // Populate genre dropdown in the edit modal
    GENRE_LIST.forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        bookGenreDropdown === null || bookGenreDropdown === void 0 ? void 0 : bookGenreDropdown.appendChild(option);
    });
    const otherOption = document.createElement("option");
    otherOption.value = "Other";
    otherOption.textContent = "Other";
    bookGenreDropdown === null || bookGenreDropdown === void 0 ? void 0 : bookGenreDropdown.appendChild(otherOption);
    // Toggle custom genre input when "Other" is selected
    bookGenreDropdown === null || bookGenreDropdown === void 0 ? void 0 : bookGenreDropdown.addEventListener("change", () => {
        const customGenreGroup = getElementById("customGenreContainer");
        if (bookGenreDropdown.value === "Other") {
            customGenreGroup === null || customGenreGroup === void 0 ? void 0 : customGenreGroup.classList.remove("hidden");
            customGenreInput === null || customGenreInput === void 0 ? void 0 : customGenreInput.classList.remove("hidden");
            customGenreInput === null || customGenreInput === void 0 ? void 0 : customGenreInput.setAttribute("required", "");
            bookGenreDropdown.removeAttribute("required");
        }
        else {
            customGenreGroup === null || customGenreGroup === void 0 ? void 0 : customGenreGroup.classList.add("hidden");
            customGenreInput === null || customGenreInput === void 0 ? void 0 : customGenreInput.classList.add("hidden");
            customGenreInput === null || customGenreInput === void 0 ? void 0 : customGenreInput.removeAttribute("required");
            bookGenreDropdown.setAttribute("required", "");
        }
    });
    // Modal radio button toggle
    uploadRadio === null || uploadRadio === void 0 ? void 0 : uploadRadio.addEventListener("change", () => {
        bookImageFile === null || bookImageFile === void 0 ? void 0 : bookImageFile.classList.remove("hidden");
        bookImageFile === null || bookImageFile === void 0 ? void 0 : bookImageFile.setAttribute("required", "");
        bookImageUrl === null || bookImageUrl === void 0 ? void 0 : bookImageUrl.classList.add("hidden");
        bookImageUrl === null || bookImageUrl === void 0 ? void 0 : bookImageUrl.removeAttribute("required");
    });
    browseRadio === null || browseRadio === void 0 ? void 0 : browseRadio.addEventListener("change", () => {
        bookImageFile === null || bookImageFile === void 0 ? void 0 : bookImageFile.classList.add("hidden");
        bookImageFile === null || bookImageFile === void 0 ? void 0 : bookImageFile.removeAttribute("required");
        bookImageUrl === null || bookImageUrl === void 0 ? void 0 : bookImageUrl.classList.remove("hidden");
        bookImageUrl === null || bookImageUrl === void 0 ? void 0 : bookImageUrl.setAttribute("required", "");
    });
    const resetModalState = () => {
        addBookModal === null || addBookModal === void 0 ? void 0 : addBookModal.classList.add("hidden");
        editingBookIndex = null;
        if (modalTitle)
            modalTitle.textContent = "Add a New Book";
        const submitBtn = document.querySelector(".btn-submit");
        if (submitBtn)
            submitBtn.textContent = "Add Book";
    };
    // Close add/edit modal
    closeModalBtn === null || closeModalBtn === void 0 ? void 0 : closeModalBtn.addEventListener("click", resetModalState);
    cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener("click", resetModalState);
    // Close delete modal
    closeDeleteModal === null || closeDeleteModal === void 0 ? void 0 : closeDeleteModal.addEventListener("click", () => {
        deleteConfirmModal === null || deleteConfirmModal === void 0 ? void 0 : deleteConfirmModal.classList.add("hidden");
        bookIndexToDelete = null;
    });
    cancelDeleteBtn === null || cancelDeleteBtn === void 0 ? void 0 : cancelDeleteBtn.addEventListener("click", () => {
        deleteConfirmModal === null || deleteConfirmModal === void 0 ? void 0 : deleteConfirmModal.classList.add("hidden");
        bookIndexToDelete = null;
    });
    // Confirm delete
    confirmDeleteBtn === null || confirmDeleteBtn === void 0 ? void 0 : confirmDeleteBtn.addEventListener("click", () => {
        if (bookIndexToDelete === null)
            return;
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
        deleteConfirmModal === null || deleteConfirmModal === void 0 ? void 0 : deleteConfirmModal.classList.add("hidden");
        bookIndexToDelete = null;
    });
    // Add/Edit book form submission
    const addBookForm = getElementById("addBookForm");
    addBookForm === null || addBookForm === void 0 ? void 0 : addBookForm.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        event.preventDefault();
        const titleInput = getElementById("bookTitle");
        const authorInput = getElementById("bookAuthor");
        const genreSelect = getElementById("bookGenre");
        const yearInput = getElementById("bookYear");
        const descriptionInput = getElementById("bookDescription");
        const bestSellerCheckbox = getElementById("bookBestSeller");
        const trendingCheckbox = getElementById("bookTrending");
        const linkInput = getElementById("bookLink");
        const imageUrlInput = getElementById("bookImageUrl");
        const imageFileInput = getElementById("bookImage");
        const customGenreField = getElementById("customGenre");
        let genre = (genreSelect === null || genreSelect === void 0 ? void 0 : genreSelect.value) || "";
        if (genre === "Other" && (customGenreField === null || customGenreField === void 0 ? void 0 : customGenreField.value))
            genre = customGenreField.value;
        let image = "";
        if (imageUrlInput &&
            !imageUrlInput.classList.contains("hidden") &&
            imageUrlInput.value) {
            image = imageUrlInput.value;
        }
        else if ((_a = imageFileInput === null || imageFileInput === void 0 ? void 0 : imageFileInput.files) === null || _a === void 0 ? void 0 : _a[0]) {
            image = yield new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject("Error reading file");
                reader.readAsDataURL(imageFileInput.files[0]);
            });
        }
        const updatedBook = {
            title: (titleInput === null || titleInput === void 0 ? void 0 : titleInput.value) || "",
            author: (authorInput === null || authorInput === void 0 ? void 0 : authorInput.value) || "",
            genre,
            year: Number((yearInput === null || yearInput === void 0 ? void 0 : yearInput.value) || 0),
            description: (descriptionInput === null || descriptionInput === void 0 ? void 0 : descriptionInput.value) || "",
            best_seller: (bestSellerCheckbox === null || bestSellerCheckbox === void 0 ? void 0 : bestSellerCheckbox.checked) || false,
            trending: (trendingCheckbox === null || trendingCheckbox === void 0 ? void 0 : trendingCheckbox.checked) || false,
            link: (linkInput === null || linkInput === void 0 ? void 0 : linkInput.value) || "",
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
        addBookModal === null || addBookModal === void 0 ? void 0 : addBookModal.classList.add("hidden");
        event.target.reset();
        editingBookIndex = null;
        customGenreInput === null || customGenreInput === void 0 ? void 0 : customGenreInput.classList.add("hidden");
        customGenreInput === null || customGenreInput === void 0 ? void 0 : customGenreInput.removeAttribute("required");
        bookGenreDropdown === null || bookGenreDropdown === void 0 ? void 0 : bookGenreDropdown.setAttribute("required", "");
    }));
});
