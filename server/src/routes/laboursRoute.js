const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  updateLaboursAdditionalInfo,
  fetchLaboursAdditionalInfo,
  getAllJobs,
  applyForJob,
  fetchJobApplicationTracker,
  checkEligibility,
  fetchPersonalJobDataStatus,
} = require("../controllers/laboursController");
const router = express.Router();

router.post(
  "/updateFarmersAdditionalInfo",
  authenticateToken,
  updateLaboursAdditionalInfo
);
router.post(
  "/fetchLaboursAdditionalInfo",
  authenticateToken,
  fetchLaboursAdditionalInfo
);
router.post("/getAllJobs", authenticateToken, getAllJobs);
router.post("/applyForJob", authenticateToken, applyForJob);
router.post(
  "/fetchJobApplicationTracker",
  authenticateToken,
  fetchJobApplicationTracker
);
router.post("/checkEligibility", authenticateToken, checkEligibility);
router.post(
  "/fetchPersonalJobDataStatus",
  authenticateToken,
  fetchPersonalJobDataStatus
);

module.exports = router;
