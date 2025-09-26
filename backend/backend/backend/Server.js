const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname,'data.json');

function readData(){
  return JSON.parse(fs.readFileSync(DATA_FILE));
}
function writeData(d){
  fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2));
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Basic endpoints ---
app.get('/api/state', (req,res)=>{
  res.json(readData());
});

app.post('/api/socials/:network', (req,res)=>{
  const network = req.params.network;
  const data = readData();
  data.socials[network] = {...data.socials[network], ...req.body};
  writeData(data);
  res.json({ok:true, social:data.socials[network]});
});

// Save full calendar/months
app.post('/api/calendar', (req,res)=>{
  const data = readData();
  data.calendar = req.body;
  writeData(data);
  res.json({ok:true});
});

// Add video (for tracking uploaded/published assets)
app.post('/api/videos', (req,res)=>{
  const data = readData();
  const v = req.body;
  v.id = Date.now();
  // compute engagement metric
  v.engagementScore = (v.views || 0) + (v.likes || 0)*2 + (v.comments || 0)*3;
  data.videos.push(v);
  writeData(data);
  res.json(v);
});

// Recommend videos to remove (low engagement)
app.get('/api/recommend/remove', (req,res)=>{
  const data = readData();
  const threshold = parseInt(req.query.threshold || '100'); // engagement threshold
  const remove = data.videos.filter(v => v.engagementScore < threshold);
  res.json(remove);
});

// Simple script generator endpoint (platform-specific)
function generateScript(platform, country, dish, weekday){
  // simple templates — you can expand these or use an LLM in production
  const genericHook = `Quick taste of ${country}'s ${dish} — join me Around the World in Your Kitchen!`;
  const platformNotes = {
    youtube: `YouTube: Full recipe + story. Start with the hook, then ingredients, step-by-step cooking, plating, and a final tasting moment. CTA: Subscribe & visit the cookbook.`,
    tiktok: `TikTok: 15-60s. Hook in first 3s: show final dish. Fast cuts, one-liner recipe steps, trending sound. CTA: follow for full recipe.`,
    instagram: `Instagram Reel: 30s. Aesthetic shots, ingredient overlay text, friendly voiceover, CTA to save & share.`,
    x: `X (Twitter): Short vid/clip (30s). Show the single best action shot + thread with recipe steps in text.`,
    snap: `Snap: vertical short clip (10-30s) with captions and a 'swipe up' or story highlight CTA.`,
    tumblr: `Tumblr: Post video with a short narrative, recipe, and link to longer cook notes.`
  };
  return {
    title: `${dish} — ${country} (${platform.toUpperCase()})`,
    script: `${genericHook}\n\nPlatform tips: ${platformNotes[platform]}\n\nStructure:\n- Hook (3s)\n- Ingredient highlights (5-10s)\n- One-liner step cuts (15-30s)\n- Final plating + taste (5-10s)\n- CTA: follow/save/visit book landing page`,
    platform
  };
}

app.get('/api/generate/week-scripts', (req,res)=>{
  // expects query: platform, country, dish, weekdays (optional)
  const platform = req.query.platform || 'tiktok';
  const country = req.query.country || 'Unknown Country';
  const dish = req.query.dish || 'Dish';
  const weekdays = ['Monday','Wednesday','Friday'];
  const scripts = weekdays.map(day=>generateScript(platform,country,dish,day));
  res.json(scripts);
});

// placeholder: endpoint to integrate with platform APIs to fetch follower counts
app.get('/api/fetch/followers/:network', (req,res)=>{
  // SECURITY: This is a placeholder. Real implementation requires OAuth + platform SDKs.
  res.status(501).json({error: "Not implemented. Plug in official platform API here (OAuth required)."});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Backend running on',PORT));
