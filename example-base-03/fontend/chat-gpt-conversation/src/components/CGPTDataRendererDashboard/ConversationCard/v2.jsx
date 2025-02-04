import React, { useState } from "react";
import MarkdownComponent from "../MarkdownComponent/v2";
import { capitalizeFirstLetter } from "../UtilityMethods";
import { usePragyamContext } from "../PragyamContext";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const ConversationCard = () => {
  const {
    getCurrentSelectedConvDetails,
    uiState,
    handleNext: onNextClick,
    handlePrev: onPrevClick,
  } = usePragyamContext();
  const conversation = getCurrentSelectedConvDetails();
  const [showAllNonUserMessages, setShowAllNonUserMessages] = useState(true);

  if (!conversation || uiState.showSearchSection) {
    return null;
  }

  return (
    <div className={`max-h-[87vh] max-w-[79vw] overflow-y-auto`}>
      {/**==== ConversationHeader start ==== */}
      <div className="mb-0 w-[73vw] max-h-[77vh] overflow-y-auto">
        <h2 className="flex items-center justify-between text-lg font-semibold">
          {conversation.title} [Total Message: {conversation.totalMessages}]
          <span
            className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
            title={showAllNonUserMessages ? "Hide All non-user messages" : "Show All non-user messages"}
            onClick={() => setShowAllNonUserMessages(!showAllNonUserMessages)}
          >
            {showAllNonUserMessages ? "- " : "+ "}
          </span>
        </h2>
        <div className="p-2 text-sm bg-gray-100 rounded-md dark:bg-gray-700">
          <span className="mr-4">
            <b>Created:</b> {conversation.createdOn}
          </span>
          <span className="mr-4">
            <b>Updated:</b> {conversation.updatedOn}
          </span>
        </div>
        <div className="mt-2 space-x-4">
          <button
            title="Previous"
            className="px-2 py-2  bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
            onClick={() => onPrevClick(conversation.id)}
          >
            <FaArrowLeft />
          </button>
          <button
            title="Next"
            className="px-2 py-2  bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
            onClick={() => onNextClick(conversation.id)}
          >
            <FaArrowRight />
            
          </button>
        </div>
      </div>
      {/**==== ConversationHeader end ==== */}

      {conversation.messages.map((message, msgIndex) => (
        <div
          key={`message_${msgIndex + 1}`}
          className={`mb-4 p-4 rounded border ${
            message.author === "user" ? "border-yellow-300" : "border-purple-300"
          }`}
        >
          <div className="font-bold mb-2 flex items-center justify-between">
            {capitalizeFirstLetter(message.author)}
            <span
              className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
              title={
                showAllNonUserMessages || message?.author === "user"
                  ? "Hide Message Text"
                  : "Show Message Text"
              }
            >
              {showAllNonUserMessages || message?.author ? "- " : "+ "}
            </span>
          </div>
          {(showAllNonUserMessages || message?.author) && (
            <MarkdownComponent
              markdownText={message.text}
              additionalStyle={
                {
                  // backgroundColor: message.author === "user" ? "cornsilk" : "lavenderblush",
                }
              }
              showCopyToclipboardButton={message.author !== "user"}
              makeFontWeightBold={message?.author === "user"}
              reactMarkdownStyles={{
                fontWeight: message?.author === "user" ? "bold" : "",
              }}
            />
          )}
        </div>
      ))}

      <div className="mt-4 space-x-4">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
          onClick={() => onPrevClick(conversation.id)}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
          onClick={() => onNextClick(conversation.id)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ConversationCard;
