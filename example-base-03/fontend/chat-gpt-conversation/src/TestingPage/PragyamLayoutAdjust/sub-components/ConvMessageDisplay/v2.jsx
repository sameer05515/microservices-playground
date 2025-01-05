import React, { useState } from "react";
// import MDSectionV1 from "./MDSection/v1";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCopy, FiCheck } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("javascript", javascript);

const ConvMessageDisplay = ({
  markdownText = "",
  showCopyToclipboardButton = false,
  showGotoRelatedConversationButton = false,
  onGoToClick = () => {},
  isUserMessage = false,
  updatedOn,
  createdOn,
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
      className={`p-2 m-2 border border-gray-300 dark:border-gray-700 rounded-lg ${
        isUserMessage
          ? "ml-40 font-thin border-yellow-300 bg-lime-300 dark:bg-lime-900"
          : "mr-20 border-purple-300"
      }`}
    >
      <div className="flex justify-end items-end m-0.5 text-xs gap-2 text-blue-600 dark:text-cyan-300">
        <span className={isUserMessage ? "font-thin" : "font-bold"}>
          {isUserMessage ? "User Query" : "ChatGPT Response"}
        </span>
        {createdOn && <span>createdOn: {createdOn}</span>}
        {updatedOn && <span>updatedOn: {updatedOn}</span>}
      </div>

      <div className="flex justify-between items-center mb-0.5 text-xs">
        {showCopyToclipboardButton && !copied && (
          <CopyToClipboard text={markdownText} onCopy={handleCopy}>
            <button
              className="flex items-center gap-2 px-2 py-1 bg-blue-600 dark:bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              title="Copy to Clipboard"
            >
              <FiCopy className="text-sm" size={8} />
              {/* Copy to Clipboard */}
            </button>
          </CopyToClipboard>
        )}
        {copied && (
          <span className="flex items-center gap-2 text-green-600 text-sm font-medium" title="Copied!">
            <FiCheck className="text-sm" size={8} />
            Copied!
          </span>
        )}

        {showGotoRelatedConversationButton && (
          <button
            className="flex items-center gap-2 px-2 py-1 bg-green-500 dark:bg-cyan-300 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
            onClick={onGoToClick}
            title="Go to Related Conversation"
          >
            Go to Related Conversation
          </button>
        )}
      </div>

      {isUserMessage && <pre className="whitespace-pre-wrap break-words">{markdownText}</pre>}

      {!isUserMessage && (
        <ReactMarkdown
          className={`prose dark:prose-invert max-w-full`}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeHighlight, { highlighter: hljs }]]}
        >
          {markdownText}
        </ReactMarkdown>
      )}
      {/* <div className="flex justify-end items-end m-0.5 text-xs gap-2 text-blue-600 dark:text-cyan-300">
        <span className={isUserMessage ? "font-thin" : "font-bold"}>
          {isUserMessage ? "User Query" : "ChatGPT Response"}
        </span>
        {createdOn && <span>createdOn: {createdOn}</span>}
        {updatedOn && <span>updatedOn: {updatedOn}</span>}
      </div> */}
    </div>
  );
};

export default ConvMessageDisplay;
