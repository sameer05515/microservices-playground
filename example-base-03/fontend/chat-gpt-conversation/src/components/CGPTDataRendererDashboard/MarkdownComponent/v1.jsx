import React, { useState, memo, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { CopyToClipboard } from "react-copy-to-clipboard";

// Extracted CopyButton component
const CopyButton = memo(({ textToCopy, onCopy, copied }) => (
  <CopyToClipboard text={textToCopy} onCopy={onCopy}>
    <button 
      className={`px-3 py-1 rounded cursor-pointer transition-colors duration-200 
        ${copied 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      disabled={copied}
    >
      {copied ? 'Copied!' : 'Copy to Clipboard'}
    </button>
  </CopyToClipboard>
));

CopyButton.displayName = "CopyButton";

// Extracted GoToButton component
const GoToButton = memo(({ onClick }) => (
  <button 
    className="px-3 py-1 rounded cursor-pointer bg-green-500 text-white 
      hover:bg-green-600 transition-colors duration-200 focus:outline-none 
      focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" 
    onClick={onClick}
  >
    Go to Related Conversation
  </button>
));

GoToButton.displayName = "GoToButton";

// Error Boundary for Markdown rendering
class MarkdownErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-4 border border-red-300 rounded">
          Error rendering markdown content.
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Enhanced MarkdownComponent with error boundary and optimized rendering
 * @param {Object} props Component props
 * @param {string} props.markdownText The markdown content to render
 * @param {string} [props.className] Additional CSS classes
 * @param {boolean} [props.showCopyToclipboardButton=false] Whether to show the copy button
 * @param {boolean} [props.showGotoRelatedConversationButton=false] Whether to show the goto button
 * @param {Function} [props.onGoToClick] Callback for goto button click
 */
const MarkdownComponent = memo(({
  markdownText = "",
  className = "",
  showCopyToclipboardButton = false,
  showGotoRelatedConversationButton = false,
  onGoToClick = () => {},
}) => {
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    let timeoutId;
    if (copied) {
      timeoutId = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timeoutId);
  }, [copied]);

  const handleCopy = useCallback(() => {
    setCopied(true);
  }, []);

  return (
    <div className={`markdown-body p-3 bg-gray-50 dark:bg-gray-800 
      rounded-lg border border-gray-300 dark:border-gray-700 ${className}`}>
      <div className="flex justify-between items-center mb-3 gap-2">
        {showCopyToclipboardButton && (
          <CopyButton 
            textToCopy={markdownText} 
            onCopy={handleCopy}
            copied={copied}
          />
        )}
        {showGotoRelatedConversationButton && (
          <GoToButton onClick={onGoToClick} />
        )}
      </div>

      <MarkdownErrorBoundary>
        <div className="prose dark:prose-invert max-w-none 
          prose-headings:mt-4 prose-headings:mb-2
          prose-p:my-2 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
          prose-code:text-blue-600 dark:prose-code:text-blue-400
          prose-table:border-collapse prose-table:w-full
          prose-td:border prose-td:p-2 prose-td:dark:border-gray-700
          prose-th:border prose-th:p-2 prose-th:bg-gray-100 prose-th:dark:bg-gray-800 prose-th:dark:border-gray-700">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-4">
                  <table {...props} />
                </div>
              )
            }}
          >
            {markdownText}
          </ReactMarkdown>
        </div>
      </MarkdownErrorBoundary>
    </div>
  );
});

MarkdownComponent.displayName = "MarkdownComponent";

export default MarkdownComponent;
