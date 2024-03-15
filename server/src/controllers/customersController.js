require("dotenv").config();
const asyncHand = require("express-async-handler");
const pool = require("../config/dbConfig");
const ImageKit = require("imagekit");
const { authenticateUser } = require("../middlewares/authMiddleware");
const stripe = require("stripe")(
  "sk_test_51NR99USFBsMizJtqgugjwCzWBEka7nr355hR294tm3VNMVUxrz0YoIq1PY89wStYr0Fd6lAx1pP5xfp7LxdKELnl008ahGLLka"
);

const imagekit = new ImageKit({
  publicKey: "public_ytabO1+xt+yMhICKtVeVGbWi/u8=",
  privateKey: "private_b65RyEF/ud3utxYKAJ8mvx7BWSw=",
  urlEndpoint: "https://ik.imagekit.io/TriptoServices",
});

const subscribers = asyncHand((req, res) => {
  const formData = req.body;
  const searchQuery = "SELECT * from subscribers where email = $1";
  try {
    pool.query(searchQuery, [formData.email], (err, result) => {
      if (err) {
        console.error("Error running the query: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.rows.length > 0) {
        return res
          .status(401)
          .json({ error: "Already Subscribed with this mail" });
      } else {
        const query = "INSERT INTO subscribers (email) VALUES ( $1 )";
        pool.query(query, [formData.email], (err, result) => {
          if (err) {
            console.error("Internal Server Error : ", err);
            res.status(500).json({ error: "Internal Server error" });
          } else {
            res.status(200).json({ message: "Subscribed" });
          }
        });
      }
    });
  } catch (error) {
    console.error("Error Running this Function : ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const createCheckoutSession = asyncHand((req, res) => {
  authenticateUser(req, res, async () => {
    const lineItems = req.body.lineItems;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:3000/cancel",
      });

      console.log(session);
      res.json({ id: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while creating the checkout session.",
      });
    }
  });
});

const handlePaymentSuccess = asyncHand((req, res) => {
  authenticateUser(req, res, async () => {
    const { id, decryptedUID } = req.body;
    console.log("Received Checkout Session ID:", id);

    try {
      const session = await stripe.checkout.sessions.retrieve(id);

      if (session.payment_status === "paid") {
        console.log("Meta Data : ", decryptedUID);
        const updateQuery =
          "UPDATE shopping_cart SET isordered = 1 WHERE uid = $1 ";
        pool.query(updateQuery, [decryptedUID], (err, result) => {
          if (err) {
            console.error("Internal Server Error :", err);
            res.status(500).json({ error: "Payment was not successful." });
          } else {
            console.log("Cart Cleared");
            res.status(200).json({ status: "success" });
          }
        });
      } else {
        res.status(400).json({ error: "Payment was not successful." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the payment." });
    }
  });
});

module.exports = {
  subscribers,
  createCheckoutSession,
  handlePaymentSuccess,
};
