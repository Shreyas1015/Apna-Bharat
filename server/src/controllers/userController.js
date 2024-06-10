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
    "insert into user_profiles (uid,dob,gender,village,taluka,state,district,pincode,aadharCardBack,aadharCardFront ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
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

module.exports = {
  checkUserProfile,
  createUserProfile,
  fetchUserProfileData,
  drivers_document_auth,
  fetchUserData,
};
