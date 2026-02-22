# ��� Books & Crannies —TypeScript Bookstore

**Books & Crannies** is a feature-rich online bookstore built with TypeScript, HTML, and CSS, showcasing modern frontend development patterns with strict type safety and modular architecture.

This project demonstrates advanced DOM manipulation, state management, localStorage integration, and responsive design — all with vanilla TypeScript and zero frameworks.

---

## ��� Core Features

### Book Catalog & Discovery
- Display curated collection of 9 classic books with 3D flip card UI
- Filter books by genre, search by title/author, or browse trending/best-sellers
- Interactive book cards with flip animation (hover on desktop, click on mobile)
- Visual tags for trending titles and best-sellers
- Direct links to Internet Archive / Open Library for free reading

### User Collection Management
- Add/remove books to personal collection with localStorage persistence
- Dedicated "My Books" page showing saved titles
- Real-time collection count badge synced across browser tabs
- Filter and search within your saved collection

### Custom Book Management (CRUD)
- **Create**: Add custom books via modal form with image upload or URL
- **Read**: View all books (original + custom) in unified grid
- **Update**: Edit existing custom books with pre-populated form
- **Delete**: Remove custom books with confirmation modal
- Custom books persist in localStorage separately from original catalog

### Responsive Design
- Mobile-first approach with hamburger sidebar navigation
- Adaptive card grid (desktop: multi-column, tablet: 2-column, mobile: single-column)
- Touch-friendly interactions with click-to-flip on mobile devices
- Centered modals on all screen sizes with proper overflow handling

---

## ⚙️ Tech Stack

- **TypeScript** — strict type safety, interfaces, and modern ES6+ features
- **HTML5** — semantic markup with accessibility considerations
- **CSS3** — custom properties, flexbox, grid, transitions, and media queries
- **Vanilla DOM API** — no frameworks or libraries, pure browser APIs
- **localStorage** — client-side persistence for collections and custom books
- **ES6 Modules** — modular architecture with clean separation of concerns

---

## ���️ Project Structure

\`\`\`
Books and Crannies/
├── index.html              # Home page (browse all books)
├── my-list.html            # Collection page (saved books)
├── auth.html               # Login/signup forms
├── README.md               # This file
├── PROJECT-REFERENCE.md    # Quick API reference
├── tsconfig.json           # TypeScript configuration
├── src/
│   ├── CSS/
│   │   └── style.css       # All styles (responsive, components)
│   ├── Js/                 # Compiled JavaScript output
│   │   ├── script.js
│   │   ├── collections.js
│   │   ├── auth.js
│   │   └── ...helpers.js
│   └── Ts/                 # TypeScript source files
│       ├── types.ts              # Type definitions and interfaces
│       ├── books-data.ts         # Book catalog data
│       ├── dom-helpers.ts        # DOM utility functions
│       ├── collection-helpers.ts # localStorage management
│       ├── ui-helpers.ts         # Reusable UI components
│       ├── script.ts             # Home page logic
│       ├── collections.ts        # Collection page logic
│       ├── auth.ts               # Auth page logic
│       └── README.md             # TypeScript migration notes
└── images/                 # Book covers and assets
\`\`\`

---

## ��� Key Technical Highlights

### Type-Safe Architecture
- Comprehensive \`Book\` interface with all required fields
- \`FilterState\` interface for search/filter state management
- \`ToggleResult\` return type for collection operations
- Strict null checking and type guards throughout

### Data Separation Strategy
- \`ORIGINAL_BOOKS_COUNT = 9\` constant defines boundary
- Original books (indices 0-8) are read-only
- Custom books (indices 9+) stored separately in localStorage
- Merged at runtime for unified display

### Smart Collection Management
- Uses \`Set<string>\` for O(1) book lookups by title
- Syncs across tabs with storage event listener
- Atomic save operations prevent data corruption
- Graceful error handling for localStorage failures

### Modern CSS Patterns
- CSS custom properties for theming
- \`aspect-ratio\` for book card proportions
- CSS Grid with \`repeat(auto-fit, minmax())\` for responsive layouts
- Media queries with \`@media (hover: hover)\` for desktop/mobile detection

### Mobile-First Interactions
- Separate hover (desktop) and click (mobile) flip behaviors
- Invisible button overlay for edit/delete on custom books
- Proper touch target sizing (44px minimum)
- Backdrop blur and smooth transitions

---

## ��� Future Enhancements

- Backend API integration (replace localStorage with database)
- User authentication with JWT
- Book recommendations based on collection
- Export/import collection as JSON
- Dark mode toggle
- Advanced search with filters (year range, rating, etc.)
- Pagination for large collections
- React/Vue migration for comparison

---

## ���️ Development Notes

### TypeScript Compilation
Run `tsc` to compile TypeScript files to JavaScript:
```bash
tsc
```
Compiled `.js` files are generated alongside `.ts` files in `src/ts/` directory.

**Important**: Always run `tsc` before deploying! The compiled `.js` files are gitignored (not tracked in version control) to keep GitHub showing TypeScript as the primary language.

### Browser Compatibility
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- ES6 module support required
- localStorage API required
- CSS Grid and Flexbox required

---

## ��� 3D Book Card UI Attribution

Base flip card interaction inspired by a community snippet from [Uiverse.io](https://uiverse.io) (author: eslam-hany).

**Modifications made:**
- Semantic \`<article>\` structure for accessibility
- Swapped front to use actual book cover images
- Added inner description panel with metadata
- Implemented responsive behavior and keyboard navigation
- Added edit/delete button overlay for custom books
- Custom CSS for trending/best-seller tags

---

## ��� License

This is a portfolio/learning project. Feel free to reference or learn from the code structure.
