const Conversation = require('./conversation.model');

async function createConversation(questionText, answerText) {
    const conversation = new Conversation({
        questionText,
        answerText
    });
    await conversation.save();
    return conversation;
}

async function getConversationById(uniqueId) {
    return Conversation.findOne({ uniqueId });
}

async function updateConversation(uniqueId, questionText, answerText) {
    const conversation = await getConversationById(uniqueId);
    if (!conversation) {
        throw new Error('Conversation not found');
    }
    conversation.questionText = questionText;
    conversation.answerText = answerText;
    await conversation.save();
    return conversation;
}

async function deleteConversation(uniqueId) {
    const conversation = await getConversationById(uniqueId);
    if (!conversation) {
        throw new Error('Conversation not found');
    }
    await conversation.remove();
    return conversation;
}

module.exports = {
    createConversation,
    getConversationById,
    updateConversation,
    deleteConversation
};
