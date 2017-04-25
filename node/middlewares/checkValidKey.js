var keysDb = require('../db/key');

// This function checks if a given API key is valid.
// The callback has type function (err, isValid) where:
// 1. err is some database error if one was thrown during lookup, otherwise null/undefined
// 2. isValid is a boolean indicating whether the key is valid
var isAPIKeyValid = function (apiKey, callback) {
  keysDb.containsKey(apiKey, callback);
};

/* TODO: Implement the checkValidKey middleware function.
  Check if the API key associated with a request is valid.
  If valid, go on to the next middleware in the chain.
  If invalid, set response status to 403 (forbidden) and pass a new Error('Invalid key') to next().

  Remember: the API key is passed in a query string.
*/

var checkValidKey = function (req, res, next) {
  isAPIKeyValid(req.query.key, function (err, isValid) {
    if (err) {
      next(err);
    } else if (isValid) {
      next();
    } else {
      res.status(403);
      next(new Error('Invalid key'));
    }
  });
}; // Set this variable equal to your own checkValidKey function!


module.exports = checkValidKey;
