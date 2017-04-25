var express = require('express');
var router = express.Router();
var keysDb = require('../db/key');
var checkValidKey = require('../middlewares/checkValidKey');

/*
  Example routes. There's no need to do anything here, but make sure that you
  understand these before going on to Sections 2 or 3!

  The first route is '/keys/newKey', which creates a new API key using the keysDb and
  then sends it to the requester as text. Note how we use res.send(newApiKey) for sending
  the data, and how the call to res.send() is in the callback for createKey.
  Also note how, if there is a database error, we defer to our error-handling middleware to
  deal with it. We'll be testing that you do the same in the code for the next sections!

  The second route is '/testKey'. We use a query string like "?key=abcdefg" to pass in the key
  to our route handlers.  So for instance if a user tries to GET '/testKey/?key=abcdefg', then we'd have
  req.query.key === 'abcdefg' and we'd be checking that 'abcdefg' was valid.

  Also note how we can use one call to put two (or three, or four) middleware functions
  on the same endpoint. Here, we do this to check if the key is valid before we send
  a success message.
*/

router.get('/keys/newKey', function (req, res, next) {
  keysDb.createKey(function (err, newApiKey) {
    if (err) {
      next(err);
    } else {
      res.send(newApiKey);
    }
  });
});

// This is the final middleware function we'll run for testKey.
// It sends a short success message back to the user. Note the use of req.query.
var sendTestKeySuccess = function (req, res) {
  res.send('Key ' + req.query.key + ' is valid!');
};

// This call tells the router that, when it receives a GET request to /testKey, it should use
// these two middleware functions.
router.get('/testKey', checkValidKey, sendTestKeySuccess);

module.exports = router;
