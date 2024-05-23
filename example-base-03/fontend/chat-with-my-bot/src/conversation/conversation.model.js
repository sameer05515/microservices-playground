const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const conversationSchema = new mongoose.Schema({
    uniqueId: { type: String, default: uuidv4 },
    questionText: { type: String, required: true },
    answerText: { type: String },
    createdAt: { type: Date, default: new Date() },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
