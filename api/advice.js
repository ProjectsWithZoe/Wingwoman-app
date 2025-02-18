import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use a backend-only env variable
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({
      error: "Please enter what you would like advice on.",
    });
  }

  try {
    const response = await openai.chat.completions.create({
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

    const gptResponse = response.choices[0].message.content;
    res.status(200).json({ result: gptResponse });
  } catch (error) {
    console.error("Error generating advice:", error);
    res.status(500).json({ error: "Failed to generate advice." });
  }
}
