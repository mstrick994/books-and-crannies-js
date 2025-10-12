const sidebar = document.getElementById("sidebar");
const hamburgerMenu = document.getElementById("hamburgerMenu");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const productCards = document.getElementById("productCards");
const dropBtn = document.querySelector(".dropbtn");
const dropdown = document.getElementById("browseDropdown");
const bookGenres = document.getElementById("bookGenres");
const genreList = document.getElementById("bookGenres");
const mobileGenreList = document.getElementById("mobileGenres");
const searchFacet = document.getElementById("searchFacet");
const searchFacetValue = document.getElementById("searchFacetValue");
const searchForm = document.querySelector(".searchbar-input");
const mobileSearchForm = document.querySelector(".sidebar-search-form");
const searchInput = document.querySelector(".search-input");
const mobileSearchInput = document.querySelector(".sidebar-search-input");
const searchBy = document.getElementById("searchBy");
const myBooksCount = document.getElementById("myBooksCount");
const myBooksCountMobile = document.getElementById("myBooksCountMobile");
const addBtn = document.querySelector(".add-btn");

// Load from localStorage
const savedCollection = JSON.parse(localStorage.getItem("collection")) || [];
const collection = new Set(savedCollection);
// Initialize tally count
let count = collection.size;
myBooksCount.textContent = count;
myBooksCountMobile.textContent = count;

// Update counter when page loads (in case user navigated from my-list page)
window.addEventListener("load", () => {
  const updatedCollection = new Set(
    JSON.parse(localStorage.getItem("collection")) || []
  );
  count = updatedCollection.size;
  myBooksCount.textContent = count;
  myBooksCountMobile.textContent = count;
});

// Book Data
const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    year: 1925,
    best_seller: true,
    trending: true,
    description:
      "A jazz age masterpiece exploring wealth, obsession, and the American Dream through the eyes of Nick Carraway and the mysterious Jay Gatsby.",
    image: "images/Photos/book-covers/the-great-gatsby.jpg",
    link: "https://openlibrary.org/works/OL468431W/The_Great_Gatsby?edition=key%3A/books/OL35657482M",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
    year: 1960,
    best_seller: true,
    trending: false,
    description:
      "A poignant coming-of-age story in the racially divided South, seen through the innocent eyes of Scout Finch as her father defends a Black man accused of a grave crime.",
    image: "images/Photos/book-covers/to-kill-a-mockingbird.jpg",
    link: "https://openlibrary.org/works/OL3140822W/To_Kill_a_Mockingbird?edition=key:/books/OL25228947M",
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    year: 1949,
    best_seller: false,
    trending: true,
    description:
      "A dystopian tale of government surveillance, propaganda, and loss of truth, where independent thought is a punishable crime and Big Brother watches all.",
    image: "images/Photos/book-covers/1984.jpg",
    link: "https://openlibrary.org/works/OL1168083W/Nineteen_Eighty-Four?edition=key:/books/OL3174961M",
  },
  {
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
    year: 1892,
    best_seller: true,
    trending: false,
    description:
      "A brilliant detective uses keen observation and deduction to solve twelve gripping mysteries in Victorian London with his loyal partner Dr. Watson.",
    image: "images/Photos/book-covers/the-adventures-of-sherlock-holmes.jpg",
    link: "https://openlibrary.org/works/OL262421W/The_Adventures_of_Sherlock_Holmes_12_stories?edition=key:/books/OL24349267M",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    year: 1813,
    best_seller: false,
    trending: true,
    description:
      "A timeless romantic drama about social class, misunderstandings, and the slow-burning relationship between the spirited Elizabeth Bennet and the proud Mr. Darcy.",
    image: "images/Photos/book-covers/pride-and-prejudice.jpg",
    link: "https://openlibrary.org/works/OL66554W/Pride_and_Prejudice?edition=key%3A/books/OL26394550M",
  },
  {
    title: "The Odyssey",
    author: "Homer",
    genre: "Epic",
    year: -800,
    best_seller: true,
    trending: false,
    description:
      "An epic journey of a cunning Greek hero returning home from war, battling mythical creatures and vengeful gods across stormy seas and strange lands.",
    image: "images/Photos/book-covers/the-odyssey.jpg",
    link: "https://openlibrary.org/works/OL26446888W/The_Odyssey?edition=key:/books/OL36188337M",
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    genre: "Horror",
    year: 1818,
    best_seller: true,
    trending: false,
    description:
      "A groundbreaking Gothic horror novel that raises timeless questions about creation, identity, and what it means to be human through the tragic tale of Victor Frankenstein and his creature.",
    image: "images/Photos/book-covers/frankenstein.jpg",
    link: "https://openlibrary.org/works/OL450063W/Frankenstein_or_The_Modern_Prometheus?edition=key:/books/OL37937792M",
  },
  {
    title: "Little Women",
    author: "Louisa May Alcott",
    genre: "Classic",
    year: 1868,
    best_seller: false,
    trending: true,
    description:
      "A heartwarming and sometimes heartbreaking story of four sisters growing up during the Civil War, learning about love, ambition, and family in the face of life's trials.",
    image: "images/Photos/book-covers/little-women.jpg",
    link: "https://openlibrary.org/works/OL29983W/Little_Women?edition=key:/books/OL21516677M",
  },
  {
    title: "Moby-Dick",
    author: "Herman Melville",
    genre: "Adventure",
    year: 1851,
    best_seller: false,
    trending: true,
    description:
      "An epic sea voyage that follows Captain Ahab’s obsessive quest to hunt the great white whale, exploring themes of obsession, fate, and man’s struggle against nature.",
    image: "images/Photos/book-covers/moby-dick.jpg",
    link: "https://openlibrary.org/works/OL102749W/Moby_Dick?edition=key%3A/books/OL37044701M",
  },
];

// === State ===
let hasUserFiltered = false;

const filters = {
  search: null,
  searchBy: "all",
  genre: null,
  year: null,
  trending: null,
};

const searchResults = books.map((b) => ({
  ...b,
  searchString:
    `${b.title} ${b.author} ${b.genre} ${b.year} ${b.best_seller} ${b.trending}`.toLowerCase(),
}));

// === Filtering Logic ===
const applyAllFilters = () => {
  const filtered = books
    // search + best-sellers combined
    .filter((b) => {
      if (filters.searchBy === "best-sellers") {
        // Case 1: search box empty → only show best sellers
        if (!filters.search) return b.best_seller;

        // Case 2: search box not empty → only search within best sellers
        return (
          b.best_seller &&
          (b.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            b.author.toLowerCase().includes(filters.search.toLowerCase()) ||
            b.genre.toLowerCase().includes(filters.search.toLowerCase()))
        );
      }

      // Default: title, author, or all
      let fieldToSearch;
      if (filters.searchBy === "title") {
        fieldToSearch = b.title;
      } else if (filters.searchBy === "author") {
        fieldToSearch = b.author;
      } else {
        fieldToSearch = `${b.title} ${b.author} ${b.genre}`;
      }

      return (
        !filters.search ||
        fieldToSearch.toLowerCase().includes(filters.search.toLowerCase())
      );
    })
    // other filters
    .filter((b) => !filters.genre || b.genre === filters.genre)
    .filter((b) => filters.year == null || b.year === filters.year)
    .filter((b) => filters.trending == null || b.trending === filters.trending);

  // "No results" handling
  if (filtered.length === 0) {
    productCards.innerHTML = "<p>No books found.</p>";
    return;
  }

  renderBooks(filtered);
};

// Grab genres dynamically with Set
const uniqueGenres = [...new Set(books.map((book) => book.genre))];

// Dropdown toggle
dropBtn.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

// Close dropdown if clicked outside
window.addEventListener("click", (e) => {
  if (!e.target.closest(".browse-dropdown")) {
    dropdown.classList.remove("show");
  }
});

uniqueGenres.forEach((genre) => {
  // Desktop
  const liDesktop = document.createElement("li");
  const linkDesktop = document.createElement("a");
  linkDesktop.href = "#"; // placeholder (stops navigation for now)
  linkDesktop.textContent = genre;
  liDesktop.appendChild(linkDesktop);
  genreList.appendChild(liDesktop);
  // Mobile
  const liMobile = document.createElement("li");
  const linkMobile = document.createElement("a");
  linkMobile.href = "#"; // placeholder (stops navigation for now)
  linkMobile.textContent = genre;
  liMobile.appendChild(linkMobile);
  mobileGenreList.appendChild(liMobile);
});

const handleGenreClick = (e) => {
  // Guard check: only react if they clicked an <a> element
  // (e.target.tagName gives the uppercase name of the clicked element).
  if (e.target.tagName === "A") {
    // Don't prevent default for My Books link
    if (e.target.classList.contains("my-books-btn")) {
      return; // Let the link navigate normally
    }

    e.preventDefault(); // stops <a href="#"> from scrolling to top

    // Read the genre name directly from the <a> text (e.g., "Classic").
    // This works because we set link.textContent = genre earlier.
    const selectedGenre = e.target.textContent;

    // Save chosen genre into our filters object
    // and run filter logic to re-render books based on new filters
    filters.genre = selectedGenre;
    applyAllFilters();

    // Always close dropdown
    dropdown.classList.remove("show");

    // Close sidebar only if it's open
    if (sidebar.classList.contains("is-open")) {
      sidebar.classList.remove("is-open");
      sidebarBackdrop.classList.remove("is-on");
      hamburgerMenu.classList.remove("is-active");
      hamburgerMenu.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  }
}

// Delegate events (listen on the <ul>, catch clicks on <a>)
genreList.addEventListener("click", handleGenreClick);
mobileGenreList.addEventListener("click", handleGenreClick);

// Mobile Sidebar Toggle

const toggleSidebar = () => {
  // flip sidebar + backdrop visibility
  sidebar.classList.toggle("is-open");
  sidebarBackdrop.classList.toggle("is-on");

  // check the new state to see if sidebar is on screen or not
  const isOpen = sidebar.classList.contains("is-open");

  // lock or unlock page scrolling based on sidebar state
  document.body.style.overflow = isOpen ? "hidden" : ""; // ('') means to set the styling to be cleared

  // sync hamburger visuals + accessibility
  hamburgerMenu.classList.toggle("is-active", isOpen);
  hamburgerMenu.setAttribute("aria-expanded", String(isOpen));
};

hamburgerMenu.addEventListener("click", toggleSidebar);

sidebarBackdrop.addEventListener("click", () => {
  // close the panel
  sidebar.classList.remove("is-open");
  sidebarBackdrop.classList.remove("is-on");

  // reset hamburger visuals + a11y
  hamburgerMenu.classList.remove("is-active"); // turn X back to hamburger
  hamburgerMenu.setAttribute("aria-expanded", "false");

  // unlock page scroll
  document.body.style.overflow = "";
});

// Populate Book Cards

const renderBook = (book, index) => {
  const inCollection = collection.has(book.title); // using title as unique ID
  return `
    <div class="product-card" data-index="${index}">
      
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
            <img src="${book.image}" />
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


const renderBooks = (arr) => {
  productCards.innerHTML = arr.map((b, i) => renderBook(b, i)).join("");
};

renderBooks(searchResults);

// Search form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page reload
  filters.search = searchInput.value;
  applyAllFilters();
});

mobileSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  filters.search = mobileSearchInput.value;
  applyAllFilters();
});

// Search facet logic
searchBy.addEventListener("change", (e) => {
  filters.searchBy = e.target.value;
  applyAllFilters();
});

// Add to Collection

// Save whenever updated
const saveCollection = () => {
  localStorage.setItem("collection", JSON.stringify([...collection]));
};

productCards.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    const card = e.target.closest(".product-card");
    const index = card.dataset.index;
    const book = books[index];

    if (collection.has(book.title)) {
      // remove
      collection.delete(book.title);
      count--;
      e.target.textContent = "Add to Collection";
    } else {
      // add
      collection.add(book.title);
      count++;
      e.target.textContent = "Remove from Collection";
    }

    // 🔑 Persist to localStorage
    localStorage.setItem("collection", JSON.stringify([...collection]));

    // update tally both desktop & mobile
    myBooksCount.textContent = count;
    myBooksCountMobile.textContent = count;
  }
});

// --- Handle search from redirected query (like from auth.html) ---
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");

  if (query) {
    const searchInput = document.querySelector(".searchbar-input input[type='text']");
    if (searchInput) searchInput.value = query; // visually show it
    filters.search = query.trim().toLowerCase();
    applyAllFilters(); 
  }
});
