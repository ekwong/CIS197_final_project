var mongo = require('./mongo');

module.exports = {
  getAllReviews: function (callback) {
    mongo.Reviews.find(function (error, reviews) {
      callback(error, reviews);
    });
  },

  getReviewsByClassName: function (className, callback) {
    mongo.Reviews.find({className: className}).sort({semester: 'desc'}).exec(function (error, reviews) {
      callback(error, reviews);
    });
  },

  addReview: function (reviewData, callback) {
    var review = new mongo.Reviews(reviewData);
    review.save(function (error) {
      callback(error);
    });
  }
};
