require("dotenv").config();
const asyncHand = require("express-async-handler");
const pool = require("../config/dbConfig");
const ImageKit = require("imagekit");
const { authenticateUser } = require("../middlewares/authMiddleware");

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

const checkUserProfile = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const searchQuery = "select count(*) from user_profiles where uid = $1";

    pool.query(searchQuery, [decryptedUID], (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error : ", err });
        console.log("Internal Server Error : ", err);
      } else {
        res.status(200).json(result.rows[0].count);
      }
    });
  });
});

const fetchUserProfileData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const searchQuery = "select * from users where uid = $1";

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

const createUserProfile = asyncHand((req, res) => {
  const { decryptedUID, fullFormData } = req.body;
  const insertedQuery =
    "insert into user_profiles (uid,dob,gender,village,taluka,state,district,pincode,aadharCardBack,aadharCardFront ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) on conflict (uid) do update set dob = $2, gender = $3, village = $4, taluka = $5, state = $6, district = $7, pincode = $8, aadharCardBack = $9, aadharCardFront = $10";
  pool.query(
    insertedQuery,
    [
      decryptedUID,
      fullFormData.dob,
      fullFormData.gender,
      fullFormData.village,
      fullFormData.taluka,
      fullFormData.state,
      fullFormData.district,
      fullFormData.pincode,
      fullFormData.aadharCardBack,
      fullFormData.aadharCardFront,
    ],

    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error : ", err });
        console.log("Internal Server Error : ", err);
      } else {
        console.log(result.rowCount);
        res.status(200).json({ status: "success" });
      }
    }
  );
});

const fetchUserData = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;
    const searchQuery = "select * from user_profiles where uid = $1";

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

const updateUsersProfile = asyncHand((req, res) => {
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

const fetchUserProfileIMG = asyncHand((req, res) => {
  authenticateUser(req, res, () => {
    const { decryptedUID } = req.body;

    const query = "select profile_img from user_profiles where uid = $1";
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

const uploadUserProfileImage = asyncHand(async (req, res) => {
  authenticateUser(req, res, async () => {
    const { formData, decryptedUID } = req.body;

    try {
      const query =
        "INSERT INTO user_profiles (uid, profile_img) VALUES ($1, $2) ON CONFLICT (uid) DO UPDATE SET profile_img = $2 WHERE user_profiles.uid = $1";

      pool.query(query, [decryptedUID, formData.profile_img], (err, result) => {
        if (err) {
          console.error("Internal Server Error : ", err);
          res.status(500).json({ message: "Internal Server error" });
        } else {
          console.log("Profile Image and UP_ID Inserted");
          res.status(200).json({ message: "Profile Image Uploaded" });
        }
      });
    } catch (error) {
      console.error("Internal Server error: ", error);
      res.status(500).json({ error: "Internal Server error" });
    }
  });
});

module.exports = {
  checkUserProfile,
  createUserProfile,
  fetchUserProfileData,
  drivers_document_auth,
  fetchUserData,
  updateUsersProfile,
  fetchUserProfileIMG,
  uploadUserProfileImage,
};
