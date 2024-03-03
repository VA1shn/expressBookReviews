const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const books = require("./booksdb.js");
const axios = require('axios');
const { authenticatedUser } = require("./auth_users.js");
const public_users = express.Router();
let users = require('./auth_users.js').users;

const customer_routes = express.Router();

// const authenticatedUser = (username, password) => {
//   // Implement your authentication logic here
//   // Return true if the credentials are valid, false otherwise
//   return true; // Replace with your logic
// };


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});
// Get the list of available books
public_users.get('/', (req, res) => {
  // Use JSON.stringify to display the output neatly
  const booksList = JSON.stringify(books, null, 2);

  return res.status(200).json({ message: "List of books available in the shop", books: booksList });
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Your code to retrieve book details based on ISBN
  const bookDetails = books[isbn];

  if (bookDetails) {
      return res.status(200).json({ book: bookDetails });
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    // Use Axios to make an asynchronous GET request
    const response = await axios.get(`https://www.googleapis.com/auth/books/${isbn}`); // Replace with your actual API endpoint

    // Extract the book details from the response
    const bookDetails = response.data.book;

    if (bookDetails) {
      return res.status(200).json({ book: bookDetails });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error('Error fetching book details:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  // Your code to retrieve books by title
  const booksByTitle = [];
  Object.keys(books).forEach((isbn) => {
      const book = books[isbn];
      if (book.title.toLowerCase().includes(title.toLowerCase())) {
          booksByTitle.push({ isbn, details: book });
      }
  });

  if (booksByTitle.length > 0) {
      return res.status(200).json({ books: booksByTitle });
  } else {
      return res.status(404).json({ message: "No books found for the provided title" });
  }
});

public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    // Use Axios to make an asynchronous GET request
    const response = await axios.get(`http://your-books-api-endpoint/title/${title}`); // Replace with your actual API endpoint

    // Extract the book details from the response
    const booksByTitle = response.data.books;

    if (booksByTitle.length > 0) {
      return res.status(200).json({ books: booksByTitle });
    } else {
      return res.status(404).json({ message: "Books with the title not found" });
    }
  } catch (error) {
    console.error('Error fetching books by title:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Check if the ISBN exists in the books database
  if (books[isbn]) {
      const reviews = books[isbn].reviews;

      return res.status(200).json({ isbn, reviews });
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});

customer_routes.post("/register", (req, res) => {
  // Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

public_users.get('/', async (req, res) => {
  try {
      const response = await axios.get('https://www.googleapis.com/auth/books'); // Replace with your actual API endpoint

      // Assuming the response contains an array of books
      const booksList = response.data;

      return res.status(200).json({ message: "List of books available in the shop", books: booksList });
  } catch (error) {
      console.error("Error fetching books:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
});
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    // Use Axios to make an asynchronous GET request
    const response = await axios.get(`https://www.googleapis.com/auth/books/${author}`); // Replace with your actual API endpoint

    // Extract the book details from the response
    const booksByAuthor = response.data.books;

    if (booksByAuthor.length > 0) {
      return res.status(200).json({ books: booksByAuthor });
    } else {
      return res.status(404).json({ message: "Books by the author not found" });
    }
  } catch (error) {
    console.error('Error fetching books by author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports.public_users = public_users;
module.exports.customer_routes = customer_routes;