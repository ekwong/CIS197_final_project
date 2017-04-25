var mongo = require ('./mongo');
var uuid = require('node-uuid');

var getNewKey = function () {
  return uuid.v4();
};

module.exports = {
  createKey: function (callback) {
    var apiKey = getNewKey();
    var key = new mongo.Key({key: apiKey});
    key.save(function (error) {
      callback(error, apiKey);
    });
  },

  containsKey: function (apiKey, callback) {
    console.log('Checking if database contains key: %s', apiKey);
    mongo.Key.find({key: apiKey}, function (error, result) {
      if (error) {
        callback(error);
      } else {
        callback(null, result.length > 0);
      }
    });
  }
};
