/*
  There's nothing to do in this file, but it's a good example of two important things:
  1. Setting the status code of a response with res.status
  2. Rendering a page. Here, we're rendering 'errorPage' (views/errorPage.html) with
     two local variables ('statusCode' and 'message').
  Make sure to look this over if you're stuck on handleError!
*/

module.exports = function handleError(req, res, next) {
  res.status(404);
  res.render('errorPage', {
    statusCode: res.statusCode,
    message: 'Page not found.'
  });
};
