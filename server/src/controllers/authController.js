require("dotenv").config();
const asyncHand = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateSecretKey = require("../utils/generateSecretKey");
const pool = require("../config/dbConfig");
const nodemailer = require("nodemailer");
const generateRefreshToken = require("../utils/generateRefreshToken");
const { verifyRefreshToken } = require("../middlewares/authMiddleware");

const secretKey = process.env.DB_SECRET_KEY || generateSecretKey();
console.log("SecretKey :", secretKey);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  logger: true,
  debug: true,
  securepool: false,
  auth: {
    user: 'triptotours.com@gmail.com',
    pass: 'vdgg zkjt ugxk xwso',
  },
  tls: {
    rejectUnauthorized: true
  }
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
  console.log(
    "Phone verification OTP sent to phone:",
    phone,
    "and the OTP is:",
    otp
  );
}

const login = asyncHand((req, res) => {
  const { email } = req.body;
  const searchQuery = "SELECT * from users where email = $1";

  try {
    pool.query(searchQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error running the query : ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      } else {
        const user = results.rows[0];
        const uid = user.uid;
        const email = user.email;
        const user_type = user.user_type;

        const token = jwt.sign({ email: email }, secretKey, {
          expiresIn: "1h",
        });

        console.log("Generated Token:", token);

        const refreshToken = generateRefreshToken(email);
        console.log("Refresh Token:", refreshToken);

        res.cookie("token", token, {
          httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, { httpOnly: true });

        res.status(200).json({
          message: "Logged in successfully",
          email: email,
          uid: uid,
          user_type: user_type,
        });
      }
    });
  } catch (error) {
    console.error("Error running the query : ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const refresh = asyncHand((req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) return res.sendStatus(401);

  const user = verifyRefreshToken(refreshToken);
  if (!user) return res.sendStatus(403);

  console.log("Received Refresh Token:", refreshToken);

  const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
  const newRefreshToken = generateRefreshToken(user.email);

  console.log("New Access Token:", token);
  console.log("New Refresh Token:", newRefreshToken);

  res.cookie("token", token, { httpOnly: true });
  res.cookie("refreshToken", newRefreshToken, { httpOnly: true });
  res.sendStatus(200);
});

const handleUserExists = (res) => {
  return res.status(400).json({ error: "User already exists" });
};

const handleServerError = (res, errMessage) => {
  console.error(errMessage);
  return res.status(500).json({ error: "Internal Server Error" });
};

const handleSuccess = (res, message) => {
  console.log(message);
  return res.status(200).json({ message });
};

const sendEmailVerification = asyncHand(async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    pool.query(
      "INSERT INTO email_verification_otps (email, otp, created_at) VALUES ($1, $2, NOW())",
      [email, otp],
      (err) => {
        if (err) {
          console.error("Error saving email OTP to the database:", err);
          return res.status(500).json({ success: false });
        }

        sendOTPEmail(email, otp);
        res.status(200).json({ success: true });
      }
    );
  } catch (error) {
    console.error("Error sending email verification code:", error);
    res.status(500).json({ success: false });
  }
});

const sendLoginEmailVerification = asyncHand(async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (err, result) => {
        if (err) {
          console.error("Error checking email existence:", err);
          return res.status(500).json({ success: false });
        }

        if (result.rows.length === 0) {
          return res.status(400).json({ error: "User not registered" });
        }

        pool.query(
          "INSERT INTO email_verification_otps (email, otp, created_at) VALUES ($1, $2, NOW())",
          [email, otp],
          (err) => {
            if (err) {
              console.error("Error saving email OTP to the database:", err);
              return res.status(500).json({ success: false });
            }

            sendOTPEmail(email, otp);
            res.status(200).json({ success: true });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error sending email verification code:", error);
    res.status(500).json({ success: false });
  }
});

const confirmEmail = asyncHand(async (req, res) => {
  const { email, emailOtp } = req.body;
  // Verify the sent OTP
  const verifyEmailOTPQuery = "SELECT * FROM email_verification_otps WHERE email = $1 AND otp = $2 AND created_at >= NOW() - INTERVAL '15 minutes'::interval";

  try {
    pool.query(
      verifyEmailOTPQuery,
      [email, emailOtp],
      (err, emailOTPResult) => {
        if (err) {
          console.error("Error during email verification:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (emailOTPResult.rows.length === 0) {
          return res.status(400).json({
            error:
              "Invalid email OTP or OTP expired. Please request a new OTP.",
          });
        }

        res.status(200).json({ success: true });
      }
    );
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// const sendPhoneVerification = asyncHand(async (req, res) => {
//   const { phone } = req.body;
//   const otp = generateOTP();

//   try {
//     await query(
//       "INSERT INTO phone_verification_otps (phone_number, otp, created_at) VALUES (?, ?, NOW())",
//       [phone, otp]
//     );

//     res.json({ success: true });
//   } catch (error) {
//     console.error("Error sending phone verification code:", error);
//     res.json({ success: false });
//   }

//   // Verify the sent OTP
//   const verifyPhoneOTPQuery =
//     "SELECT * FROM phone_verification_otps WHERE phone_number = ? AND otp = ? AND created_at >= NOW() - INTERVAL 15 MINUTE";
//   const phoneOTPResult = await query(verifyPhoneOTPQuery, [phone, otp]);

//   if (phoneOTPResult.length === 0) {
//     return res.status(400).json({ error: "Invalid phone OTP or OTP expired" });
//   }
// });

const signUp = asyncHand(async (req, res) => {
  const formData = req.body;

  console.log("Form Data:", formData);

  try {
    // Check if the user already exists
    const searchQuery = "SELECT * FROM users WHERE email = $1";
    pool.query(searchQuery, [formData.email], async (err, result) => {
      if (err) {
        return handleServerError(res, "Error running the query: " + err);
      }

      if (result.rows.length > 0) {
        return handleUserExists(res);
      }

      // User does not exist, proceed with insertion
      const insertUserQuery =
        "INSERT INTO users (name, email, phone_number, user_type) VALUES ($1, $2, $3, $4)";
      pool.query(
        insertUserQuery,
        [
          formData.name,
          formData.email,
          formData.phone_number,
          formData.user_type,
        ],
        (err, userResult) => {
          if (err) {
            return handleServerError(
              res,
              "Error inserting data into users: " + err
            );
          } else {
            return handleSuccess(res, "User Registered Successfully");
          }
        }
      );
    });
  } catch (error) {
    return handleServerError(res, "Error inserting data: " + error);
  }
});

const logout = asyncHand((req, res) => {
  res.clearCookie("token", { httpOnly: true });
  res.clearCookie("refreshToken", { httpOnly: true });

  res.status(200).json({ message: "Logout successful" });
});

const imageAuthenticator = asyncHand((req, res) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    console.log("Authentication Parameters:", authenticationParameters);
    res.json(authenticationParameters);
  } catch (error) {
    console.error("Error generating authentication parameters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  login,
  signUp,
  sendEmailVerification,
  // sendPhoneVerification,
  confirmEmail,
  sendLoginEmailVerification,
  refresh,
  logout,
  imageAuthenticator
};
