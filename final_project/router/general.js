const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
    
}

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});
//comment from here to test promise callback function
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author_user = req.params.author;  
  let final_send = [];
  for (const [key, value] of Object.entries(books)) {    
    for (const [item, val] of Object.entries(value)){        
        if(item == "author" && val == author_user){
            final_send.push(books[key])
        }
    }    
  }
  if(final_send.length != 0){
    res.send(final_send);
  } else {
    res.send("Author not found!");
  }
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title_user = req.params.title;  
  let final_send = [];
  for (const [key, value] of Object.entries(books)) {    
    for (const [item, val] of Object.entries(value)){        
        if(item == "title" && val == title_user){
            final_send.push(books[key])
        }
    }    
  }
  if(final_send.length != 0){
    res.send(final_send);
  } else {
    res.send("Title not found!");
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//comment till here to test promise callback function



// Using Promise callbacks  function 

// Task 10 

function getAllBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 3000);
  
      return;
    });
}
  
  // Get the book list available in the shop
public_users.get('/',function (req, res) {
    getAllBooks().then(
      (bk)=>res.send("Task 10"+ "\n"  + JSON.stringify(bk, null, 4)),
      (error) => res.send("denied")
    );  
});
  

  // Task 11
  
  function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (!book) {
          reject("Book not found");
        }
        resolve(book);
      }, 3000);
    });
  }
  
  public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getBookByISBN(isbn).then(
      (bk)=>res.send("Task 11"+ "\n"  + JSON.stringify(bk, null, 4)),
      (error) => res.send(error)
    )
   });

  // Task 12
  function getBookByAuthor(author) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksByAuthor = [];
        for (const key in books) {
          if (books[key].author === author) {
            booksByAuthor.push(books[key]);
          }
        }
        if (booksByAuthor.length === 0) {
          reject("Book not found");
        }
        resolve(booksByAuthor);
      }, 3000);
    });
  }
  
  public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBookByAuthor(author)
    .then(
      result =>res.send("Task 12"+ "\n"  + JSON.stringify(result, null, 4))
    );
  });

// Task 13
function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (const key in books) {
          if (books[key].title === title) {
            resolve(books[key]);
          }
        }
        reject("Book not found");
      }, 3000);
    });
  }

  public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBookByTitle(title)
    .then(
      result =>res.send("Task 13"+ "\n" + JSON.stringify(result, null, 4))
    );
  });
  

module.exports.general = public_users;
