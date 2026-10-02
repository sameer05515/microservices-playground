const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "topics.json");

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function readTopics() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeTopics(topics) {
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(topics, null, 2), "utf8");
  fs.renameSync(tmp, DATA_FILE);
}

app.get("/api/topics", (req, res) => {
  try {
    res.json(readTopics());
  } catch (e) {
    res.status(500).json({ error: "Unable to read topics.json" });
  }
});

app.put("/api/topics/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const allowed = ["done", "important", "notes"];
    const topics = readTopics();
    const topic = topics.find(t => t.id === id);

    if (!topic) return res.status(404).json({ error: "Topic not found" });

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        if (key === "notes" && typeof req.body[key] !== "string") {
          return res.status(400).json({ error: "notes must be a string" });
        }
        if ((key === "done" || key === "important") && typeof req.body[key] !== "boolean") {
          return res.status(400).json({ error: `${key} must be boolean` });
        }
        topic[key] = req.body[key];
      }
    }

    writeTopics(topics);
    res.json(topic);
  } catch (e) {
    res.status(500).json({ error: "Unable to save topic" });
  }
});

app.post("/api/reset", (req, res) => {
  try {
    const topics = readTopics().map(t => ({ ...t, done:false, important:false, notes:"" }));
    writeTopics(topics);
    res.json({ success:true, topics });
  } catch (e) {
    res.status(500).json({ error: "Unable to reset progress" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status:"UP", storage:"JSON", file:"data/topics.json" });
});

app.listen(PORT, () => {
  console.log(`Revision Dashboard V3 running at http://localhost:${PORT}`);
});
