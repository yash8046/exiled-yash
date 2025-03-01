const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const API_KEY = process.env.OPEN_API_KEY;
const OPENAI_CHAT_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_IMAGE_API_URL = "https://api.openai.com/v1/images/generations";

// Endpoint for text/chat generation
app.post("/api/chat", async (req, res) => {
  const { prompt, context } = req.body;

  if (!prompt || typeof prompt !== "string") {
    console.error("Invalid or missing 'prompt' in request body");
    return res.status(400).json({ error: "Invalid or missing 'prompt'" });
  }

  console.log("Received request with prompt:", prompt);

  // Convert context into the format expected by OpenAI
  let messages = context.map(c => ({ role: c.sender === 'user' ? 'user' : 'assistant', content: c.text }));
  messages.push({ role: 'user', content: prompt });

  try {
    const response = await axios.post(
      OPENAI_CHAT_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 200000,  // Maximum tokens - check this value based on current API limits
        temperature: 0.7,  // Increased for more creative outputs
        top_p: 1,  // Top-p sampling, set to 1 for full randomness within the temperature setting
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
