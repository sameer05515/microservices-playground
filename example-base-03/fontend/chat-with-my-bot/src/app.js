const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const conversationService = require("./conversation/conversation.service");
const conversationLPS = require("./conversation/conversation.lps");



const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ms_playground_ex03_conversation_db';

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json());

mongoose.connect(MONGODB_URI);

// Define a route to render the chat interface
app.get("/", (req, res) => {
    res.render("chat");
});

// POST endpoint to handle the question and return the answer
app.post("/answer", async (req, res) => {
    const raw = req.body?.questionText;
    const questionText = typeof raw === "string" ? raw.trim() : "";
    if (!questionText) {
        return res.status(400).json({ error: "questionText is required and must be a non-empty string" });
    }

    try {
        const answerText = await conversationLPS.doNaturalLP(questionText);
        const conversation = await conversationService.createConversation(questionText, answerText);
        res.json({
            answerText: conversation.answerText,
            questionText: conversation.questionText,
            _id: conversation._id,
            uniqueId: conversation.uniqueId,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to process question" });
    }
});

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
