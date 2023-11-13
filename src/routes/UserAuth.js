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

router.post('/logout', (req, res) => {
  if(req.session.username) {
    req.session.destroy(err => {
      if(err) {
          // console.error('Session destruction error:', err);
        res.status(500).json({ success: false, message: 'Could not log out, please try again'});
      } else {
        res.clearCookie('connect.sid'); 
        res.status(200).json({ success: true, message: 'Successfully logged out'});
      }
    });
  } 
  else {
    res.status(400).json({ success: false, message: 'You are not logged in'});
  }
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
  // res.sendFile(path.join(__dirname, '../protected_views/lobbies.html'));
  res.render('lobbies', {username: req.session.username});
});

router.get('/lobby', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, '../protected_views/lobby.html'));
});

// router.get('/game', requireLogin, (req, res) => {
//   res.sendFile(path.join(__dirname, '../protected_views/game.html'));
// });


module.exports = router;