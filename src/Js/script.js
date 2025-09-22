const sidebar = document.getElementById("sidebar");
const hamburgerMenu = document.getElementById("hamburgerMenu");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const productCards = document.getElementById("productCards");
const dropBtn = document.querySelector(".dropbtn");
const dropdown = document.getElementById("browseDropdown");
const bookGenres = document.getElementById("bookGenres");
const genreList = document.getElementById("bookGenres");
const mobileGenreList = document.getElementById("mobileGenres");

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
    image: "/src/Photos/book-covers/the-great-gatsby.jpg",
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
    image: "/src/Photos/book-covers/to-kill-a-mockingbird.jpg",
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
    image: "/src/Photos/book-covers/1984.jpg",
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
    image: "/src/Photos/book-covers/the-adventures-of-sherlock-holmes.jpg",
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
    image: "/src/Photos/book-covers/pride-and-prejudice.jpg",
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
    image: "/src/Photos/book-covers/the-odyssey.jpg",
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
    image: "/src/Photos/book-covers/frankenstein.jpg",
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
    image: "/src/Photos/book-covers/little-women.jpg",
    link: "https://openlibrary.org/works/OL29983W/Little_Women?edition=key:/books/OL21516677M",
  },
];

// === State ===
let hasUserFiltered = false;

const filters = {
  search: null,
  genre: null,
  year: null,
  best_seller: null,
  trending: null,
};

// === Filtering Logic ===
const applyAllFilters = () => {
  const filtered = books
    .filter((b) => 
  !filters.search || b.title.toLowerCase().includes(filters.search.toLowerCase())
)
    .filter((b) => !filters.genre || b.genre === filters.genre)
    .filter((b) => filters.year == null || b.year === filters.year)
    

  renderBooks(filtered);
};


// Grab genres dynamically
const uniqueGenres = [...new Set(books.map(book => book.genre))];


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



uniqueGenres.forEach(genre => { 
// Desktop 
const liDesktop = document.createElement("li"); 
const linkDesktop = document.createElement("a"); 
linkDesktop.href = "#"; 
linkDesktop.textContent = genre; 
liDesktop.appendChild(linkDesktop); 
genreList.appendChild(liDesktop); 
// Mobile 
const liMobile = document.createElement("li"); 
const linkMobile = document.createElement("a"); 
linkMobile.href = "#"; 
linkMobile.textContent = genre; 
liMobile.appendChild(linkMobile); 
mobileGenreList.appendChild(liMobile); 
});


function handleGenreClick(e) {
  if (e.target.tagName === "A") {
    e.preventDefault();
    const selectedGenre = e.target.textContent;
    filters.genre = selectedGenre;
    applyAllFilters();

    // Always close dropdown
    dropdown.classList.remove("show");

    // Close sidebar only if it’s open
    if (sidebar.classList.contains("is-open")) {
      sidebar.classList.remove("is-open");
      sidebarBackdrop.classList.remove("is-on");
      hamburgerMenu.classList.remove("is-active");
      hamburgerMenu.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  }
}


// Delegate events
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

  return `<div class="product-card" data-index="${index}">
              <div class="book">
                <div class="inner">
                  <p>${book.description}</p>  
                </div>
                <div class="cover">
                  <img src="${book.image}"/>
                </div>
                <button class="read-btn"><a href="${book.link}" target="_blank"
                rel="noopener">Read Online</a></button>
              </div>
              <div class="product-info">
                <h4 class="card-title">Title:</h4>
                <span class="title-value">${book.title}</span>
                <h4 class="card-author">Author:</h4>
                <span class="author-value">${book.author}</span>
                <h4 class="card-genre">Genre:</h4>
                <span class="genre-value">${book.genre}</span>
              </div>
              <button class="add-btn">Add to Collection</button>
            </div>`;
};

const renderBooks = (arr) => {
  productCards.innerHTML = arr.map((b, i) => renderBook(b, i)).join("");
}

renderBooks(books);
