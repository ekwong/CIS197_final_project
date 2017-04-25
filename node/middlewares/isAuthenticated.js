/*
  TODO: Write the isAuthenticated middleware.
  This function should be a regular Express middleware which calls next()
  if the request is authenticated, and if not, redirects to '/loginAdmin'.

  Remember that, if a request is authenticated, then req.session will have an
  isAuthenticated value of true.
*/
var isAuthenticated = function (req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/loginAdmin');
  }
}; // Set this variable equal to your own isAuthenticated function!


// Export the middleware function for use in app.js
module.exports = isAuthenticated;
