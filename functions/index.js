/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");

// eslint-disable-next-line max-len
const stripe = require("stripe")(process.env.REACT_APP_SECRET_STRIPE_KEY);

// API
// App Config
const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// API Routes
app.get("/", (request, response) => response.status(200).send("hello"));

app.post("/payments/create", async (request, response) => {
  try {
    const total = request.query.total;
    console.log("Payments Request Recieved BOOM!! For this amount >>> ", total);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    response.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    response.status(500).send("Internal Server Error");
  }
});

// Listen Command
exports.api = onRequest(app);
