import React from "react";
import MarkdownComponent from "../MarkdownComponent/v1";
import CustomCollapse from "../CustomCollapse/v1";
import {
    rootStyles,
    conversationStyles,
    messageStyles,
    authorStyles,
    userMessageContentStyles,
    otherMessageContentStyles,
} from "../AIConversationRendererStyles/v1";

const ChatGPTConversationRenderer = ({ jsonData, collapseAll=true }) => {

    

    return (
        <div className="space-y-4 p-4 bg-white dark:bg-gray-900">
            {jsonData.map((conversation, index) => {
                return (
                    <CustomCollapse
                        key={index}
                        headerText={"Conversation Name : " + conversation.title}    
                        initiallyCollapsed={false}
                        collapseAll={collapseAll}                    
                    >
                        <h2 className="m-0 text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            {"Conversation Name : " + conversation.title}
                        </h2>
                        {
                            conversation.messages.map(
                                (message, msgIndex) => (
                                    <div key={msgIndex} className="mb-4 p-4 rounded border">
                                        <div className="font-bold mb-2 text-gray-800 dark:text-gray-200">{message.author}</div>
                                        <div className={`p-3 rounded ${
                                            message.author === 'user' 
                                                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                                : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                                        }`}>
                                            <MarkdownComponent markdownText={message.text} />
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </CustomCollapse>
                );
            })}
        </div>
    );
};

export default ChatGPTConversationRenderer;
