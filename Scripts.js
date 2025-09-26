// Save and load progress using localStorage
document.getElementById("save").addEventListener("click", () => {
  const data = {
    tiktok: {
      followers: document.getElementById("tiktok-followers").value,
      likes: document.getElementById("tiktok-likes").value,
      comments: document.getElementById("tiktok-comments").value,
      reposts: document.getElementById("tiktok-reposts").value,
    },
    instagram: {
      followers: document.getElementById("instagram-followers").value,
      likes: document.getElementById("instagram-likes").value,
      comments: document.getElementById("instagram-comments").value,
      reposts: document.getElementById("instagram-reposts").value,
    },
    x: {
      followers: document.getElementById("x-followers").value,
      likes: document.getElementById("x-likes").value,
      comments: document.getElementById("x-comments").value,
      reposts: document.getElementById("x-reposts").value,
    },
    youtube: {
      followers: document.getElementById("youtube-followers").value,
      likes: document.getElementById("youtube-likes").value,
      comments: document.getElementById("youtube-comments").value,
      reposts: document.getElementById("youtube-reposts").value,
    },
    snapchat: {
      followers: document.getElementById("snap-followers").value,
      likes: document.getElementById("snap-likes").value,
      comments: document.getElementById("snap-comments").value,
      reposts: document.getElementById("snap-reposts").value,
    },
    tumblr: {
      followers: document.getElementById("tumblr-followers").value,
      likes: document.getElementById("tumblr-likes").value,
      comments: document.getElementById("tumblr-comments").value,
      reposts: document.getElementById("tumblr-reposts").value,
    },
    weeklyNotes: document.getElementById("weekly-notes").value,
    yearNotes: document.getElementById("year-notes").value,
  };

  localStorage.setItem("atwyik-data", JSON.stringify(data));
  alert("Progress saved!");
});

window.addEventListener("load", () => {
  const saved = JSON.parse(localStorage.getItem("atwyik-data"));
  if (saved) {
    document.getElementById("tiktok-followers").value = saved.tiktok.followers;
    document.getElementById("tiktok-likes").value = saved.tiktok.likes;
    document.getElementById("tiktok-comments").value = saved.tiktok.comments;
    document.getElementById("tiktok-reposts").value = saved.tiktok.reposts;

    document.getElementById("instagram-followers").value = saved.instagram.followers;
    document.getElementById("instagram-likes").value = saved.instagram.likes;
    document.getElementById("instagram-comments").value = saved.instagram.comments;
    document.getElementById("instagram-reposts").value = saved.instagram.reposts;

    document.getElementById("x-followers").value = saved.x.followers;
    document.getElementById("x-likes").value = saved.x.likes;
    document.getElementById("x-comments").value = saved.x.comments;
    document.getElementById("x-reposts").value = saved.x.reposts;

    document.getElementById("youtube-followers").value = saved.youtube.followers;
    document.getElementById("youtube-likes").value = saved.youtube.likes;
    document.getElementById("youtube-comments").value = saved.youtube.comments;
    document.getElementById("youtube-reposts").value = saved.youtube.reposts;

    document.getElementById("snap-followers").value = saved.snapchat.followers;
    document.getElementById("snap-likes").value = saved.snapchat.likes;
    document.getElementById("snap-comments").value = saved.snapchat.comments;
    document.getElementById("snap-reposts").value = saved.snapchat.reposts;

    document.getElementById("tumblr-followers").value = saved.tumblr.followers;
    document.getElementById("tumblr-likes").value = saved.tumblr.likes;
    document.getElementById("tumblr-comments").value = saved.tumblr.comments;
    document.getElementById("tumblr-reposts").value = saved.tumblr.reposts;

    document.getElementById("weekly-notes").value = saved.weeklyNotes;
    document.getElementById("year-notes").value = saved.yearNotes;
  }
});
async function fetchYouTubeStats() {
  try {
    // Change this URL once backend is deployed (for now it’s Codespaces)
    const response = await fetch("http://localhost:5000/youtube-stats");
    const data = await response.json();

    // Update the page
    document.getElementById("yt-subs").textContent = data.subscriberCount;
    document.getElementById("yt-views").textContent = data.viewCount;
    document.getElementById("yt-videos").textContent = data.videoCount;
  } catch (err) {
    console.error("Error fetching YouTube stats:", err);
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", fetchYouTubeStats);
