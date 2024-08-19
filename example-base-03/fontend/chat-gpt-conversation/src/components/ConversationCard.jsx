import React from "react";
import {
    authorStyles,
    conversationStyles,
    messageStyles,
    otherMessageContentStyles,
    userMessageContentStyles,
} from "../styles/AIConversationRendererStyles";
import CustomCollapse from "./CustomCollapse";
import MarkdownComponent from "./MarkdownComponent";
import { capitalizeFirstLetter } from "../utils/UtilityMethods";

// Extracted component for ConversationHeader
const ConversationHeader = ({ title, createdOn, updatedOn, onPrevClick, onShowClick, onNextClick, conversationId }) => (
    <div>
        <h2 style={{ margin: "0" }}>{title}</h2>
        <div
            style={{
                padding: "5px",
                fontSize: "12px",
                borderRadius: "4px",
                margin: "5px",
            }}
        >
            <span style={{ marginRight: "10px" }}>
                <b>Created:</b> {createdOn}
            </span>
            <span style={{ marginRight: "10px" }}>
                <b>Updated:</b> {updatedOn}
            </span>
        </div>
        <div>
            <button onClick={() => onPrevClick(conversationId)}>Previous</button>
            <button onClick={() => onShowClick()}>Show</button>
            <button onClick={() => onNextClick(conversationId)}>Next</button>
        </div>
    </div>
);

// Extracted component for MessageItem
const MessageItem = ({ message }) => (
    <div className="message" style={messageStyles}>
        <div
            style={
                message.author === "user"
                    ? userMessageContentStyles
                    : otherMessageContentStyles
            }
        >
            <div style={authorStyles}>
                {capitalizeFirstLetter(message.author)}
            </div>
            <MarkdownComponent
                markdownText={message.text}
                additionalStyle={{
                    backgroundColor:
                        message.author === "user"
                            ? userMessageContentStyles.backgroundColor
                            : otherMessageContentStyles.backgroundColor,
                }}
                showCopyToclipboardButton={message.author !== "user"}
            />
        </div>
    </div>
);

// Main ConversationCard component
const ConversationCard = ({
    conversation,
    initiallyCollapsed = false,
    onNextClick = () => {},
    onPrevClick = () => {},
    onShowClick = () => {},
}) => {
    return (
        <CustomCollapse
            key={conversation.id}
            className="conversation"
            style={conversationStyles}
            headerText={"Conversation Name : " + conversation.title}
            initiallyCollapsed={initiallyCollapsed}
        >
            <ConversationHeader
                title={conversation.title}
                createdOn={conversation.createdOn}
                updatedOn={conversation.updatedOn}
                onPrevClick={onPrevClick}
                onShowClick={onShowClick}
                onNextClick={onNextClick}
                conversationId={conversation.id}
            />
            {conversation.messages.map((message, msgIndex) => (
                <MessageItem key={msgIndex} message={message} />
            ))}
            <div>
                <button onClick={() => onPrevClick(conversation.id)}>Previous</button>
                <button onClick={() => onShowClick()}>Show</button>
                <button onClick={() => onNextClick(conversation.id)}>Next</button>
            </div>
        </CustomCollapse>
    );
};

export default ConversationCard;
