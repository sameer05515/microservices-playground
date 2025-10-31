import React, { useState, memo, useCallback, useEffect, useMemo } from "react";
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

  // Memoize markdown components to prevent recreation on each render
  const markdownComponents = useMemo(() => ({
    table: (props) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700" {...props} />
      </div>
    ),
    th: (props) => (
      <th className="border border-gray-300 dark:border-gray-700 p-2 
        bg-gray-100 dark:bg-gray-800 font-semibold text-left" 
        {...props} />
    ),
    td: (props) => (
      <td className="border border-gray-300 dark:border-gray-700 p-2" 
        {...props} />
    ),
    code: ({inline, ...props}) => (
      inline 
        ? <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded 
            text-blue-600 dark:text-blue-400 text-sm" {...props} />
        : <code {...props} />
    ),
    pre: (props) => (
      <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded 
        overflow-x-auto" {...props} />
    ),
  }), []);

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
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
          className="prose dark:prose-invert max-w-none 
            prose-headings:mt-4 prose-headings:mb-2 prose-headings:text-gray-900 dark:prose-headings:text-gray-100
            prose-p:my-2 prose-p:text-gray-800 dark:prose-p:text-gray-200
            prose-code:text-blue-600 dark:prose-code:text-blue-400
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 dark:prose-strong:text-gray-100
            prose-li:text-gray-800 dark:prose-li:text-gray-200"
        >
          {markdownText}
        </ReactMarkdown>
      </MarkdownErrorBoundary>
    </div>
  );
});

MarkdownComponent.displayName = "MarkdownComponent";

export default MarkdownComponent;
