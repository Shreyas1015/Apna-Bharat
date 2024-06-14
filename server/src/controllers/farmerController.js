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
    const updateQuery =
      "INSERT INTO farmers_profile_management (uid, farm_name, farm_size, farm_type, crops_grown, irrigation_methods, storage_facilities, live_stocks, pesticides_used, farming_methods) VALUES ($10, $1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9) ON CONFLICT (uid) DO UPDATE SET farm_name = $1, farm_size = $2, farm_type = $3, crops_grown = $4, irrigation_methods = $5, storage_facilities = $6, live_stocks = $7::jsonb, pesticides_used = $8::jsonb, farming_methods = $9 WHERE farmers_profile_management.uid = $10";

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
    const query = "SELECT * FROM jobs WHERE uid = $1 order by jid desc";
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

const fetchAppliedApplications = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const query =
      "SELECT j.*, jat.who_applied, jat.job_status, jat.applied_date, lpm.skills AS labourer_skills, lpm.qualification AS labourer_qualification, lpm.experience AS labourer_experience, up.dob AS labourer_dob, up.gender AS labourer_gender, up.village AS labourer_village, up.taluka AS labourer_taluka, up.district AS labourer_district, up.state AS labourer_state, up.pincode AS labourer_pincode, up.aadharcardfront AS labourer_aadharcardfront, up.aadharcardback AS labourer_aadharcardback, up.profile_img AS labourer_profile_img, u.name AS user_name, u.email AS user_email, u.phone_number AS user_phone_number, u.user_type AS user_type FROM jobs j JOIN jobs_application_tracker jat ON j.jid = jat.jid JOIN labourers_profile_management lpm ON jat.who_applied::integer = lpm.uid JOIN user_profiles up ON lpm.uid = up.uid JOIN users u ON up.uid = u.uid WHERE j.uid = $1; ";
    pool.query(query, [decryptedUID], (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal Server error" });
      } else {
        res.status(200).json(result.rows);
      }
    });
  });
});

const rejectApplication = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { jobId } = req.body;
    const query =
      "update jobs_application_tracker set job_status = 3 where jid = $1";
    pool.query(query, [jobId], (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Updated jobs_application_tracker" });
      }
    });
  });
});

const acceptApplication = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { jobId } = req.body;
    const query =
      "update jobs_application_tracker set job_status = 2 where jid = $1";
    pool.query(query, [jobId], (err, result) => {
      if (err) {
        console.error("Internal Server Error : ", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Updated jobs_application_tracker" });
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
  fetchFarmersAddress,
  updateFarmersFarmDetails,
  fetchFarmersFarmData,
  getAllJobs,
  deleteJob,
  updateJobDetails,
  fetchParticularJobDetails,
  updateJobStatus,
  fetchAppliedApplications,
  acceptApplication,
  rejectApplication,
};
