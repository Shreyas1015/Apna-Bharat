const express = require("express");
const {
  login,
  signUp,
  refresh,
  logout,
  imageAuthenticator,
  sendEmailVerification,
  sendLoginEmailVerification,
  confirmEmail,
} = require("../controllers/authController");
const { forgetPass, resetPass } = require("../controllers/otpController");
const router = express.Router();

router.post("/login", login);
router.post("/forget_password", forgetPass);
router.post("/reset_password", resetPass);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/imageAuthenticator", imageAuthenticator);
router.post("/signup_with_verification", signUp);
// router.post("/sendPhoneVerification", sendPhoneVerification);
router.post("/sendEmailVerification", sendEmailVerification);
router.post("/sendLoginEmailVerification", sendLoginEmailVerification);
router.post("/confirmEmail", confirmEmail);
router.post("/refresh", refresh);


module.exports = router;
