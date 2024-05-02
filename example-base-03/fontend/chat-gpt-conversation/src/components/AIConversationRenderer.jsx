import React from "react";
import MarkdownComponent from "./MarkdownComponent";
import CustomCollapse from "./CustomCollapse";
import {
    rootStyles,
    conversationStyles,
    messageStyles,
    authorStyles,
    userMessageContentStyles,
    otherMessageContentStyles,
} from "../styles/AIConversationRendererStyles";

const ChatGPTConversationRenderer = ({ jsonData }) => {

    return (
        <div id="root" style={rootStyles}>
            {jsonData.map((conversation, index) => {
                return (
                    <CustomCollapse
                        key={index}
                        className="conversation"
                        style={conversationStyles}
                        headerText={"Conversation Name : " + conversation.title}
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
