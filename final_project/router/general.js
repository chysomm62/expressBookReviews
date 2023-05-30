const express = require("express");
let books = require("./booksdb.js");
const axios = require("axios");
const { json } = require("express");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books,null,2))

// //   return res.status(300).json({message: "Yet to be implemented"});
// });

// using async callback
public_users.get("/", async function (req, res) {
  try {
    let data = await axios.get("http://localhost:5000");
    return res.status(200).json(data.data);
  } catch (err) {
    return res.status(500).json({ message: "Couldn't fetch book list" });
  }
});

//  get book list using promise
// const getList=()=>{
//     return new Promise((resolve,reject)=>{
//         resolve(books)
//     })
// }

// public_users.get("/",  function (req,res) {
//   getList().then(
//       (book)=>res.send(JSON.stringify(book,null,4)),
//       (error)=>res.send('Cannot get book list')
//   )
//   });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   if (books[isbn]) {
//       return res.json(books[isbn]);
//   } else {
//       return res.status(404).json({ message: "Book not found" });
//   }
// //   return res.status(300).json({message: "Yet to be implemented"});
//  });

// get book based on isbn number using promise

const getByIsbn = (isbn) => {
  let book = books[isbn];
  return new Promise((resolve, reject) => {
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });
};

public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  getByIsbn(isbn).then(
    (book) => res.send(JSON.stringify(book, null, 4)),
    (error) => res.send(error)
  );
});

// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   const authorBooks = [];

//   for (const book in books) {
//     if (books[book].author === author) {
//       authorBooks.push(books[book]);
//     }
//   }

//   if (authorBooks.length > 0) {
//     res.send(authorBooks);
//   } else {
//     res.status(404).send('No books found for author');
//   }

// //   return res.status(300).json({message: "Yet to be implemented"});
// });

// get book based on author using promise

const getByAuthor = (author) => {
  const authorBooks = [];
  return new Promise((resolve, reject) => {
    for (const book in books) {
      if (books[book].author === author) {
        authorBooks.push(books[book]);
      }
    }
    resolve(authorBooks);
    reject("not found");
  });
};

public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  getByAuthor(author).then(
    (book) => res.send(JSON.stringify(book, null, 4)),
    (error) => res.send(error)
  );
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title.toLowerCase();
//     const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
//     if(filteredBooks.length > 0){
//         return res.status(200).json(filteredBooks);
//     }
//     else{
//         return res.status(404).json({message: "Book not found"});
//     }

// //   return res.status(300).json({message: "Yet to be implemented"});
// });

// get book based on title using promise

const getBytitle = (title) => {
  const titleBooks = [];
  return new Promise((resolve, reject) => {
    for (const book in books) {
      if (books[book].title === title) {
        titleBooks.push(books[book]);
      }
    }
    resolve(titleBooks);
    reject("not found");
  });
};

public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  getBytitle(title).then(
    (book) => res.send(JSON.stringify(book, null, 4)),
    (error) => res.send(error)
  );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  const reviews = books[isbn].reviews;
  return res.status(200).json({ reviews: reviews });

  //   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
