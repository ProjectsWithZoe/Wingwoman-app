import Stripe from "stripe";
import { auth, db } from "../../../src/lib/firebaseAdmin";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhook secret
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let event;
  const signature = req.headers["stripe-signature"];

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Handle Stripe events
  switch (event.type) {
    case "checkout.session.completed":
      const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id
      );
      const userEmail = session.customer_details.email;

      console.log(`Payment completed for ${userEmail}`);

      try {
        const userRecord = await auth.getUserByEmail(userEmail);
        if (!userRecord) {
          console.log(`User with email ${userEmail} not found in database`);
          return res.status(404).send("User not found");
        }

        const userId = userRecord.uid;
        const q = db.collection("users").where("userId", "==", userId);
        const querySnapshot = await q.get();

        if (querySnapshot.empty) {
          console.log("No matching user found");
          return res.status(404).send("User not found");
        }

        querySnapshot.forEach(async (doc) => {
          await doc.ref.set({ hasAccess: true }, { merge: true });
          console.log(`Updated access for ${userEmail}`);
        });

        res.status(200).send("User access updated");
      } catch (error) {
        console.error("Error updating Firestore", error);
        res.status(500).send("Internal server error");
      }
      break;

    case "payment_intent.succeeded":
      console.log(`PaymentIntent succeeded for ${event.data.object.amount}`);
      break;

    default:
      console.log(`Unhandled event type ${event.type}.`);
      break;
  }

  res.status(200).send("Event received");
}

// Ensure Vercel handles raw body for Stripe
export const config = {
  api: {
    bodyParser: false,
  },
};
