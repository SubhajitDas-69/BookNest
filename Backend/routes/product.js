const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const ExpressError = require("../utils/ExpressError");
const {isLoggedin, validateProducts, isAdmin} = require("../middleware");
const Cart = require("../models/cart");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({storage});
const productController = require("../controllers/products");

//AllProduct route
router.get("/", productController.allProducts);

// Create route
router.post("/", isLoggedin, isAdmin, upload.fields([{ name: 'product[image]', maxCount: 1 },
    { name: 'product[pdf]', maxCount: 1 }
  ]), validateProducts, productController.createProduct);

//Show route
router.get("/:id", productController.showProduct);

//Update product
router.put("/:id", isLoggedin, isAdmin, upload.fields([
  { name: 'product[image]', maxCount: 1 },
  { name: 'product[pdf]', maxCount: 1 }
]), validateProducts, productController.updateProduct);


//Delete product
router.delete("/:id", isLoggedin, isAdmin, productController.deleteProduct);

module.exports = router;