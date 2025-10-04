// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const myBooksContainer = document.getElementById("myBooks");
  const emptyMessage = document.getElementById("emptyMessage");
  const myBooksCount = document.getElementById("myBooksCount");
  const myBooksCountMobile = document.getElementById("myBooksCountMobile");

  // Mobile sidebar elements
  const sidebar = document.getElementById("sidebar");
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");

  // Load saved collection from localStorage
  const saved = JSON.parse(localStorage.getItem("collection")) || [];
  const collection = new Set(saved);

  // Dropdown logic
  const dropBtn = document.querySelector(".dropbtn");
  const dropdown = document.getElementById("browseDropdown");
  const genreList = document.getElementById("bookGenres");
  const mobileGenreList = document.getElementById("mobileGenres");


  // Book Data (same as in script.js)
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
        "An epic sea voyage that follows Captain Ahab's obsessive quest to hunt the great white whale, exploring themes of obsession, fate, and man's struggle against nature.",
      image: "images/Photos/book-covers/moby-dick.jpg",
      link: "https://openlibrary.org/works/OL102749W/Moby_Dick?edition=key%3A/books/OL37044701M",
    },
  ];

  // Build unique genres for My List page
const uniqueGenres = [...new Set(books.map(b => b.genre))];

// Populate dropdowns (desktop + mobile)
if (genreList && mobileGenreList) {
  // Optional: include "All" at the top
  const addLink = (ul, label) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = label;
    a.dataset.genre = label;
    li.appendChild(a);
    ul.appendChild(li);
  };

  addLink(genreList, "All");
  addLink(mobileGenreList, "All");
  uniqueGenres.forEach(g => {
    addLink(genreList, g);
    addLink(mobileGenreList, g);
  });
}

// Toggle + outside-close for dropdown
if (dropBtn && dropdown) {
  dropBtn.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });
  window.addEventListener("click", (e) => {
    if (!e.target.closest(".browse-dropdown")) dropdown.classList.remove("show");
  });
}

// Helper to render a given list of books into #myBooks
const renderMyBooks = (list) => {
  if (!list || list.length === 0) {
    emptyMessage.style.display = "block";
    myBooksContainer.innerHTML = "";
    return;
  }
  emptyMessage.style.display = "none";
  myBooksContainer.innerHTML = list.map((book) => {
    const originalIndex = books.findIndex(b => b.title === book.title);
    return renderBook(book, originalIndex);
  }).join("");
};

// Handle clicks on genre items (My List page only)
const handleGenreClick = (e) => {                         // NEW
  if (e.target.tagName !== "A") return;
  e.preventDefault();
  const selected = e.target.dataset.genre || e.target.textContent;

  // Source = only saved books
  const savedTitles = JSON.parse(localStorage.getItem("collection")) || [];
  const savedBooks = books.filter(b => savedTitles.includes(b.title));

  const results = (selected === "All")
    ? savedBooks
    : savedBooks.filter(b => b.genre === selected);

  renderMyBooks(results);
  dropdown && dropdown.classList.remove("show");

  // Close mobile sidebar if open
  if (sidebar && sidebar.classList.contains("is-open")) {
    sidebar.classList.remove("is-open");
    sidebarBackdrop && sidebarBackdrop.classList.remove("is-on");
    if (hamburgerMenu) {
      hamburgerMenu.classList.remove("is-active");
      hamburgerMenu.setAttribute("aria-expanded", "false");
    }
    document.body.style.overflow = "";
  }
}

if (genreList) genreList.addEventListener("click", handleGenreClick);        // NEW
if (mobileGenreList) mobileGenreList.addEventListener("click", handleGenreClick); // NEW


  // Render book function (same as in script.js)
  const renderBook = (book, originalIndex) => {
    const inCollection = collection.has(book.title);
     return `
    <div class="product-card" data-index="${originalIndex}">
      
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

  // Update counter display
  const updateCounter = () => {
    const count = collection.size;
    if (myBooksCount) myBooksCount.textContent = count;
    if (myBooksCountMobile) myBooksCountMobile.textContent = count;
  };

  // Initialize counter
  updateCounter();

  // Also update counter when page loads (in case user navigated from home page)
  window.addEventListener("load", () => {
    updateCounter();
  });

  //Filter all books down to just what's in the collection
  const myBooks = books.filter((b) => collection.has(b.title));

  if (myBooks.length === 0) {
    emptyMessage.style.display = "block";
    myBooksContainer.innerHTML = "";
  } else {
    emptyMessage.style.display = "none";
    // Find original indices for each book
    myBooksContainer.innerHTML = myBooks
      .map((book) => {
        const originalIndex = books.findIndex((b) => b.title === book.title);
        return renderBook(book, originalIndex);
      })
      .join("");
  }

  // Toggle remove from collection on this page
  myBooksContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
      const card = e.target.closest(".product-card");
      const index = card.dataset.index;
      const book = books[index];

      if (collection.has(book.title)) {
        collection.delete(book.title);
        e.target.textContent = "Add to Collection";
      } else {
        collection.add(book.title);
        e.target.textContent = "Remove from Collection";
      }

      // Save updated collection
      localStorage.setItem("collection", JSON.stringify([...collection]));

      // Update counter
      updateCounter();

      // Refresh the list (so books disappear immediately if removed)
      const updatedBooks = books.filter((b) => collection.has(b.title));
      if (updatedBooks.length === 0) {
        emptyMessage.style.display = "block";
        myBooksContainer.innerHTML = "";
      } else {
        emptyMessage.style.display = "none";
        myBooksContainer.innerHTML = updatedBooks
          .map((book) => {
            const originalIndex = books.findIndex(
              (b) => b.title === book.title
            );
            return renderBook(book, originalIndex);
          })
          .join("");
      }
    }
  });

  // Mobile Sidebar Toggle (from script.js)
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

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener("click", toggleSidebar);
  }

  if (sidebarBackdrop) {
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
  }

  genreList.addEventListener("click", handleGenreClick);
  mobileGenreList.addEventListener("click", handleGenreClick);

}); // End of DOMContentLoaded
