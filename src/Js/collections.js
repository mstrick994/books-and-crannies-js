const myBooksContainer = document.getElementById("myBooks");
const emptyMessage = document.getElementById("emptyMessage");

// Load saved collection from localStorage
const saved = JSON.parse(localStorage.getItem("collection")) || [];
const collection = new Set(saved);

//Filter all books down to just what’s in the collection
const myBooks = books.filter(b => collection.has(b.title));

if (myBooks.length === 0) {
  emptyMessage.style.display = "block";
} else {
  emptyMessage.style.display = "none";
  myBooksContainer.innerHTML = myBooks.map((b, i) => renderBook(b, i)).join("");
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

    // Refresh the list (so books disappear immediately if removed)
    const updatedBooks = books.filter(b => collection.has(b.title));
    if (updatedBooks.length === 0) {
      emptyMessage.style.display = "block";
      myBooksContainer.innerHTML = "";
    } else {
      emptyMessage.style.display = "none";
      myBooksContainer.innerHTML = updatedBooks.map((b, i) => renderBook(b, i)).join("");
    }
  }
});
