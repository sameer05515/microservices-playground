import React from "react";
import MarkdownComponent from "../MarkdownComponent/v2";
import CustomCollapse from "../CustomCollapse/v2";
import { usePragyamContext } from "../PragyamContext";

const SearchResultRendererV2 = () => {
  const {
    filteredData,
    uiState: { collapseAll },
  } = usePragyamContext();

  return (
    <div>
      {filteredData &&
        filteredData.map((conversation, index) => (
          <CustomCollapse
            key={index}
            headerText={`Conversation Name : ${conversation.title}`}
            initiallyCollapsed={false}
            collapseAll={collapseAll}
          >
            <h2 className="text-lg font-bold mb-4">
              {`Conversation Name : ${conversation.title}`}
            </h2>
            {conversation.messages.map((message, msgIndex) => (
              <div
                key={msgIndex}
                className="mb-5 whitespace-pre-wrap"
              >
                <div className="font-semibold mb-2">{message.author}</div>
                <div
                  className={`border rounded p-3 ${
                    message.author === "user"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                      : "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                  }`}
                >
                  <MarkdownComponent
                    markdownText={message.text}
                    showCopyToclipboardButton
                    showGotoRelatedConversationButton
                  />
                </div>
              </div>
            ))}
          </CustomCollapse>
        ))}
    </div>
  );
};

export default SearchResultRendererV2;
