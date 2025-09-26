import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

/* ================================
   YOUTUBE STATS
================================ */
app.get("/youtube-stats", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "statistics",
          id: process.env.YOUTUBE_CHANNEL_ID,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    res.json(response.data.items[0].statistics);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch YouTube stats" });
  }
});

/* ================================
   TIKTOK STATS
   (Requires TikTok API Business Account)
================================ */
app.get("/tiktok-stats", async (req, res) => {
  try {
    const response = await axios.get("https://open.tiktokapis.com/v2/user/info/", {
      headers: {
        Authorization: `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TikTok stats" });
  }
});

/* ================================
   INSTAGRAM STATS
   (Uses Meta Graph API)
================================ */
app.get("/instagram-stats", async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${process.env.INSTAGRAM_USER_ID}`,
      {
        params: {
          fields: "followers_count,media_count",
          access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Instagram stats" });
  }
});

/* ================================
   X (Twitter) STATS
   (Requires X Developer Account)
================================ */
app.get("/twitter-stats", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.twitter.com/2/users/${process.env.TWITTER_USER_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Twitter stats" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("✅ ATWYIK Socials backend is running");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
