const express = require('express');
const jwt = require('jsonwebtoken');

//let users = require("./router/auth_users.js").users;

const regd_users = express.Router();

let users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
  // ... other user objects
];

module.exports.users = users;


const isValid = (username) => {
    // Write code to check if the username is valid
};

const authenticatedUser = (username, password) => {
  // Write code to check if username and password match the one we have in records.
  // Assuming your authentication logic here

  // If authentication is successful, generate a JWT token
  if (authenticationSuccessful) {
      const accessToken = jwt.sign({ username: username }, 'yourSecretKey', { expiresIn: '1h' });

      // You can include additional data in the token payload if needed

      return { authenticated: true, accessToken };
  } else {
      return { authenticated: false, accessToken: null };
  }
};
regd_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users.find((user) => user.username === username)) {
        return res.status(409).json({ message: "Username already exists. Choose a different one." });
    }

    // Add the new user to the users array
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully" });
});

// Login as a registered user
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the users array is defined
  if (!users || !Array.isArray(users)) {
      return res.status(500).json({ message: "Internal server error. Users array is not properly initialized." });
  }

  // Check if the user with the given username exists
  const user = users.find((user) => user.username === username);

  if (!user) {
      return res.status(401).json({ message: "Invalid credentials. User not found." });
  }

  // Check if the password matches
  if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials. Password incorrect." });
  }

  // At this point, the user is authenticated
  // You can proceed with generating a JWT and other actions

  return res.status(200).json({ message: "User successfully logged in" });
});



regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization?.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Check if the user is logged in
  if (!username) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  // Check if the required parameters are provided
  if (!isbn || !review) {
      return res.status(400).json({ message: "ISBN and review are required." });
  }

  // Find the user in the users array
  const user = users.find((user) => user.username === username);

  // Check if the user exists
  if (!user) {
      return res.status(404).json({ message: "User not found." });
  }

  // Check if the review for the ISBN already exists
  const existingReviewIndex = user.reviews.findIndex((r) => r.isbn === isbn);

  if (existingReviewIndex !== -1) {
      // Modify the existing review
      user.reviews[existingReviewIndex].review = review;
      return res.status(200).json({ message: "Review modified successfully." });
  } else {
      // Add a new review
      user.reviews.push({ isbn, review });
      return res.status(201).json({ message: "Review added successfully." });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization?.username;
  const isbn = req.params.isbn;

  // Check if the user is logged in
  if (!username) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  // Find the user in the users array
  const user = users.find((user) => user.username === username);

  // Check if the user exists
  if (!user) {
      return res.status(404).json({ message: "User not found." });
  }

  // Check if the review for the ISBN exists
  const existingReviewIndex = user.reviews.findIndex((r) => r.isbn === isbn);

  if (existingReviewIndex !== -1) {
      // Delete the existing review
      user.reviews.splice(existingReviewIndex, 1);
      return res.status(200).json({ message: "Review deleted successfully." });
  } else {
      return res.status(404).json({ message: "Review not found." });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

module.exports.regd_users = regd_users;