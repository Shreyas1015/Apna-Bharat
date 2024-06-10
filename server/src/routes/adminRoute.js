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
const router = express.Router();

router.post("/login", login);

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
