require("dotenv").config();
const asyncHand = require("express-async-handler");
const nodemailer = require("nodemailer");
const pool = require("../config/dbConfig");
const ImageKit = require("imagekit");
const { authenticateUser } = require("../middlewares/authMiddleware");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  logger: true,
  debug: true,
  secureConnection: false,
  auth: {
    user: "triptotours.com@gmail.com",
    pass: "vdgg zkjt ugxk xwso",
  },
  tls: {
    rejectUnauthorized: true,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: "triptotours.com@gmail.com",
    to: email,
    subject: "Email Verification OTP",
    text: `Your OTP for email verification is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
  console.log(
    "Email verification OTP sent to mail:",
    email,
    "and the OTP is:",
    otp
  );
}

async function sendOTPPhone(phone, otp) {
  // Implement code to send the OTP via SMS (not provided here)
  console.log(
    "Phone verification OTP sent to phone:",
    phone,
    "and the OTP is:",
    otp
  );
}

const imagekit = new ImageKit({
  publicKey: "public_ytabO1+xt+yMhICKtVeVGbWi/u8=",
  privateKey: "private_b65RyEF/ud3utxYKAJ8mvx7BWSw=",
  urlEndpoint: "https://ik.imagekit.io/TriptoServices",
});

const drivers_document_auth = asyncHand((req, res) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    console.log("Authentication Parameters:", authenticationParameters);
    res.json(authenticationParameters);
  } catch (error) {
    console.error("Error generating authentication parameters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const sendProfileUpdateEmailVerification = asyncHand(async (req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const otp = generateOTP();

    try {
      const selectQuery = "SELECT email FROM users WHERE uid = $1";
      pool.query(selectQuery, [decryptedUID], (selectErr, selectResult) => {
        if (selectErr) {
          console.error("Error fetching user email:", selectErr);
          return res.status(500).json({ success: false, email: null });
        }

        const email = selectResult.rows[0].email;

        pool.query(
          "INSERT INTO email_verification_otps (email, otp, created_at) VALUES ($1, $2, NOW())",
          [email, otp],
          (insertErr) => {
            if (insertErr) {
              console.error(
                "Error saving email OTP to the database:",
                insertErr
              );
              return res.status(500).json({ success: false, email: null });
            }

            sendOTPEmail(email, otp);
            res.status(200).json({ success: true, email });
          }
        );
      });
    } catch (error) {
      console.error("Error sending email verification code:", error);
      res.status(500).json({ success: false, email: null });
    }
  });
});

const fetchFarmersProfileData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const searchQuery =
      "select * from users join user_profiles on users.uid = user_profiles.uid where users.uid = $1";

    pool.query(searchQuery, [decryptedUID], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error : ", err });
        console.log("Internal Server Error : ", err);
      } else {
        console.log(result.rows[0]);
        res.status(200).json(result.rows[0]);
      }
    });
  });
});

const fetchFarmersProfileIMG = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;

    const query =
      "select profile_img from farmers_profile_management where uid = $1";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error(`Failed to execute ${query}`, err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        // Check if any rows are returned
        if (result.rows.length > 0) {
          console.log("Image link fetched", result.rows[0].profile_img);
          res.status(200).json({ link: result.rows[0].profile_img });
        } else {
          console.log("No data found for the given UID");
          res.status(404).json({ message: "No image found for the given UID" });
        }
      }
    });
  });
});

const updateFarmersProfile = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { updatedProfileData, decryptedUID } = req.body;

    const updateQuery =
      "UPDATE users SET name = $1, email = $2, phone_number = $3 WHERE uid = $4";
    const updateValues = [
      updatedProfileData.name,
      updatedProfileData.email,
      updatedProfileData.phone_number,
      decryptedUID,
    ];

    pool.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error(`Error updating profile: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        console.log("Profile updated: ", result);
        return res
          .status(200)
          .json({ message: "Profile Updated Successfully" });
      }
    });
  });
});

const uploadFarmersProfileImage = asyncHand(async (req, res) => {
  authenticateUser(req, res, async () => {
    const { formData, decryptedUID } = req.body;

    try {
      // First, retrieve the up_id from user_profiles
      const selectQuery = "SELECT up_id FROM user_profiles WHERE uid = $1";
      const selectResult = await pool.query(selectQuery, [decryptedUID]);

      if (selectResult.rows.length === 0) {
        console.error("No user profile found for the given UID:", decryptedUID);
        return res.status(404).json({ error: "User profile not found" });
      }

      const upId = selectResult.rows[0].up_id;

      const checkUidQuery =
        "SELECT COUNT(*) AS count FROM farmers_profile_management WHERE uid = $1";
      const checkUidResult = await pool.query(checkUidQuery, [decryptedUID]);
      const uidExists = checkUidResult.rows[0].count > 0;

      if (uidExists) {
        const updateQuery =
          "UPDATE farmers_profile_management SET profile_img = $1, up_id = $2 WHERE uid = $3";
        await pool.query(updateQuery, [
          formData.profile_img,
          upId,
          decryptedUID,
        ]);
        console.log("Profile Image and UP_ID Updated");
        res.status(200).json({ message: "Profile Image and UP_ID Updated" });
      } else {
        const insertQuery =
          "INSERT INTO farmers_profile_management (uid, profile_img, up_id) VALUES ($1, $2, $3)";
        await pool.query(insertQuery, [
          decryptedUID,
          formData.profile_img,
          upId,
        ]);
        console.log("Profile Image and UP_ID Inserted");
        res.status(200).json({ message: "Profile Image and UP_ID Inserted" });
      }
    } catch (error) {
      console.error("Internal Server error: ", error);
      res.status(500).json({ error: "Internal Server error" });
    }
  });
});

const updateFarmersAddress = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, updatedAddressData } = req.body;
    const updateQuery =
      "UPDATE user_profiles SET village = $1, taluka = $2, district = $3, state = $4, pincode = $5 WHERE uid = $6";
    const updateValues = [
      updatedAddressData.village,
      updatedAddressData.taluka,
      updatedAddressData.district,
      updatedAddressData.state,
      updatedAddressData.pincode,
      decryptedUID,
    ];

    pool.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error(`Error updating address: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json({ message: "Address Updated" });
      }
    });
  });
});

const fetchFarmersAddress = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query =
      "SELECT village, taluka, district, state, pincode FROM user_profiles WHERE uid = $1";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error(`Error fetching address data: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        console.log("Address data fetched: ", result.rows[0]);
        return res.status(200).json(result.rows[0]);
      }
    });
  });
});

const updateFarmersFarmDetails = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, updatedFarmData } = req.body;
    console.log("Live Stocks = ", updatedFarmData.live_stocks);
    const updateQuery =
      "UPDATE farmers_profile_management SET farm_name = $1, farm_size = $2, farm_type = $3, crops_grown = $4, irrigation_methods = $5, storage_facilities = $6, live_stocks = $7::jsonb, pesticides_used = $8::jsonb, farming_methods = $9 WHERE uid = $10";

    const updateValues = [
      updatedFarmData.farm_name,
      updatedFarmData.farm_size,
      updatedFarmData.farm_type,
      updatedFarmData.crops_grown,
      updatedFarmData.irrigation_methods,
      updatedFarmData.storage_facilities,
      updatedFarmData.live_stocks,
      updatedFarmData.pesticides_used,
      updatedFarmData.farming_methods,
      decryptedUID,
    ];

    pool.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error(`Error updating farm details: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json({ message: "Farm Details Updated" });
      }
    });
  });
});

const fetchFarmersFarmData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query =
      "SELECT farm_name, farm_size, farm_type, crops_grown, irrigation_methods, storage_facilities, live_stocks, pesticides_used, farming_methods FROM farmers_profile_management WHERE uid = $1";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error(`Error fetching farm data: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json(result.rows[0]);
      }
    });
  });
});

const farmerJobForm = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, fullFormData } = req.body;

    const insertQuery =
      "INSERT INTO jobs (uid, jobTitle, jobDescription, jobLocation, startDate, endDate, workingHours, wageSalary, qualificationsSkills, applicationDeadline, aadharCard, kissanCard) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";

    const insertValues = [
      decryptedUID,
      fullFormData.jobTitle,
      fullFormData.jobDescription,
      fullFormData.jobLocation,
      fullFormData.startDate,
      fullFormData.endDate,
      fullFormData.workingHours,
      fullFormData.wageSalary,
      fullFormData.qualificationsSkills,
      fullFormData.applicationDeadline,
      fullFormData.aadharCard,
      fullFormData.kisanCreditCard,
    ];

    pool.query(insertQuery, insertValues, (err, result) => {
      if (err) {
        console.error(`Error inserting job form data: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json({ message: "Form Submitted" });
      }
    });
  });
});

const getAllJobs = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query = "SELECT * FROM jobs WHERE uid = $1";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error(`Error fetching all jobs: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json(result.rows);
      }
    });
  });
});

const deleteJob = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, jobId } = req.body;
    const deleteQuery = "DELETE FROM jobs WHERE uid = $1 AND jid = $2";
    pool.query(deleteQuery, [decryptedUID, jobId], (err, result) => {
      if (err) {
        console.error(`Error deleting job: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Job not found or unauthorized access" });
      } else {
        return res.status(200).json({ message: "Job Deleted" });
      }
    });
  });
});

const updateJobDetails = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, jid, job } = req.body;
    console.log("Job Details = ", job);
    const updateQuery =
      "UPDATE jobs SET jobTitle = $1, jobDescription = $2, jobLocation = $3, startDate = $4, endDate = $5, workingHours = $6, wageSalary = $7, qualificationsSkills = $8, applicationDeadline = $9, aadharCard = $10, kissanCard = $11 WHERE uid = $12 AND jid = $13";
    pool.query(
      updateQuery,
      [
        job.jobtitle,
        job.jobdescription,
        job.joblocation,
        job.startdate,
        job.enddate,
        job.workinghours,
        job.wagesalary,
        job.qualificationsskills,
        job.applicationdeadline,
        job.aadharcard,
        job.kissancard,
        decryptedUID,
        jid,
      ],
      (err, result) => {
        if (err) {
          console.error(`Error updating job details: ${err}`);
          return res.status(500).json({ error: "Server Error" });
        } else {
          return res.status(200).json({ message: "Job Details Updated" });
        }
      }
    );
  });
});

const fetchParticularJobDetails = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, jid } = req.body;
    const query =
      "SELECT * FROM jobs join users on jobs.uid = users.uid WHERE jobs.uid = $1 AND jobs.jid = $2";
    pool.query(query, [decryptedUID, jid], (err, result) => {
      if (err) {
        console.error(`Error fetching job details: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json(result.rows[0]);
      }
    });
  });
});

const updateJobStatus = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID, jid } = req.body;
    const updateQuery =
      "UPDATE jobs SET status = 1 WHERE uid = $2 AND jid = $3";
    pool.query(updateQuery, [decryptedUID, jid], (err, result) => {
      if (err) {
        console.error(`Error updating job status: ${err}`);
        return res.status(500).json({ error: "Server Error" });
      }
    });
  });
});

module.exports = {
  drivers_document_auth,
  farmerJobForm,
  updateFarmersAddress,
  sendProfileUpdateEmailVerification,
  fetchFarmersProfileData,
  fetchFarmersProfileIMG,
  updateFarmersProfile,
  uploadFarmersProfileImage,
  fetchFarmersAddress,
  updateFarmersFarmDetails,
  fetchFarmersFarmData,
  getAllJobs,
  deleteJob,
  updateJobDetails,
  fetchParticularJobDetails,
  updateJobStatus,
};
