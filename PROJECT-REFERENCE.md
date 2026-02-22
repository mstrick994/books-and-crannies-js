# 📚 Books & Crannies - Quick Reference

**"What does this do again?"** → Find it here.

---

## 📦 Types & Interfaces (types.ts)

| Name                    | What It Is                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| `Book`                  | Book structure: title, author, genre, year, best_seller, trending, description, image, link     |
| `ToggleResult`          | Return from toggleBookInCollection: { inCollection, collectionSet }                             |
| `FilterState`           | Search/filter state: searchQuery, searchBy, selectedGenre, selectedYear, showOnlyTrending       |
| `PopulateGenreOptions`  | Params for populateGenreFilters: genreList, desktopGenreList, mobileGenreList, includeAllOption |
| `RenderBookCardOptions` | Params for renderBookCard function                                                              |

---

## 💾 Data (books-data.ts)

| Name                   | Type                | What It Is                                          |
| ---------------------- | ------------------- | --------------------------------------------------- |
| `books`                | `Book[]`            | Master array of all books (original + custom)       |
| `GENRE_LIST`           | `readonly string[]` | Fixed list of 11 genres (Adventure, Classic, etc.)  |
| `ORIGINAL_BOOKS_COUNT` | `number`            | Constant (9) - boundary between original and custom |

---

## 🔍 DOM Utilities (dom-helpers.ts)

| Function           | Signature                                                | What It Does                       |
| ------------------ | -------------------------------------------------------- | ---------------------------------- |
| `getElementById`   | `(elementId: string) => HTMLElement \| null`             | Get element by ID                  |
| `querySelector`    | `(cssSelector: string, rootElement?) => Element \| null` | Get first matching element         |
| `querySelectorAll` | `(cssSelector: string, rootElement?) => Element[]`       | Get all matching elements as array |

---

## 💿 Storage Functions (collection-helpers.ts)

| Function                 | Signature                              | What It Does                             |
| ------------------------ | -------------------------------------- | ---------------------------------------- |
| `loadCollection`         | `() => Set<string>`                    | Load saved book titles from localStorage |
| `saveCollection`         | `(collectionSet: Set<string>) => void` | Save collection to localStorage          |
| `toggleBookInCollection` | `(bookTitle: string) => ToggleResult`  | Add/remove book, returns new state       |
| `loadCustomBooks`        | `() => Book[]`                         | Load custom user-added books             |
| `saveCustomBooks`        | `(customBooks: Book[]) => void`        | Save custom books array to localStorage  |

---

## 🎨 UI Functions (ui-helpers.ts)

| Function                    | Signature                                    | What It Does                                    |
| --------------------------- | -------------------------------------------- | ----------------------------------------------- |
| `renderBookCard`            | `(options: RenderBookCardOptions) => string` | Generate HTML for one book card                 |
| `updateCollectionCount`     | `(collectionSet?: Set<string>) => void`      | Update badge counter                            |
| `populateGenreFilters`      | `(options: PopulateGenreOptions) => void`    | Populate genre dropdowns using GENRE_LIST       |
| `getUniqueGenres`           | `(booksArray: Book[]) => string[]`           | Extract unique genres from books                |
| `initializeUI`              | `() => void`                                 | Setup all UI (calls sidebar, dropdown, counter) |
| `initializeSidebar`         | `() => void`                                 | Setup mobile menu                               |
| `initializeBrowseDropdown`  | `() => void`                                 | Setup genre dropdown                            |
| `initializeStorageListener` | `() => void`                                 | Listen for localStorage changes                 |

---

## ⚡ Important Variables (script.ts) |

| ------------------ | --------------------- | ------------------------------------------------ |
| `books` | `Book[]` | All books (original + custom loaded at startup) |
| `filters` | `FilterState` | Current search/filter state |
| `bookIndexByTitle` | `Map<string, number>` | Maps book title → index in books array |
| `editingBookIndex` | `number \| null` | Tracks which book is being edited (or null) |
| `bookIndexToDelete`| `number \| null` | Tracks which book deletion is pending |

---

## 🎯 Key Concepts

**Event Delegation:** One listener on container, not individual buttons  
**Set vs Array:** Collection uses Set (fast lookup), localStorage uses Array (JSON compatible)  
**data-index:** Book cards reference original array index, not filtered index  
**innerHTML =** Replaces ALL content (why Add Book button is in renderBooks)  
**Original vs Custom:** Books 0-8 are read-only originals, 9+ are user-added custom books  
**CRUD Operations:** Add/Edit/Delete only work on custom books (index >= ORIGINAL_BOOKS_COUNT)  
**Edit/Delete Overlay:** Invisible buttons appear on hover (desktop) or when card is flipped (mobile)  
**Mobile Flip:** Uses `.flipped` class toggle on click vs `:hover` CSS on desktop

---

## 🆕 CRUD Features (Custom Books)

### Add Book Flow

1. User clicks "Add a Book" button or mobile sidebar link
2. Modal opens with empty form
3. User fills title, author, year, genre, description, image (upload or URL), best-seller/trending checkboxes
4. Form submission creates new `Book` object
5. Book added to `books` array
6. Custom books (indices 9+) saved to localStorage separately
7. UI rebuilds to show new book

### Edit Book Flow

1. User hovers over/clicks custom book card (indices >= 9)
2. Edit/delete button overlay becomes visible
3. Click edit button → modal opens with form pre-filled
4. `editingBookIndex` tracks which book is being edited
5. User modifies fields and submits
6. Book replaced in array at same index
7. Custom books re-saved to localStorage
8. UI rebuilds

### Delete Book Flow

1. User clicks delete button on custom book card
2. Confirmation modal appears with book title
3. User confirms deletion
4. Book removed from `books` array using `splice()`
5. If book is in collection, also removed from collection Set
6. Collection count updated if affected
7. Custom books re-saved
8. UI rebuilds (JSON compatible)  
   **data-index:** Book cards reference original array index, not filtered index  
   **innerHTML =** Replaces ALL content (why Add Book button is in renderBooks)

---

## 🔧 Usage Examples (How to Use the Functions)

**Note:** These are examples showing common patterns - NOT references to actual variables in the codebase.

```typescript
// Example: Get element safely
const modal = getElementById("addBookModal");

// Example: Check if book is saved
const saved = loadCollection();
if (saved.has("1984")) {
  /* ... */
}

// Example: Toggle book and update UI
const result = toggleBookInCollection("The Great Gatsby");
updateCollectionCount(result.collectionSet);

// Example: Filter books by genre
const classics = books.filter((b) => b.genre === "Classic");

// Example: Get unique genres from book array
const genres = getUniqueGenres(books);
```
