const express = require("express");
const {
  createUserProfile,
  fetchUserProfileData,
  checkUserProfile,
  drivers_document_auth,
  fetchUserData,
  updateUsersProfile,
  fetchUserProfileIMG,
  uploadUserProfileImage,
} = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/user-profile", authenticateToken, createUserProfile);
router.post("/fetchUserProfileData", authenticateToken, fetchUserProfileData);
router.post("/checkUserProfile", authenticateToken, checkUserProfile);
router.post("/fetchUserData", authenticateToken, fetchUserData);
router.get("/drivers_document_auth", drivers_document_auth);
router.post("/updateUsersProfile", authenticateToken, updateUsersProfile);
router.post("/fetchUserProfileIMG", authenticateToken, fetchUserProfileIMG);
router.post(
  "/uploadUserProfileImage",
  authenticateToken,
  uploadUserProfileImage
);

module.exports = router;
