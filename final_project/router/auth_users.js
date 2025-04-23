const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    // Filter the users array for any user with the same username and password
    const validusers = users.filter((user) => {
        user.username === username ;
    });
    if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password) => { //returns boolean
//write code to check if username and password match the one we have in records.
    const validusers = users.filter((user) => {
        user.username === username && user.password === password
    });
    if(validusers.length > 0){
        return true;
      } else {
        return false;
      }

}

regd_users.post("/register", (req,res) => {
    //Write your code here
      const username = req.body.username;
      const password = req.body.password;
  
      // Check if both username and password are provided
      if (username && password) {
          // Check if the user does not already exist
          if (!isValid(username)) {
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

//only registered users can login
regd_users.post("/login", (req,res) => {
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
        }, 'access', { expiresIn: 5000 });

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

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
    const username = req.session.authorization.username;	
    let book = books[isbn];
    if (book) {
        let review = req.query.review;
        let reviewer = req.session.authorization['username'];
        if(review) {
            book['reviews'][reviewer] = review;
            //books[isbn] = await book;
        }
        res.send("The review for the book with ISBN  ${isbn} has been added/updated.");
    }  else{
        res.send("Unable to find this ISBN");
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// delete book review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
    //*Write your code here
 
     const isbn = req.params.isbn
     const username = req.session.authorization.username
     if (books[isbn]) {
         let book = await books[isbn]
         delete book.reviews[username]
         return res.status(200).send("Review successfully deleted")
     } else {
         return res.status(404).json({message: "ISBN not found"})
     }
 })

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
