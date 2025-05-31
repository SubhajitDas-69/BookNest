const express = require("express");
const router = express.Router();
const {isLoggedin} = require("../middleware");
const cartController = require("../controllers/carts");

router.get('/', isLoggedin, cartController.showCart);

router.post("/add/:id", isLoggedin, cartController.addToCart);

router.delete("/:itemId", isLoggedin, cartController.removeItemFromCartAndDeleteCart);

router.put("/:itemId", isLoggedin, cartController.updateCart);
  
module.exports = router;