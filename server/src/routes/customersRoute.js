const express = require("express");
const {
  subscribers,
  fetchHeadphonesData,
  fetchParticularProductData,
  addToCart,
  fetchAllProductsInCart,
  fetchTotalNumberOfCartItems,
  cancelProduct,
  fetchWishlistedProducts,
  toggleWishlist,
  fetchWishlistedProductData,
  fetchEarpodsData,
  fetchGamingData,
  fetchLaptopsData,
  fetchOculusData,
  fetchSpeakersData,
  fetchWatchesData,
  createCheckoutSession,
  handlePaymentSuccess,
} = require("../controllers/customersController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();



router.post(
  "/create-checkout-session",
  authenticateToken,
  createCheckoutSession
);
router.post("/success", authenticateToken, handlePaymentSuccess);
router.post("/subscribers", subscribers);
module.exports = router;
