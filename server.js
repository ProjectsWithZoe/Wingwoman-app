// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51QtyDZ08vAeOCZCFKF3CcDBLvhfj4RjISdI8oq0s9EZGpUurwXo9CAJif1XyC4F8g3jApCcqT9gMC5ycbitEiq3o00e6wxtiep"
);
const express = require("express");
const app = express();

import OpenAI from "openai";
import dotenv from "dotenv";



app.post("/create-checkout-session", async (req, res) => {
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ["data.product"],
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });


// Middleware
app.use(cors()); // Allow frontend reqs
app.use(express.json()); // Parse incoming JSON reqs

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,

});

app.post("/create-portal-session", async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    if (!input) {
      return res.status(400).json({
        error: "Please enter what you would you like advice on thaaaannks.",
      });
    }

    try {
      const results = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are Wingwoman AI, a funny dating coach providing sassy expert advice on online dating, messaging, and relationships. Make the advice concise and short.",
          },
          { role: "user", content: input },
        ],
        max_tokens: 200,
      });

      const gptres = results.choices[0].message.content;
      res.json({ result: gptres });
    } catch (error) {
      console.error(
        "Error communicating with Wingwoman. Please try again",
        error
      );
      res.status(500).json({ error: "Failed to reach Wingwoman." });

    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }

});

app.listen(5000, () => console.log("Server running on port 5000"));
=======
);

