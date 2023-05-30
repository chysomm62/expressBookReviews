const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username, password) => {
  //returns boolean
  //write code to check is the username is valid
  return users.find((name) => name.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const theSame = users.filter(
    (user) => user.username === username && user.password === password
  );
  return theSame.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  // check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide correct username and password." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User Logged in Successfully");
  } else {
    return res
      .status(208)
      .json({ message: "Make sure your details are valid" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!review) {
    return res.status(400).json({ message: "Please provide a review" });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review;
    return res.json({ message: "Review modified successfully" });
  }
  books[isbn].reviews[username] = review;
  return res.json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }

  if (!books[isbn]) {
    return res.status(400).json({ message: "Invalid ISBN" });
  }

  if (!books[isbn].reviews[username]) {
    return res
      .status(400)
      .json({ message: "Review not found for the given ISBN and username" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
