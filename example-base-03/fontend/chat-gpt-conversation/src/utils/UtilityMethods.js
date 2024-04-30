export const getConversationMessages = (conversation) => {
    const messages = [];
    let currentNode = conversation.current_node;
    while (currentNode !== null) {
        const node = conversation.mapping[currentNode];
        if (
            node.message &&
            node.message.content &&
            node.message.content.content_type === "text" &&
            node.message.content.parts.length > 0 &&
            node.message.content.parts[0].length > 0 &&
            (node.message.author.role !== "system" ||
                node.message.metadata.is_user_system_message)
        ) {
            let author = node.message.author.role;
            if (author === "assistant") {
                author = "ChatGPT";
            } else if (
                author === "system" &&
                node.message.metadata.is_user_system_message
            ) {
                author = "Custom user info";
            }
            messages.push({ author, text: node.message.content.parts[0] });
        }
        currentNode = node.parent;
    }
    return messages.reverse();
};