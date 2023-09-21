const router = require("express").Router();
2333
// controller
const {register,verify,login,resendVerification, getAuthenticatedUser,} = require('../../app/controllers/api/authController')

// middleware
const {registerValidation,loginValidation,auth} = require("../../app/middleware/auth")

// routes
router.post("/register",registerValidation,register)
router.get("/verify/:token", verify);
router.post("/login", loginValidation, login);
router.post("/verify/resend", resendVerification);
router.get("/", auth, getAuthenticatedUser);


module.exports = router;