import express from "express";
import cors from "cors";
const app = express();
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Middleware
app.use(cors()); // Allow frontend reqs
app.use(express.json()); // Parse incoming JSON reqs

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/advice", async (req, res) => {
  if (req.method === "POST") {
    const { input } = req.body;

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
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
