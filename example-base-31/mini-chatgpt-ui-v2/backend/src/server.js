import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT || 8080);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.get("/api/health", (_req, res) => {
  res.json({
    status: "UP",
    openaiConfigured: Boolean(client),
    model: process.env.OPENAI_MODEL || "gpt-5.6"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "messages must be a non-empty array"
      });
    }

    if (!client) {
      const lastMessage =
        [...messages].reverse().find((m) => m.role === "user")?.content || "";

      return res.json({
        content:
          `### Demo mode\n\n` +
          `I received: **${lastMessage}**\n\n` +
          `Configure \`OPENAI_API_KEY\` in \`backend/.env\` for real AI responses.`
      });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6",
      input: messages.map(({ role, content }) => ({
        role,
        content
      }))
    });

    res.json({
      content: response.output_text || "No response generated."
    });
  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      error: error?.message || "Failed to generate response"
    });
  }
});

app.listen(port, () => {
  console.log(`Backend: http://localhost:${port}`);
});
