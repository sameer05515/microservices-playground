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

const MarkdownComponent = ({
    markdownText = "",
    additionalStyle = {},
    showCopyToclipboardButton = true,
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
                    <CopyToClipboard text={markdownText} onCopy={handleCopy}>
                        <button style={{ ...styles.button, ...styles.copyButton }}>
                            Copy to Clipboard
                        </button>
                    </CopyToClipboard>
                )}
                <button style={{ ...styles.button, ...styles.goToButton }}>
                    Go to Related Conversation
                </button>
            </div>

            {copied && <span style={styles.copiedMessage}>Copied!</span>}

            <ReactMarkdown>{markdownText}</ReactMarkdown>
        </div>
    );
};

export default MarkdownComponent;
