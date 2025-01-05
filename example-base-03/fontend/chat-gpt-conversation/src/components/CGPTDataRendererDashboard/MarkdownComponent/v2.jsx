import React, { useState } from "react";
import MDSectionV1 from "../../../common/components/MDSection/v1";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCopy, FiCheck } from "react-icons/fi";

const ConvMessageDisplay = ({
  markdownText = "",
  // additionalStyle = {},
  showCopyToclipboardButton = false,
  showGotoRelatedConversationButton = false,
  onGoToClick = () => {},
  reactMarkdownStyles = {},
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <div
      className={`p-4 border border-gray-300 dark:border-gray-700 rounded-lg w-full`}
    >
      <div className="flex justify-between items-center mb-4">
        {showCopyToclipboardButton && !copied && (
          <CopyToClipboard text={markdownText} onCopy={handleCopy}>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              title="Copy to Clipboard"
            >
              <FiCopy className="text-lg" />
              {/* Copy to Clipboard */}
            </button>
          </CopyToClipboard>
        )}
        {copied && (
          <span
            className="flex items-center gap-2 text-green-600 text-sm font-medium"
            title="Copied!"
          >
            <FiCheck className="text-lg" />
            Copied!
          </span>
        )}

        {showGotoRelatedConversationButton && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
            onClick={onGoToClick}
            title="Go to Related Conversation"
          >
            Go to Related Conversation
          </button>
        )}
      </div>

      <div className={`${reactMarkdownStyles ? reactMarkdownStyles : ""}`}>
        <MDSectionV1 content={markdownText} />
      </div>
    </div>
  );
};

export default ConvMessageDisplay;
