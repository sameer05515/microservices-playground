import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import CustomCollapse from "../CustomCollapse/v1";
import MarkdownComponent from "../MarkdownComponent/v1";
import { capitalizeFirstLetter } from "../UtilityMethods";

// Optimized ToggleButton
const ToggleButton = memo(function ToggleButton({ isVisible, onToggle, title, className = "" }) {
    return (
        <span
            className={`cursor-pointer pl-12 text-blue-500 hover:text-blue-700 transition-colors ${className}`}
            title={title}
            onClick={onToggle}
        >
            {isVisible ? "- " : "+ "}
        </span>
    );
});

// Optimized ConversationHeader
const ConversationHeader = memo(function ConversationHeader({
    title,
    createdOn,
    updatedOn,
    onPrevClick,
    onShowClick,
    onNextClick,
    conversationId,
    showAllNonUserMessages,
    onShowAllNonUserMessagesChange
}) {
    const handleToggle = useCallback(
        () => onShowAllNonUserMessagesChange(!showAllNonUserMessages),
        [onShowAllNonUserMessagesChange, showAllNonUserMessages]
    );

    return (
        <div className="mb-4">
            <h2 className="m-0 flex items-center justify-between text-lg font-semibold">
                {title}
                <ToggleButton
                    isVisible={showAllNonUserMessages}
                    onToggle={handleToggle}
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
    );
});

// Optimized MessageItem
const MessageItem = memo(function MessageItem({ message, initialValueForShowMessageText = false }) {
    const [showMessageText, setShowMessageText] = useState(
        initialValueForShowMessageText || message?.author === "user"
    );

    const toggleShowMessage = useCallback(() => setShowMessageText((prev) => !prev), []);

    useEffect(() => {
        setShowMessageText(initialValueForShowMessageText || message?.author === "user");
    }, [initialValueForShowMessageText, message?.author]);

    const isUser = message.author === "user";
    const msgClass = isUser
        ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
        : "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
    const mdClass = isUser
        ? "bg-amber-50 dark:bg-amber-900/20 font-bold"
        : "bg-purple-50 dark:bg-purple-900/20 font-normal";

    return (
        <div className="mb-4 p-4 rounded border">
            <div className={`p-3 rounded ${msgClass}`}>
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
                        className={mdClass}
                        showCopyToclipboardButton={!isUser}
                    />
                )}
            </div>
        </div>
    );
});

// Optimized NavigationButtons
const NavigationButtons = memo(function NavigationButtons({ onPrevClick, onShowClick, onNextClick, conversationId }) {
    const handlePrev = useCallback(() => onPrevClick(conversationId), [onPrevClick, conversationId]);
    const handleNext = useCallback(() => onNextClick(conversationId), [onNextClick, conversationId]);

    return (
        <div className="space-x-2">
            <button
                onClick={handlePrev}
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
                onClick={handleNext}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
                Next
            </button>
        </div>
    );
});

// Main ConversationCard component optimized
const ConversationCard = memo(function ConversationCard({
    conversation,
    initiallyCollapsed = false,
    onNextClick = () => {},
    onPrevClick = () => {},
    onShowClick = () => {},
}) {
    const [showAllNonUserMessages, setShowAllNonUserMessages] = useState(true);

    const handleShowAllNonUserMessagesChange = useCallback(
        (value) => setShowAllNonUserMessages(value),
        []
    );

    const { id, title, createdOn, updatedOn, messages } = conversation;

    const messageList = useMemo(
        () =>
            messages.map((message, idx) => (
                <MessageItem
                    key={`${id}-msg-${idx}`}
                    message={message}
                    initialValueForShowMessageText={showAllNonUserMessages}
                />
            )),
        [messages, id, showAllNonUserMessages]
    );

    return (
        <CustomCollapse
            key={id}
            className="conversation"
            headerText={`Conversation Name: ${title}`}
            initiallyCollapsed={initiallyCollapsed}
        >
            <ConversationHeader
                title={title}
                createdOn={createdOn}
                updatedOn={updatedOn}
                onPrevClick={onPrevClick}
                onShowClick={onShowClick}
                onNextClick={onNextClick}
                conversationId={id}
                showAllNonUserMessages={showAllNonUserMessages}
                onShowAllNonUserMessagesChange={handleShowAllNonUserMessagesChange}
            />
            {messageList}
            <div className="mt-4">
                <NavigationButtons
                    onPrevClick={onPrevClick}
                    onShowClick={onShowClick}
                    onNextClick={onNextClick}
                    conversationId={id}
                />
            </div>
        </CustomCollapse>
    );
});

export default ConversationCard;
