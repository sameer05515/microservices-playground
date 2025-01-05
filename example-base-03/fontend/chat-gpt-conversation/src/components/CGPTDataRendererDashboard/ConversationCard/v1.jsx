import React, { useEffect, useState } from "react";
import {
    authorStyles,
    conversationStyles,
    messageStyles,
    otherMessageContentStyles,
    userMessageContentStyles,
} from "../AIConversationRendererStyles/v1";
import CustomCollapse from "../CustomCollapse/v1";
import MarkdownComponent from "../MarkdownComponent/v1";
import { capitalizeFirstLetter } from "../UtilityMethods";

// Reusable ToggleButton Component
const ToggleButton = ({ isVisible, onToggle, title }) => (
    <span
        style={{ cursor: 'pointer', paddingLeft: '50px' }}
        title={title}
        onClick={onToggle}
    >
        {isVisible ? "- " : "+ "}
    </span>
);

// Extracted component for ConversationHeader
const ConversationHeader = ({
    title,
    createdOn,
    updatedOn,
    onPrevClick,
    onShowClick,
    onNextClick,
    conversationId,
    showAllNonUserMessages = true,
    onShowAllNonUserMessagesChange = () => {}
}) => (
    <div>
        <h2 style={{ margin: "0" }}>
            {title}
            <ToggleButton
                isVisible={showAllNonUserMessages}
                onToggle={() => onShowAllNonUserMessagesChange(!showAllNonUserMessages)}
                title={showAllNonUserMessages ? "Hide All non-user messages" : "Show All non-user messages"}
            />
        </h2>
        <div style={{ padding: "5px", fontSize: "12px", borderRadius: "4px", margin: "5px" }}>
            <span style={{ marginRight: "10px" }}>
                <b>Created:</b> {createdOn}
            </span>
            <span style={{ marginRight: "10px" }}>
                <b>Updated:</b> {updatedOn}
            </span>
        </div>
        <div>
            <button onClick={() => onPrevClick(conversationId)}>Previous</button>
            <button onClick={onShowClick}>Show</button>
            <button onClick={() => onNextClick(conversationId)}>Next</button>
        </div>
    </div>
);

// Extracted component for MessageItem
const MessageItem = ({ message, initialValueForShowMessageText = false }) => {
    const [showMessageText, setShowMessageText] = useState(
        initialValueForShowMessageText || message?.author === "user"
    );

    useEffect(() => {
        setShowMessageText(initialValueForShowMessageText || message?.author === "user");
    }, [initialValueForShowMessageText, message?.author]);

    return (
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
                    <ToggleButton
                        isVisible={showMessageText}
                        onToggle={() => setShowMessageText((prev) => !prev)}
                        title={`${showMessageText ? "Hide " : "Show "} Message Text`}
                    />
                </div>
                {showMessageText && (
                    <MarkdownComponent
                        markdownText={message.text}
                        additionalStyle={{
                            backgroundColor:
                                message.author === "user"
                                    ? userMessageContentStyles.backgroundColor
                                    : otherMessageContentStyles.backgroundColor,
                        }}
                        showCopyToclipboardButton={message.author !== "user"}
                        makeFontWeightBold={message?.author === "user"}
                        reactMarkdownStyles={{ fontWeight: message?.author === "user" ? 'bold' : '' }}
                    />
                )}
            </div>
        </div>
    );
};

// Main ConversationCard component
const ConversationCard = ({
    conversation,
    initiallyCollapsed = false,
    onNextClick = () => {},
    onPrevClick = () => {},
    onShowClick = () => {},
}) => {
    const [showAllNonUserMessages, setShowAllNonUserMessages] = useState(true);

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
                showAllNonUserMessages={showAllNonUserMessages}
                onShowAllNonUserMessagesChange={setShowAllNonUserMessages}
            />
            {conversation.messages.map((message, msgIndex) => (
                <MessageItem
                    key={msgIndex}
                    message={message}
                    initialValueForShowMessageText={showAllNonUserMessages}
                />
            ))}
            <div>
                <button onClick={() => onPrevClick(conversation.id)}>Previous</button>
                <button onClick={onShowClick}>Show</button>
                <button onClick={() => onNextClick(conversation.id)}>Next</button>
            </div>
        </CustomCollapse>
    );
};

export default ConversationCard;
