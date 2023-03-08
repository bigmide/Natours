const express = require('express');

const router = express.Router({ mergeParams: true });
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserId,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'guides'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'guides'),
    reviewController.updateReview
  );

module.exports = router;
