async function fetchStats(platform, url, mapping) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Apply mapping (object that maps API fields → element IDs)
    for (const [apiField, elementId] of Object.entries(mapping)) {
      document.getElementById(elementId).textContent = data[apiField] || "N/A";
    }
  } catch (err) {
    console.error(`Error fetching ${platform} stats:`, err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Replace localhost with deployed backend later
  fetchStats("YouTube", "http://localhost:5000/youtube-stats", {
    subscriberCount: "yt-subs",
    viewCount: "yt-views",
    videoCount: "yt-videos",
  });

  fetchStats("TikTok", "http://localhost:5000/tiktok-stats", {
    follower_count: "tt-followers",
    likes_count: "tt-likes",
  });

  fetchStats("Instagram", "http://localhost:5000/instagram-stats", {
    followers_count: "ig-followers",
    media_count: "ig-posts",
  });

  fetchStats("Twitter", "http://localhost:5000/twitter-stats", {
    public_metrics: "tw-followers", // will need extra formatting
  });
});
// Fetch stats from your backend and update the page
async function fetchStats() {
  try {
    const res = await fetch("http://localhost:3000/api/stats"); // backend endpoint
    const data = await res.json();

    // === YouTube ===
    document.getElementById("yt-subs").textContent = data.youtube.subs;
    document.getElementById("yt-views").textContent = data.youtube.views;
    document.getElementById("yt-videos").textContent = data.youtube.videos;

    // === TikTok ===
    document.getElementById("tt-followers").textContent = data.tiktok.followers;
    document.getElementById("tt-likes").textContent = data.tiktok.likes;

    // === Instagram ===
    document.getElementById("ig-followers").textContent = data.instagram.followers;
    document.getElementById("ig-posts").textContent = data.instagram.posts;

    // === Twitter (X) ===
    document.getElementById("tw-followers").textContent = data.twitter.followers;

  } catch (error) {
    console.error("Error fetching stats:", error);
  }
}

// Call fetch on page load
fetchStats();
