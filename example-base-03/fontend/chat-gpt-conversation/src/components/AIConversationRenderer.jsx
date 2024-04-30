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

// import { getConversationMessages } from "../utils/UtilityMethods";

const ChatGPTConversationRenderer = ({ jsonData }) => {

    return (
        <div id="root" style={rootStyles}>
            {jsonData.map((conversation, index) => {
                //const messages = getConversationMessages(conversation);
                return (
                    <CustomCollapse
                        key={index}
                        className="conversation"
                        style={conversationStyles}
                        headerText={"Conversation Name : " + conversation.title}
                    >
                        <h4 style={{ margin: "0" }}>
                            {"Conversation Name : " + conversation.title}
                        </h4>
                        {conversation.messages.map((message, msgIndex) => (
                            <div key={msgIndex} className="message" style={messageStyles}>
                                <div style={authorStyles}>{message.author}</div>
                                {/* <div>{message.text}</div> */}
                                <div style={message.author === 'user' ? userMessageContentStyles : otherMessageContentStyles}>
                                    <MarkdownComponent markdownText={message.text} />
                                </div>

                            </div>
                        ))}
                    </CustomCollapse>
                );
            })}
        </div>
    );
};

export default ChatGPTConversationRenderer;
