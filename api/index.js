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

// Endpoint for text/chat generation
app.post("/chat", async (req, res) => {
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
        max_tokens: 4096, // Increase token limit for longer responses
        temperature: 0.1,  // Balance between creativity and focus
        top_p: 0.1,          // Use full token distribution for creative responses
        frequency_penalty: 0, // No penalty for repeated phrases
        presence_penalty: 0,  // Neutral presence for repeated topics
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error calling OpenAI Chat API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
});

// Endpoint for image generation
app.post("/image", async (req, res) => {
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
