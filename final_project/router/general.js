const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    //return isValid(username);
    
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

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
        const authenticatedUsers = users.filter((user) => {
            user.username === username && user.password === password
        });
      return (authenticatedUsers.length > 0);
    
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
/*
//only registered users can login
public_users.post("/login", (req,res) => {
    //Write your code here
    //console.log("login: ", req.body);
      const username = req.body.username;
      const password = req.body.password;
      
      // Check if username or password is missing
      if (!username || !password) {
          return res.status(404).json({ message: "Error logging in" });
      }
  
      // Authenticate user
      if (authenticatedUser(username, password)) {
          // Generate JWT access token
          let accessToken = jwt.sign({
              data: password
          }, 'access', { expiresIn: 60 * 60 });
  
          // Store access token and username in session
          req.session.authorization = {
              accessToken, username
          }
          return res.status(200).send("User successfully logged in");
      } else {
          return res.status(208).json({ message: "Invalid Login. Check username and password" });
      }
  
    //return res.status(300).json({message: "Yet to be implemented"});
  });
*/
module.exports.general = public_users;
