require("dotenv").config();
const express = require("express");
const authRoutes = require("./src/routes/authRoute");
const userRoute = require("./src/routes/userRoute");
const farmerRoute = require("./src/routes/farmerRoute");
const laboursRoute = require("./src/routes/laboursRoute");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./src/middlewares/errorMiddleware");

const corsOptions = require("./src/middlewares/corsMiddleware");
const stripe = require("stripe")(
  "sk_test_51NR99USFBsMizJtqgugjwCzWBEka7nr355hR294tm3VNMVUxrz0YoIq1PY89wStYr0Fd6lAx1pP5xfp7LxdKELnl008ahGLLka"
);

const PORT = 5000;

const app = express();

//MiddleWare
app.use(express.json());
app.use(corsOptions);
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/admin", authRoutes);
app.use("/user", userRoute);
app.use("/resident", authRoutes);
app.use("/labours", laboursRoute);
app.use("/farmers", farmerRoute);

const endpointSecret =
  "whsec_b3b8782b2b1f4d4fd2ffdeb85c50a229c286c75bb959b5855245f108c35ee55c";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log(`Unhandled event type ${event.type}`);

    response.send();
  }
);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
