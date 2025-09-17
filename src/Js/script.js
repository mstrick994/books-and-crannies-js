const sidebar = document.getElementById("sidebar");
const hamburgerMenu = document.getElementById("hamburgerMenu");
const closeBtn = document.getElementById("closeBtn");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const recList = document.getElementById("recList");

// Book Data
const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    year: 1925,
    price: 10.99,
    best_seller: true,
    trending: true,
    description: "A jazz age masterpiece exploring wealth, obsession, and the American Dream through the eyes of Nick Carraway and the mysterious Jay Gatsby.",
    image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    link: "https://openlibrary.org/works/OL468431W/The_Great_Gatsby?edition=key%3A/books/OL35657482M",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
    year: 1960,
    price: 12.99,
    best_seller: true,
    trending: false,
    description: "A poignant coming-of-age story in the racially divided South, seen through the innocent eyes of Scout Finch as her father defends a Black man accused of a grave crime.",
    image: "https://covers.openlibrary.org/b/id/8225261-L.jpg",
    link: "https://openlibrary.org/works/OL3140822W/To_Kill_a_Mockingbird?edition=key:/books/OL25228947M",
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    year: 1949,
    price: 8.99,
    best_seller: false,
    trending: true,
    description: "A dystopian tale of government surveillance, propaganda, and loss of truth, where independent thought is a punishable crime and Big Brother watches all.",
    image: "https://covers.openlibrary.org/b/id/1535610-L.jpg",
    link: "https://openlibrary.org/works/OL1168083W/Nineteen_Eighty-Four?edition=key:/books/OL3174961M",
  },
  {
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
    year: 1892,
    price: 7.50,
    best_seller: true,
    trending: false,
    description: "A brilliant detective uses keen observation and deduction to solve twelve gripping mysteries in Victorian London with his loyal partner Dr. Watson.",
    image: "https://covers.openlibrary.org/b/id/8105070-L.jpg",
    link: "https://openlibrary.org/works/OL262421W/The_Adventures_of_Sherlock_Holmes_12_stories?edition=key:/books/OL24349267M",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    year: 1813,
    price: 9.49,
    best_seller: false,
    trending: true,
    description: "A timeless romantic drama about social class, misunderstandings, and the slow-burning relationship between the spirited Elizabeth Bennet and the proud Mr. Darcy.",
    image: "https://covers.openlibrary.org/b/id/8225294-L.jpg",
    link: "https://openlibrary.org/works/OL66554W/Pride_and_Prejudice?edition=key%3A/books/OL26394550M",
  },
  {
    title: "The Odyssey",
    author: "Homer",
    genre: "Epic",
    year: -800,
    price: 9.99,
    best_seller: true,
    trending: false,
    description: "An epic journey of a cunning Greek hero returning home from war, battling mythical creatures and vengeful gods across stormy seas and strange lands.",
    image: "https://covers.openlibrary.org/b/id/8235116-L.jpg",
    link: "https://openlibrary.org/works/OL26446888W/The_Odyssey?edition=key:/books/OL36188337M",
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    genre: "Horror",
    year: 1818,
    price: 6.99,
    best_seller: true,
    trending: false,
    description: "A groundbreaking Gothic horror novel that raises timeless questions about creation, identity, and what it means to be human through the tragic tale of Victor Frankenstein and his creature.",
    image: "https://covers.openlibrary.org/b/id/8328296-L.jpg",
    link: "https://openlibrary.org/works/OL450063W/Frankenstein_or_The_Modern_Prometheus?edition=key:/books/OL37937792M",
  },
  {
    title: "Little Women",
    author: "Louisa May Alcott",
    genre: "Classic",
    year: 1868,
    price: 8.49,
    best_seller: false,
    trending: true,
    description: "A heartwarming and sometimes heartbreaking story of four sisters growing up during the Civil War, learning about love, ambition, and family in the face of life's trials.",
    image: "https://covers.openlibrary.org/b/id/8231991-L.jpg",
    link: "https://openlibrary.org/works/OL29983W/Little_Women?edition=key:/books/OL21516677M",
  }
];





// Mobile Sidebar Toggle

const toggleSidebar = () => {
  // flip sidebar + backdrop visibility
  sidebar.classList.toggle('is-open');
  sidebarBackdrop.classList.toggle('is-on');

  // check the new state to see if sidebar is on screen or not
  const isOpen = sidebar.classList.contains('is-open');

  // lock or unlock page scrolling based on sidebar state
  document.body.style.overflow = isOpen ? "hidden"  : ''; // ('') means to set the styling to be cleared


  // sync hamburger visuals + accessibility
  hamburgerMenu.classList.toggle('is-active', isOpen);
  hamburgerMenu.setAttribute('aria-expanded', String(isOpen));
};


 hamburgerMenu.addEventListener("click", toggleSidebar);

sidebarBackdrop.addEventListener('click', () => {
  // close the panel
  sidebar.classList.remove('is-open');
  sidebarBackdrop.classList.remove('is-on');

  // reset hamburger visuals + a11y
  hamburgerMenu.classList.remove('is-active');        // turn X back to hamburger
  hamburgerMenu.setAttribute('aria-expanded', 'false');

  // unlock page scroll
  document.body.style.overflow = '';
});

 

// === Recommended Sites Ticker ===
const createTickerItem = (site) => {
  
}








