import React, { useState, memo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { CopyToClipboard } from "react-copy-to-clipboard";


// Extracted CopyButton component
const CopyButton = memo(({ textToCopy, onCopy }) => (
  <CopyToClipboard text={textToCopy} onCopy={onCopy}>
    <button className="px-3 py-1 border-none rounded cursor-pointer bg-blue-500 text-white hover:bg-blue-600 transition-colors">
      Copy to Clipboard
    </button>
  </CopyToClipboard>
));

CopyButton.displayName = "CopyButton";

// Extracted GoToButton component
const GoToButton = memo(({ onClick }) => (
  <button className="px-3 py-1 border-none rounded cursor-pointer bg-green-500 text-white hover:bg-green-600 transition-colors" onClick={onClick}>
    Go to Related Conversation
  </button>
));

GoToButton.displayName = "GoToButton";



/**
 * # Main MarkdownComponent component
 * 
 * - Values of `showCopyToclipboardButton` and `showGotoRelatedConversationButton` are kept as `true` to just adding a new functionality and backward support the existing application, where this change is currently not implemented.
 *      - `TBD`: Default value should be false, as per best-practices.
 * */
const MarkdownComponent = memo(({
  markdownText = "",
  additionalStyle = {},
  showCopyToclipboardButton = true,
  showGotoRelatedConversationButton = true,
  onGoToClick = () => {},
  reactMarkdownStyles = {},
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  }, []);

  return (
    <div
      className="markdown-body p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
      style={additionalStyle}
    >
      <div className="flex justify-between items-center mb-3">
        {showCopyToclipboardButton && (
          <CopyButton textToCopy={markdownText} onCopy={handleCopy} />
        )}
        {showGotoRelatedConversationButton && <GoToButton onClick={onGoToClick} />}
      </div>

      {copied && <span className="text-green-600 mb-3 block text-sm font-medium">Copied!</span>}

      <div className="prose max-w-none dark:prose-invert" style={reactMarkdownStyles}>
        <ReactMarkdown>{markdownText}</ReactMarkdown>
      </div>
    </div>
  );
});

MarkdownComponent.displayName = "MarkdownComponent";

export default MarkdownComponent;
