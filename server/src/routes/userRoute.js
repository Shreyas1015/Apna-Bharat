const express = require("express");
const {
  createUserProfile,
  fetchUserProfileData,
  checkUserProfile,
  drivers_document_auth,
  fetchUserData,
} = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/user-profile", authenticateToken, createUserProfile);
router.post("/fetchUserProfileData", authenticateToken, fetchUserProfileData);
router.post("/checkUserProfile", authenticateToken, checkUserProfile);
router.post("/fetchUserData", authenticateToken, fetchUserData);
router.get("/drivers_document_auth", drivers_document_auth);

module.exports = router;
