const express = require("express");
const router = express.Router({mergeParams: true});
const { validateReview, isLoggedin, isReviewOwner } = require("../middleware");
const reviewController = require("../controllers/reviews");


//Reviews
router.post("/", isLoggedin, validateReview, reviewController.createReview);

//Delete Review Route
router.delete("/:reviewId", isLoggedin, isReviewOwner, reviewController.deleteReview);

module.exports = router;