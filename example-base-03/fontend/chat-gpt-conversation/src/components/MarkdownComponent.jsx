import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
            style={{ padding: "5px", ...additionalStyle }}
        >
            {showCopyToclipboardButton && (
                <CopyToClipboard text={markdownText} onCopy={handleCopy}>
                    <button>Copy to Clipboard</button>
                </CopyToClipboard>
            )}
            {copied ? <span style={{ color: "green" }}>Copied!</span> : null}
            <ReactMarkdown>{markdownText}</ReactMarkdown>
        </div>
    );
};

export default MarkdownComponent;
