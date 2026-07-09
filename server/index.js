require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/search", async (req, res) => {
  const { q, pageToken } = req.query;
  if (!q) return res.status(400).json({ error: "Query required" });

  const params = new URLSearchParams({
    part: "snippet",
    q,
    type: "video",
    maxResults: 12,
    relevanceLanguage: "en",
    videoEmbeddable: "true",
    key: process.env.YOUTUBE_API_KEY,
    ...(pageToken ? { pageToken } : {}),
  });

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "YouTube API request failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));