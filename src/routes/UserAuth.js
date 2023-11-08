const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const path = require('path');
const requireLogin = require('../middleware/MWAuth');


// Route to handle login
router.post('/login', (req, res) => {
    const {username, password} = req.body;

    UserModel.checkLogin(username, password, (err, isValid) => {
        if (err) {
          // handle error, possibly return an error response
          return res.status(500).json({ success: false, message: 'An error occurred' });
        }
        if (isValid) {
          // login successful
          req.session.username = username;
          return res.json({ success: true, message: 'Login successful!' });
        } else {
          // login failed
          return res.json({ success: false, message: 'Login failed: Invalid username or password' });
        }
    });
});

router.post('/register', (req, res) => {
    const {username, password, passwordAgain} = req.body;

    if(password != passwordAgain) {
        return res.status(500).json({success: false, message: 'Passwords do not match' });
    }

    UserModel.findUser(username, (err, existingUser) => {
        if (err) return res.status(500).json({success: false, message: 'Error checking user' });
        if (existingUser) return res.status(409).json({success: false, message: 'User already exists' });

        UserModel.addUser({ username, password }, err => {
            if (err) return res.status(500).json({success: false, message: 'Error registering user' });
            return res.status(201).json({success: true, message: 'User registered successfully' });
        });
    });
});


router.get('/lobbies', requireLogin, (req, res) => {
  // If the user is logged in, serve the protected page
  res.sendFile(path.join(__dirname, '../protected_views/lobbies.html'));
});

router.get('/lobby', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, '../protected_views/lobby.html'));
});


module.exports = router;