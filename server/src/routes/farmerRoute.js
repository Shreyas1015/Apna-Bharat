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
  farmerJobForm,
  getAllJobs,
  deleteJob,
  updateJobDetails,
  fetchParticularJobDetails,
  updateJobStatus,
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
router.post("/farmerJobForm", authenticateToken, farmerJobForm);
router.post("/getAllJobs", authenticateToken, getAllJobs);
router.delete("/deleteJob", authenticateToken, deleteJob);
router.post("/updateJobDetails", authenticateToken, updateJobDetails);
router.post(
  "/fetchParticularJobDetails",
  authenticateToken,
  fetchParticularJobDetails
);
router.post("/updateJobStatus", authenticateToken, updateJobStatus);

module.exports = router;
