const express = require("express");
const authController = require("../controller/auth.controller");
const router = express.Router();

/* Register: /api/auth/register */
router.post("/register", authController.register);
/* Login: /api/auth/login */
router.post("/login", authController.loginUser);

router.post("/logout", authController.logoutUser);

module.exports = router;
