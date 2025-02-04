import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CopyToClipboard } from "react-copy-to-clipboard";

const styles = {
  container: {
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  button: {
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  copyButton: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  goToButton: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
  copiedMessage: {
    color: "green",
    marginBottom: "10px",
    display: "block",
  },
};

// Extracted CopyButton component
const CopyButton = ({ textToCopy, onCopy }) => (
  <CopyToClipboard text={textToCopy} onCopy={onCopy}>
    <button style={{ ...styles.button, ...styles.copyButton }}>
      Copy to Clipboard
    </button>
  </CopyToClipboard>
);

// Extracted GoToButton component
const GoToButton = ({ onClick }) => (
  <button style={{ ...styles.button, ...styles.goToButton }} onClick={onClick}>
    Go to Related Conversation
  </button>
);



/**
 * # Main MarkdownComponent component
 * 
 * - Values of `showCopyToclipboardButton` and `showGotoRelatedConversationButton` are kept as `true` to just adding a new functionality and backward support the existing application, where this change is currently not implemented.
 *      - `TBD`: Default value should be false, as per best-practices.
 * */
const MarkdownComponent = ({
  markdownText = "",
  additionalStyle = {},
  showCopyToclipboardButton = true,
  showGotoRelatedConversationButton = true,
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
      className="markdown-body"
      style={{ ...styles.container, ...additionalStyle }}
    >
      <div style={styles.buttonContainer}>
        {showCopyToclipboardButton && (
          <CopyButton textToCopy={markdownText} onCopy={handleCopy} />
        )}
        {showGotoRelatedConversationButton && <GoToButton onClick={onGoToClick} />}
      </div>

      {copied && <span style={styles.copiedMessage}>Copied!</span>}

      <div style={{ ...reactMarkdownStyles }}>
        <ReactMarkdown>{markdownText}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownComponent;
