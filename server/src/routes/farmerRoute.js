const express = require("express");

const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  sendProfileUpdateEmailVerification,
  drivers_document_auth,
  fetchFarmersProfileData,
  fetchFarmersProfileIMG,
  uploadFarmersProfileImage,
  updateFarmersProfile,
  updateFarmersAddress,
  fetchFarmersAddress,
  updateFarmersFarmDetails,
  fetchFarmersFarmData,
} = require("../controllers/farmerController");
const router = express.Router();

router.get("/drivers_document_auth", drivers_document_auth);
router.post(
  "/sendProfileUpdateEmailVerification",
  authenticateToken,
  sendProfileUpdateEmailVerification
);
router.post(
  "/fetchFarmersProfileData",
  authenticateToken,
  fetchFarmersProfileData
);
router.post(
  "/fetchFarmersProfileIMG",
  authenticateToken,
  fetchFarmersProfileIMG
);
router.post("/updateFarmersProfile", authenticateToken, updateFarmersProfile);

router.post(
  "/uploadFarmersProfileImage",
  authenticateToken,
  uploadFarmersProfileImage
);
router.post("/fetchFarmersAddress", authenticateToken, fetchFarmersAddress);
router.post("/updateFarmersAddress", authenticateToken, updateFarmersAddress);
router.post(
  "/updateFarmersFarmDetails",
  authenticateToken,
  updateFarmersFarmDetails
);
router.post("/fetchFarmersFarmData", authenticateToken, fetchFarmersFarmData);

module.exports = router;
