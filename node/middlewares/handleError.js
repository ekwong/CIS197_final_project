
// TODO: Write the handleError middleware.
// This function must be an express error handling middleware

var handleError = function (err, req, res, next) {
  res.render('errorPage', {statusCode: res.statusCode, message: err.message, stackTrace: err.stack});
}; // Set this variable equal to your own handleError function!


// Export the middleware function for use in app.js
module.exports = handleError;
