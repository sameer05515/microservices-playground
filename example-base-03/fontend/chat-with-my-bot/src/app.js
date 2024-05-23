const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const conversationService = require("./conversation/conversation.service");
const conversationLPS= require('./conversation/conversation.lps');



const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ms_playground_ex03_conversation_db';

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json());

mongoose.connect(MONGODB_URI, { // Use process.env.MONGODB_URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a route to render the chat interface
app.get("/", (req, res) => {
    res.render("chat");
});

// POST endpoint to handle the question and return the answer
app.post("/answer", async (req, res) => {
    const questionText = req.body.questionText;
    // Capitalize the question text
    const answerText = questionText.toUpperCase();


    try {
        // do NLP
        const answerText = await conversationLPS.doNaturalLP(questionText);
        // Create a conversation record
        const conversation = await conversationService.createConversation(
            questionText,
            answerText
        );
        // Send back the capitalized answer and original question along with the conversation ID
        res.json({
            answerText: conversation.answerText,
            questionText: conversation.questionText,
            _id: conversation._id,
            uniqueId: conversation.uniqueId
        });
    } catch (e) {
        console.error(e);
        res.sendStatus(500); // Send internal server error status
    }
});

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
