const express = require("express");
const router = express.Router();
const { saveRedirectUrl, authenticateLogin, validatePassword } = require("../middleware");
const userController = require("../controllers/users");

router.post("/signup", validatePassword, userController.signup);

router.post("/login", saveRedirectUrl, authenticateLogin, userController.login);

router.get("/logout", userController.logout);

router.get('/api/current-user', userController.getCurrUser);

module.exports = router;