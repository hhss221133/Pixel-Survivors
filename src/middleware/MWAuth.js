function requireLogin(req, res, next) {
  if (req.session.username) {
    // User is logged in, proceed to the next function
    next();
  } else {
    // User is not logged in
    res.redirect('/');
  }
}

module.exports = requireLogin;