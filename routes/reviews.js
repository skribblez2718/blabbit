const express = require('express');
const router = express.Router({ mergeParams: true });

const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');
const reviews = require('../controllers/reviews');

const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.route('/:reviewId')
    .put(isLoggedIn, isReviewAuthor, catchAsync(reviews.editReview))
    .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router