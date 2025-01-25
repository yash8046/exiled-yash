const axios = require("axios");

const API_KEY = "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";
const OPENAI_CHAT_API_URL = "https://api.openai.com/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    console.error("Invalid or missing 'prompt' in request body");
    return res.status(400).json({ error: "Invalid or missing 'prompt'" });
  }

  console.log("Received request with prompt:", prompt);

  try {
    const response = await axios.post(
      OPENAI_CHAT_API_URL,
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
        temperature: 0.1,
        top_p: 0.1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    res.status(200).json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error calling OpenAI Chat API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
}
