var express = require('express');
var router = express.Router();

// Provided - do not modify
var credentalsAreValid = function (username, password) {
  return username === 'admin' && password === 'password';
};

// Implement the routes.
router.get('/loginAdmin', function (req, res, next) {
  res.render('login');
});

router.post('/loginAdmin', function (req, res, next) {
  if (credentalsAreValid(req.body.username, req.body.password)) {
    req.session.isAuthenticated = true;
    res.send('Logged in as admin');
  } else {
    res.redirect('/loginAdmin');
  }
});

module.exports = router;
