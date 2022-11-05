const search = document.querySelector(".search-control");
const bookList = document.getElementById("book");
const bookDetailsContent = document.querySelector(".book-details-content");
const closeBtn = document.getElementById("description-close-btn");

//event listener
search.addEventListener("submit", getBookList);
bookList.addEventListener("click", getBookDescription);
closeBtn.addEventListener("click", () => {
  bookDetailsContent.parentElement.classList.remove("showDescription");
});

//error handling function
const renderError = function (msg) {
  let html = "";
  html = `Something went wrong. ${msg.message}. Try again!`;
  bookList.innerHTML = html;
  bookList.classList.add("notFound");
};

//function that receives the book list
function getBookList(e) {
  e.preventDefault();
  const searchInputTxt = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim()
    .split(" ")
    .join("_");
  fetch(`https://openlibrary.org/subjects/${searchInputTxt}.json`)
    .then((response) => response.json())
    .then((data) => renderBookList(data))
    .catch((err) => renderError(err))

}

//function that shows the book list
const renderBookList = function (data) {
  let html = "";
  if (data.works && data.works.length > 0) {
    data.works.forEach((book) => {
      html += `
                <div class="book-item" data-id = ${book.key}>
                <div class = "book-img">
             <img src = "https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg" alt = "book-cover">
                </div>
                <div class = "book-name">
                <h3>${book.title}</h3>
                <h4>${book.authors[0].name}</h4>
                <a href = "#" class = "description-btn">Description</a>
                </div>
                </div>
                 `;
    });
    bookList.classList.remove("notFound");
  } else throw new Error("Enter a category"); //error handling when nothing is entered

  bookList.innerHTML = html;
};

//function that receives the books description
function getBookDescription(e) {
  e.preventDefault();
  if (e.target.classList.contains("description-btn")) {
    const bookItem = e.target.parentElement.parentElement;
    fetch(`https://openlibrary.org${bookItem.dataset.id}.json`)
      .then((response) => response.json())
      .then((data) => renderBookDescription(data))
      .catch((err) => renderError(err));
  }
}

//function that shows the book description
const renderBookDescription = function (data) {
  bookDetailsContent.innerHTML =
    data.description.value || data.description || "Description not available";
  bookDetailsContent.parentElement.classList.add("showDescription");
};
