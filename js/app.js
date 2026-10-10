/* ==========================================================
   BlueLib Catalogue - app.js
   Vanilla JavaScript only (no frameworks or libraries).
   Note: AI assistance (Claude by Anthropic) was used to help
   draft this file; the code has been reviewed and understood
   by the student, as required by the Academic Integrity Note.
   ========================================================== */

// ---------- Data: book objects stored in an array ----------
const books = [
  { id: 1, title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "IT", copies: 4 },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", category: "IT", copies: 3 },
  { id: 3, title: "Principles of Marketing", author: "Philip Kotler", category: "Business", copies: 5 },
  { id: 4, title: "Good to Great", author: "Jim Collins", category: "Business", copies: 2 },
  { id: 5, title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", copies: 3 },
  { id: 6, title: "The Selfish Gene", author: "Richard Dawkins", category: "Science", copies: 1 },
  { id: 7, title: "The Story of Art", author: "E. H. Gombrich", category: "Arts", copies: 2 }
];

let nextId = books.length + 1; // used to give each new book a unique id

// ---------- DOM references ----------
const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter-category");
const resultCount = document.getElementById("result-count");
const form = document.getElementById("add-book-form");
const formMessage = document.getElementById("form-message");

/**
 * Builds one book card element from a book object.
 * textContent is used (not innerHTML) so user input cannot inject HTML.
 */
function createBookCard(book) {
  const card = document.createElement("article");
  card.className = "book-card";

  const title = document.createElement("h3");
  title.textContent = book.title;

  const author = document.createElement("p");
  author.textContent = "by " + book.author;

  const badge = document.createElement("span");
  badge.className = "category-badge";
  badge.textContent = book.category;

  const copies = document.createElement("p");
  copies.className = "copies";
  if (book.copies === 0) {
    copies.textContent = "Out of stock";
    copies.classList.add("out-of-stock");
  } else {
    copies.textContent = "Copies available: " + book.copies;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn borrow-btn";
  button.dataset.id = book.id;
  button.textContent = book.copies === 0 ? "Out of stock" : "Borrow";
  button.disabled = book.copies === 0;

  card.append(title, author, badge, copies, button);
  return card;
}

/**
 * Renders the books on the page. It applies the current search text
 * and category filter, so it is called after every change.
 */
function renderBooks() {
  const searchText = searchInput.value.trim().toLowerCase();
  const category = filterSelect.value;

  const visibleBooks = books.filter(function (book) {
    const matchesTitle = book.title.toLowerCase().includes(searchText);
    const matchesCategory = category === "All" || book.category === category;
    return matchesTitle && matchesCategory;
  });

  bookList.innerHTML = "";

  if (visibleBooks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "No books match your search.";
    bookList.appendChild(empty);
  } else {
    visibleBooks.forEach(function (book) {
      bookList.appendChild(createBookCard(book));
    });
  }

  resultCount.textContent = "Showing " + visibleBooks.length + " of " + books.length + " books";
}

/**
 * Borrow: reduces copies by 1 for the clicked book.
 * At 0 copies the card shows "Out of stock" and the button is disabled
 * (handled in createBookCard when the list is re-rendered).
 */
function borrowBook(id) {
  const book = books.find(function (b) {
    return b.id === id;
  });
  if (book && book.copies > 0) {
    book.copies -= 1;
    renderBooks();
  }
}

/** Shows a message under the form. type is "error" or "success". */
function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = "form-message " + type;
}

/**
 * Validates the form fields.
 * Returns an error string, or "" when everything is valid.
 */
function validateForm(title, author, category, copiesText) {
  if (title === "" || author === "" || category === "" || copiesText === "") {
    return "Please fill in all fields.";
  }
  // Whole number of 0 or more (digits only: no decimals, no negatives)
  if (!/^\d+$/.test(copiesText)) {
    return "Copies available must be a whole number of 0 or more.";
  }
  return "";
}

/** Add book: validate, push onto the array, re-render without reloading. */
function handleAddBook(event) {
  event.preventDefault(); // stop the page from reloading

  // getElementById is used because form.title would return the element's
  // built-in title attribute instead of the Title input field.
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const category = document.getElementById("category").value;
  const copiesText = document.getElementById("copies").value.trim();

  const error = validateForm(title, author, category, copiesText);
  if (error !== "") {
    showMessage(error, "error");
    return;
  }

  books.push({
    id: nextId++,
    title: title,
    author: author,
    category: category,
    copies: parseInt(copiesText, 10)
  });

  form.reset();
  showMessage('"' + title + '" was added to the catalogue.', "success");

  // Clear filters so the new book is guaranteed to be visible
  searchInput.value = "";
  filterSelect.value = "All";
  renderBooks();
}

// ---------- Event listeners ----------
searchInput.addEventListener("input", renderBooks);   // filter as the user types
filterSelect.addEventListener("change", renderBooks); // filter by category
form.addEventListener("submit", handleAddBook);

// Event delegation: one listener handles every Borrow button
bookList.addEventListener("click", function (event) {
  const button = event.target.closest(".borrow-btn");
  if (button) {
    borrowBook(Number(button.dataset.id));
  }
});

// Initial render when the page loads
renderBooks();
