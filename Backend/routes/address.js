const express = require("express");
const router = express.Router();
const { isLoggedin } = require("../middleware");
const addressController = require("../controllers/addresses");

router.get("/all", isLoggedin, addressController.allAddress);

router.get("/:id?", isLoggedin, addressController.renderSelectAddressForm);

router.post("/create", isLoggedin, addressController.createAddress);

router.get("/:id/edit", addressController.getAddressById);

router.put("/:id", addressController.updateAddress);

router.delete("/:id", addressController.deleteAddress);

module.exports = router;