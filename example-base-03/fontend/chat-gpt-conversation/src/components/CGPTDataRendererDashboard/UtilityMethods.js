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

export function formatUnixTimestamp(timestamp) {
    // Convert timestamp to milliseconds
    const milliseconds = timestamp * 1000;

    // Create a Date object
    const date = new Date(milliseconds);

    // Get day, month, year, hours, minutes, and seconds
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    // Define month names
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Create formatted date string
    const formattedDate = `${day}-${monthNames[parseInt(month, 10) - 1]}-${year} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
}

// Example usage:
//   const timestamp = 1715325854.004793;
//   console.log(formatUnixTimestamp(timestamp)); // Output: "07-Apr-2024 11:24:14"

export const localSessionManager = () => {
    const getItemForKey = (key) => {
        const chatRendererConfig = JSON.parse(localStorage.getItem("chatRendererConfig"));
        // console.log(`getItem: chatRendererConfig from local storage: ${JSON.stringify(chatRendererConfig, null, 2)}`);
        // console.log(`getItem: chatRendererConfig: ${JSON.stringify(chatRendererConfig)}`)
        const item = chatRendererConfig && chatRendererConfig[key]!=null ? chatRendererConfig[key] : null;
        // console.log(`[localSessionManager.getItemForKey]: key: ${key}, value: ${item}, valueType: ${typeof item}`)
        return item;
    }
    const setItemForKey = (key, value) => {
        let chatRendererConfig = JSON.parse(localStorage.getItem("chatRendererConfig"));
        // console.log(`[localSessionManager.setItemForKey]: key: ${key}, value: ${value}, valueType: ${typeof item}`)
        if (!chatRendererConfig) {
            chatRendererConfig = {};
        }
        chatRendererConfig[key] = value;
        // console.log(`chatRendererConfig: before set: ${JSON.stringify(chatRendererConfig)}`)
        localStorage.setItem("chatRendererConfig", JSON.stringify(chatRendererConfig));
        // console.log(`[localSessionManager.setItemForKey]: chatRendererConfig from local storage: ${JSON.stringify(chatRendererConfig)}`);
    }

    const KEYS = {
        listVisible: 'listVisible',
        selectedFileName:"selectedFileName",
        selectedConversationId: 'selectedConversationId'
    }

    return { getItemForKey, setItemForKey, KEYS };
}

export const capitalizeFirstLetter = (str) => {
    if(!str){
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
