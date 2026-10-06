import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT || 8080);
app.use(cors());
app.use(express.json({ limit: "1mb" }));
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.get("/api/health", (_req, res) => res.json({ status: "UP", openaiConfigured: Boolean(client), model: process.env.OPENAI_MODEL || "gpt-5.6" }));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: "messages must be a non-empty array" });
    if (!client) {
      const last = [...messages].reverse().find(m => m.role === "user")?.content || "";
      return res.json({ content: `Demo mode: I received **${last}**.\n\nAdd OPENAI_API_KEY to backend/.env to enable real AI responses.` });
    }
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6",
      input: messages.map(m => ({ role: m.role, content: m.content }))
    });
    res.json({ content: response.output_text || "I couldn't generate a response." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message || "Failed to generate response" });
  }
});

app.listen(port, () => console.log(`Mini ChatGPT backend running at http://localhost:${port}`));
