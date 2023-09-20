const router = require("express").Router();

// controller
const {register,verify,login} = require('../../app/controllers/api/authController')

// middleware
const {registerValidation,loginValidation} = require("../../app/middleware/auth")

// routes
router.post("/register",registerValidation,register)
router.get("/verify/:token", verify);
router.post("/login", loginValidation, login);

module.exports = router;