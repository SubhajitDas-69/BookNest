const express = require("express");
const router = express.Router();
const { isLoggedin } = require("../middleware");
const paymentController = require("../controllers/payments");


router.get("/:orderId/create-payment-link", isLoggedin, paymentController.createPaymentLink);

module.exports = router;
