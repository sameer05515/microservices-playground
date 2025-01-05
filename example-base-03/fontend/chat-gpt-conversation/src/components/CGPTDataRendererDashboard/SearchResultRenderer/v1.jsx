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
        <div style={rootStyles}>
            {jsonData.map((conversation, index) => {
                return (
                    <CustomCollapse
                        key={index}
                        style={conversationStyles}
                        headerText={"Conversation Name : " + conversation.title}    
                        initiallyCollapsed={false}
                        collapseAll={collapseAll}                    
                    >
                        <h2
                            style={{ margin: "0" }}
                        >
                            {"Conversation Name : " + conversation.title}
                        </h2>
                        {
                            conversation.messages.map(
                                (message, msgIndex) => (
                                    <div key={msgIndex} className="message" style={messageStyles}>
                                        <div style={authorStyles}>{message.author}</div>
                                        <div style={message.author === 'user' ? userMessageContentStyles : otherMessageContentStyles}>
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
