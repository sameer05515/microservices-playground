import React from "react";
import {
    authorStyles,
    conversationStyles,
    messageStyles,
    otherMessageContentStyles,
    userMessageContentStyles
} from "../styles/AIConversationRendererStyles";
import CustomCollapse from "./CustomCollapse";
import MarkdownComponent from "./MarkdownComponent";
import { capitalizeFirstLetter } from "../utils/UtilityMethods";

const ConversationCard = ({
    conversation,
    initiallyCollapsed = false,
    onNextClick = () => { },
    onPrevClick = () => { },
    onShowClick = () => { },
}) => {
    return (
        <>
            <CustomCollapse
                key={conversation.id}
                className="conversation"
                style={conversationStyles}
                headerText={"Conversation Name : " + conversation.title}
                initiallyCollapsed={initiallyCollapsed}
            >
                <div>
                    <h2 style={{ margin: "0" }}>
                        {conversation.title}
                    </h2>
                    <div style={{ padding: "5px", fontSize: "12px", borderRadius: "4px", margin: "5px", }}>
                        <span style={{ marginRight: "10px" }}>
                            <b>Created:</b>{conversation.createdOn}
                        </span>
                        <span style={{ marginRight: "10px" }}>
                            <b>Updated:</b>{conversation.updatedOn}
                        </span>
                    </div>
                    <div>
                        <button onClick={() => onPrevClick(conversation.id)}>Previous</button>
                        <button onClick={() => onShowClick()}>Show</button>
                        <button onClick={() => onNextClick(conversation.id)}>Next</button>
                    </div>
                </div>
                {conversation.messages.map((message, msgIndex) => (
                    <div key={msgIndex} className="message" style={messageStyles}>
                        
                        <div
                            style={
                                message.author === "user"
                                    ? userMessageContentStyles
                                    : otherMessageContentStyles
                            }
                        >
                            <div style={authorStyles}>{capitalizeFirstLetter(message.author)}</div>
                            <MarkdownComponent markdownText={message.text}
                            additionalStyle={{backgroundColor: message.author === "user"
                            ? userMessageContentStyles.backgroundColor
                            : otherMessageContentStyles.backgroundColor}}  />
                        </div>
                    </div>
                ))}

                <div>
                    <button onClick={() => onPrevClick(conversation.id)}>Previous</button>
                    <button onClick={() => onShowClick()}>Show</button>
                    <button onClick={() => onNextClick(conversation.id)}>Next</button>
                </div>
            </CustomCollapse>
        </>
    );
};

export default ConversationCard;
