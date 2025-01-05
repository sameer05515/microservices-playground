import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark.css";

hljs.registerLanguage("javascript", javascript);

/**
 * v1 is currently being used in this project. v2 and v3, v4 and v5 are unstable components and should not be used.
 *
 */

const MDSectionV5 = ({ title = "", content = "" }) => {
  // Function to handle copy
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert("Code copied!");
  };

  // Custom components for ReactMarkdown
  const customComponents = {
    code({ node, inline, className, children, ...props }) {
    //   const match = /language-(\w+)/.exec(className || "");
      if (inline) {
        return (
          <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
            {children}
          </code>
        );
      }
      return (
        <div className="relative group">
          <pre className="bg-gray-800 text-white p-4 rounded-md">
            <code className={className} {...props}>
              {String(children).replace(/\n$/, "")}
            </code>
          </pre>
          {/* Copy button */}
          <button
            onClick={() => handleCopy(String(children).replace(/\n$/, ""))}
            className="absolute top-2 right-2 bg-gray-800 text-white rounded p-2 opacity-0 group-hover:opacity-100 transition"
          >
            📋 Copy
          </button>
        </div>
      );
    },
  };

  return (
    <div className="prose max-w-7xl w-full p-8 shadow-md rounded-lg my-8 mx-auto dark:prose-invert">
      {title && <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{title}</h2>}
      <ReactMarkdown
        className="post-markdown"
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { highlighter: hljs }]]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MDSectionV5;
