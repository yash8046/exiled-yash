const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const API_KEY = "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";
const OPENAI_CHAT_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";
// Endpoint for image generation
app.post("/api/image", async (req, res) => {
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

    // Extract and return the generated image URLs
    const images = response.data.data.map((img) => img.url);
    res.json({ images });
  } catch (error) {
    console.error("Error calling OpenAI Image API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch image from OpenAI" });
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
