# TypeScript Modules Documentation

This folder contains all the **TypeScript** source code for the Books & Crannies application, organized using **ES6 Modules** with full type safety.

**Migration Note:** This project was migrated from vanilla JavaScript to TypeScript to add strict type checking, better IDE support, and improved maintainability. All `.js` files were converted to `.ts` with comprehensive type annotations.

## 📁 File Structure Overview

### **Core Data & Utilities** (Shared across pages)

#### `types.ts` \*ts`

- **Purpose**: Single source of truth for the book catalog
- **Exports**:
  - `books: Book[]` - Array of all books (original 9 + custom loaded from localStorage)
  - `GENRE_LIST: readonly string[]` - Fixed list of 11 genres
  - `ORIGINAL_BOOKS_COUNT: number` - Constant (9) defining boundary between original/custom books
- **Used by**: All page scripts (script.ts, collections.ts)
- **Key Concept**: Original books (0-8) are read-only, custom books (9+) stored in localStorage

#### `dom-helpers.tptions` - Parameters for genre filter population

- `RenderBookCardOptions` - Parameters for book card rendering
- **Used by**: All TypeScript modules for type safety
- **Key Concept**: Central source of truth for all types prevents runtime errors

#### `books-data.ts`

- **Purpose**: Single source of truth for the book catalog
- **Exports**: `books` (array of 9 classic book objects)
- **Used by**: Allts`

- **Purpose**: Type-safe shortcuts for common DOM operations
- **Exports**:
  - `getElementById(elementId: string): HTMLElement | null` - Get element by ID
  - `querySelector(cssSelector: string, rootElement?): Element | null` - Find first matching element
  - `querySelectorAll(cssSelector: string, rootElement?): Element[]` - Find all matching elements (returns Array, not NodeList)
- **Used by**: All page scripts
- **Key Concept**: Type-safe wrappers reduce repetitive code and catch errors at compile time

#### `collection-helpers.ts`

- **Purpose**: Manage user's saved book collection AND custom books using localStorage
- **Exports**:
  - `loadCollection(): Set<string>` - Load saved book titles from localStorage as a Set
  - `saveCollection(collectionSet: Set<string>): void` - Save collection Set to localStorage
  - `toggleBookInCollection(bookTitle: string): ToggleResult` - Add or remove a book from collection
  - `loadCustomBooks(): Book[]` **NEW** - Load user-added custom books from localStorage
  - `saveCustomBooks(customBooks: Book[]): void` **NEW** - Save custom books to localStorage
- **Used by**: script.ts, collections.ts, ui-helpers.ts
- **Key Concept**: Uses **Set** for collection (unique titles only), separate localStorage key for custom books

#### `ui-helpers.tipt.js, collections.js, ui-helpers.js

- **Key Concept**ts`

- **Purpose**: Reusable TypeScript UI components and rendering functions
- **Exports**:
  - `renderBookCard(options: RenderBookCardOptions): string` - Generate HTML for a book card (with edit/delete overlay for custom books)
  - `updateCollectionCount(collectionSet?: Set<string>): void` - Update the "My Books" counter badge
  - `initializeSidebar(): void` - Set up mobile hamburger menu
  - `initializeBrowseDropdown(): void` - Set up genre dropdown
  - `populateGenreFilters(options: PopulateGenreOptions): void` - Fill genre lists
  - `getUniqueGenres(booksArray: Book[]): string[]` - Extract unique genres from books
  - `initializeUI(): void` - Initialize all UI components at once
  - `initializeStorageListener(): void` - Keep counter synced across browser tabs
- **Used by**: script.ts, collections.ts, auth.ts
- **Key Concept**: Type-safe rendering prevents runtime errors, edit/delete overlay only shows for custom books

---

### **Page-Specific Scripts** (One per HTML page)

ts`→ Used by`index.html`

- **Purpose**: Home page logic for browsing, filtering, searching, and managing books
- **Features**:
  - Display all books (original + custom) in a responsive grid
  - Filter by genre (sidebar or dropdown)
  - Search by title, author, trending, or best-sellers
  - Add/remove books from collection
  - **NEW**: Add custom books via modal form (image upload or URL)
  - **NEW**: Edit existing custom books with pre-populated form
  - **NEW**: Delete custom books with confirmation modal
  - **NEW**: Trendts`→ Used by`my-list.html`

- **Purpose**: Display and manage user's saved book collection
- **Features**:
  - Show only books in user's collection (original + custom)
  - Filter saved books by genre
  - Search within saved books
  - Remove books from collection (updates view immediately)
  - Show empty state message when collection is empty
- **Imports**: books (original + custom loaded), types, DOM helpers, collection helpers, UI helpers

#### `auth.t\*: Display and manage user's saved book collection

- **Features**:
  - Show only books in user's collection
  - Filter saved books by genre
  - Search within saved books
  - Remove books from collection (updates view immediately)
  - Show empty state message when collection is empty
- **Imports**: books, DOM helpers, collection helpers, UI helpers

#### `auth.js` → Used by `auth.html`

- **Purpose**: Login and signup forms with validation
- **Features**:
  - Toggle between login/signup forms via URL parameter (`?mode=login`)
  - Real-time inline validation (red/green borders, error messages)
  - Password complexity requirements (8+ chars, upper/lower/digit/special)
  - Search bar redirects to home page with query
  - Maintains consistent header navigation
- **Imports**: DOM helpers, UI helpers (for navigation consistency)

---

## 🔄 How ES6 Modules Work

### **Before (Old IIFE Pattern)**

```javascript
// books-data.js
(function() {
  window.BooksCrannies = window.BooksCrannies || {};
  window.BooksCrannies.books = [...];
})();

// script.js
const app = window.BooksCrannies;
const allBooks = app.books;
```

- Used **global namespace** (`window.BooksCrannies`)
- Required careful script loading order in HTML
- Functions wrapped in IIFE to avoid polluting global scope

### **After (Modern ES6 Modules)**

```javascript
// books-data.js
export const books = [...];

// script.js
import { books } from './books-data.js';
```

- Uses **explicit imports** (no global namespace pollution)
- Browser automatically handles loading order
- HTML only needs one `<script type="module">` tag per page
- **Key Advantage**: Clear dependencies, better for modern development

---

## 🎯 Key Programming Concepts Used

### **ES6 Module Syntax**

- `export const name = value;` - Make a value available to other files
- `import { name } from './file.js';` - Bring in a value from another file

### **Data Structures**

- **Array**: Ordered list of books (can have duplicates)
- **Set**: Collection of unique book titles (automatically prevents duplicates)
- **Map**: Fast lookup of book index by title (used for filtering)

### **DOM Manipulation**

- `getElementById()` - Find element by ID attribute
- `querySelector()` - Find first element matching CSS selector
- `querySelectorAll()` - Find all elements matching CSS selector
- `addEventListener()` - Run function when event occurs (click, input, etc.)

### **localStorage API**

- Browser storage that persists across page refreshes
- Stores data as strings (use `JSON.stringify()` to save, `JSON.parse()` to load)
- Used for saving user's book collection

### **Template Literals**

- Use backticks: `` `text ${variable} more text` ``
- Allows multi-line strings and embedded JavaScript expressions
- Used for generating HTML strings

### **Arrow Functions**

- Shorter syntax: `(param) => { ... }` instead of `function(param) { ... }`
- Single parameter: `param => { ... }` (parentheses optional)
- Single expression: `param => expression` (braces and return optional)

### **Default Parameters**

- `function(param = defaultValue)` - Use default if parameter not provided
- Example: `querySelector(selector, root = document)` - defaults to searching entire document

### **Destructuring**

- Extract values from objects: `const { inCollection, collectionSet } = toggleResult;`
- Makes code cleaner when working with objects

---

## 📝 Variable Naming Conventions

All variables and parameters use **clear, descriptive names** to make code easy to understand:

| Instead of... | We use...                 | Meaning                    |
| ------------- | ------------------------- | -------------------------- |
| `b`           | `book`                    | A single book object       |
| `arr`         | `booksArray`              | Array of book objects      |
| `el`          | `element`, `inputElement` | HTML element               |
| `e`           | `event`                   | Event object from listener |
| `q`           | `searchQuery`             | Search text from user      |
| `sel`         | `cssSelector`             | CSS selector string        |
| `ns`          | `collectionSet`           | Set of book titles         |

**Exception**: Short names are acceptable for:

- Loop counters: `i`, `j`
- Very short scopes (1-2 lines): `q` in `const q = query.trim();`

---

## 🚀 How to Use This Code

### **Adding a New Feature**

1. Identify which file(s) need changes
2. If it's a UI component used on multiple pages → add to `ui-helpers.js`
3. If it's page-specific logic → modify the page's script (script.js, collections.js, auth.js)
4. Import any needed functions at the top of the file

### **Adding a New Page**

1. Create new HTML file (e.g., `about.html`)
2. Add navigation to all HTML files
3. Create new JS file (e.g., `about.js`)
4. Import needed modules: `import { books } from './books-data.js';`
5. Add `<script type="module" src="./src/Js/about.js"></script>` to HTML

### **Modifying Book Data**

1. Edit `books-data.js` only
2. Changes automatically reflect on all pages (home, my list)
3. Ensure each book has: title, author, genre, year, best_seller, trending, description, image, link

---

## 🐛 Common Issues & Solutions

### **"Uncaught SyntaxError: Cannot use import statement outside a module"**

- **Cause**: Missing `type="module"` in HTML script tag
- **Solution**: `<script type="module" src="./path/file.js"></script>`

### **"Failed to load module script: Expected a JavaScript module"**

- **Cause**: File extension missing in import statement
- **Solution**: Always include `.js`: `import { x } from './file.js';`

### **"CORS policy" error when opening HTML directly**

- **Cause**: ES6 modules require HTTP(S) protocol, not `file://`
- **Solution**: Use a local server (Live Server extension in VS Code, or `python -m http.server`)

### **Changes not reflecting in browser**

- **Cause**: Browser cache holding old version
- **Solution**: Hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)

---

## 📚 Learning Resources

- **ES6 Modules**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- **Set Data Structure**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
- **localStorage API**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Arrow Functions**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
- **Template Literals**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

---

**Last Updated**: February 2026  
**Author**: Built for portfolio showcase with modern ES6 practices
