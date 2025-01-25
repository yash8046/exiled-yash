const axios = require("axios");

const API_KEY = "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";
const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { prompt, n = 1, size = "1024x1024" } = req.body;

  if (!prompt || typeof prompt !== "string") {
    console.error("Invalid or missing 'prompt' in request body");
    return res.status(400).json({ error: "Invalid or missing 'prompt'" });
  }

  console.log("Received image generation request with prompt:", prompt);

  try {
    const response = await axios.post(
      OPENAI_IMAGE_API_URL,
      {
        prompt,
        n,
        size,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const images = response.data.data.map((img) => img.url);
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error calling OpenAI Image API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch image from OpenAI" });
  }
}
