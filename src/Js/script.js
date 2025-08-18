


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


const recSites = [
  {
    label: 'Project Gutenberg',
    url: 'https://www.gutenberg.org',
    img: 'src/photos/recommended-sites/gutenberg.jpg',    // your local image
    meta: 'Classics • ePub/Kindle'
  },
  {
    label: 'Open Library',
    url: 'https://openlibrary.org',
    img: 'src/photos/recommended-sites/openlibrary.png',
    meta: 'Borrow & Read Online'
  },
  {
    label: 'Libby / OverDrive',
    url: 'https://libbyapp.com',
    img: 'src/photos/recommended-sites/libby.jpg',
    meta: 'Library card required'
  },
  {
    label: 'Wikisource',
    url: 'https://wikisource.org',
    img: 'src/photos/recommended-sites/wikisource.jpg',
    meta: 'Free public-domain texts'
  },
  {
    label: 'Google Books',
    url: 'https://books.google.com',
    img: 'src/photos/recommended-sites/google-books.png',
    meta: 'Previews + full PD books'
  },
  {
    label: 'Wattpad',
    url: 'https://wattpad.com',
    img: 'src/photos/recommended-sites/wattpad.jpg',
    meta: 'Original stories'
  },
  {
    label: 'LibriVox',
    url: 'https://librivox.org',
    img: 'src/photos/recommended-sites/librivox.jpg',
    meta: 'Free audiobooks'
  },
];

(function init(){
  const track = document.querySelector('.rec-sites-track[data-rotating]');
  if (!track) return;

  const belt = document.createElement('div');
  belt.className = 'belt';

  const makeCard = (site)=> {
    const a = document.createElement('a');
    a.className = 'rec-card';
    a.href = site.url; a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('aria-label', site.label);

    // background image on ::before via style
    a.style.setProperty('--bg', `url("${site.img}")`);
    a.addEventListener('mouseenter', ()=>{}); // keeps :hover available

    // inject the bg into ::before using CSS var
    // (we’ll map it in a small style block below)

    const c = document.createElement('div');
    c.className = 'content';

    const t = document.createElement('div');
    t.className = 'title';
    t.textContent = site.label;

    const m = document.createElement('div');
    m.className = 'meta';
    m.textContent = site.meta || '';

    c.append(t, m);
    a.append(c);
    return a;
  };

  recSites.forEach(s => belt.appendChild(makeCard(s)));
  recSites.forEach(s => belt.appendChild(makeCard(s))); // duplicate for loop

  track.appendChild(belt);

  // apply the CSS var -> background-image bridge
  const style = document.createElement('style');
  style.textContent = `.rec-card::before{ background-image: var(--bg); }`;
  document.head.appendChild(style);

  // fallback for reduced motion: show as simple grid
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    track.innerHTML = '';
    track.style.maskImage = track.style.webkitMaskImage = 'none';
    track.appendChild(belt);
    belt.style.animation = 'none';
    belt.style.flexWrap = 'wrap';
    belt.style.justifyContent = 'center';
  }
})();

