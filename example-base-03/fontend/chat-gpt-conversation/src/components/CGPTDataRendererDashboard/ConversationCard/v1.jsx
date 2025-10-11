import React, { useEffect, useState, memo, useCallback } from "react";
import {
    otherMessageContentStyles,
    userMessageContentStyles
} from "../AIConversationRendererStyles/v1";
import CustomCollapse from "../CustomCollapse/v1";
import MarkdownComponent from "../MarkdownComponent/v1";
import { capitalizeFirstLetter } from "../UtilityMethods";

// Reusable ToggleButton Component
const ToggleButton = memo(({ isVisible, onToggle, title }) => (
    <span
        className="cursor-pointer pl-12 text-blue-500 hover:text-blue-700 transition-colors"
        title={title}
        onClick={onToggle}
    >
        {isVisible ? "- " : "+ "}
    </span>
));

ToggleButton.displayName = "ToggleButton";

// Extracted component for ConversationHeader
const ConversationHeader = memo(({
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
    <div className="mb-4">
        <h2 className="m-0 flex items-center justify-between text-lg font-semibold">
            {title}
            <ToggleButton
                isVisible={showAllNonUserMessages}
                onToggle={() => onShowAllNonUserMessagesChange(!showAllNonUserMessages)}
                title={showAllNonUserMessages ? "Hide All non-user messages" : "Show All non-user messages"}
            />
        </h2>
        <div className="p-2 text-xs rounded m-2 bg-gray-100 dark:bg-gray-700">
            <span className="mr-4">
                <b>Created:</b> {createdOn}
            </span>
            <span className="mr-4">
                <b>Updated:</b> {updatedOn}
            </span>
        </div>
        <div className="space-x-2">
            <button 
                onClick={() => onPrevClick(conversationId)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
                Previous
            </button>
            <button 
                onClick={onShowClick}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
            >
                Show
            </button>
            <button 
                onClick={() => onNextClick(conversationId)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
                Next
            </button>
        </div>
    </div>
));

ConversationHeader.displayName = "ConversationHeader";

// Extracted component for MessageItem
const MessageItem = memo(({ message, initialValueForShowMessageText = false }) => {
    const [showMessageText, setShowMessageText] = useState(
        initialValueForShowMessageText || message?.author === "user"
    );

    const toggleShowMessage = useCallback(() => {
        setShowMessageText((prev) => !prev);
    }, []);

    useEffect(() => {
        setShowMessageText(initialValueForShowMessageText || message?.author === "user");
    }, [initialValueForShowMessageText, message?.author]);

    return (
        <div className="mb-4 p-4 rounded border">
            <div
                className={`p-3 rounded ${
                    message.author === "user"
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                        : "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                }`}
            >
                <div className="font-bold mb-2 flex items-center justify-between text-gray-800 dark:text-gray-200">
                    {capitalizeFirstLetter(message.author)}
                    <ToggleButton
                        isVisible={showMessageText}
                        onToggle={toggleShowMessage}
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
});

MessageItem.displayName = "MessageItem";

// Main ConversationCard component
const ConversationCard = memo(({
    conversation,
    initiallyCollapsed = false,
    onNextClick = () => {},
    onPrevClick = () => {},
    onShowClick = () => {},
}) => {
    const [showAllNonUserMessages, setShowAllNonUserMessages] = useState(true);

    const handleShowAllNonUserMessagesChange = useCallback((value) => {
        setShowAllNonUserMessages(value);
    }, []);

    return (
        <CustomCollapse
            key={conversation.id}
            className="conversation"
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
                onShowAllNonUserMessagesChange={handleShowAllNonUserMessagesChange}
            />
            {conversation.messages.map((message, msgIndex) => (
                <MessageItem
                    key={msgIndex}
                    message={message}
                    initialValueForShowMessageText={showAllNonUserMessages}
                />
            ))}
            <div className="mt-4 space-x-2">
                <button 
                    onClick={() => onPrevClick(conversation.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                    Previous
                </button>
                <button 
                    onClick={onShowClick}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                >
                    Show
                </button>
                <button 
                    onClick={() => onNextClick(conversation.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                    Next
                </button>
            </div>
        </CustomCollapse>
    );
});

ConversationCard.displayName = "ConversationCard";

export default ConversationCard;
