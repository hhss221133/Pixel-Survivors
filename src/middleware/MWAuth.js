function requireLogin(req, res, next) {
    if (req.session.username) {
      // User is logged in, proceed to the next function
      next();
    } else {
      // User is not logged in
      res.status(401).json({ success: false, message: 'You are not logged in' });
    }
}

module.exports = requireLogin;