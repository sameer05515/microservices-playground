import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

/**
 * MDSectionV4: This is too an unstable component, but partially it is able to fulfill the purpose, hence it is kept as reference
 * 
 * please use [v1](./v1.jsx) for other parts of application
 */
const MDSectionV4 = ({ title = "", content = "" }) => {
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert("Code copied!");
  };

  const customComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      if (inline) {
        // Inline code styling
        return (
          <code
            className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }
      // Block code with syntax highlighting
      return (
        <div className="relative group">
          <SyntaxHighlighter
            style={a11yDark}
            language={match?.[1] || ""}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
          <button
            onClick={() => handleCopy(String(children).replace(/\n$/, ""))}
            className="absolute top-2 right-2 bg-gray-800 text-gray-300 rounded p-1 text-sm opacity-0 group-hover:opacity-100 hover:bg-gray-700 transition"
          >
            📋 Copy
          </button>
        </div>
      );
    },
  };

  return (
    <div className="prose max-w-7xl w-full p-8 shadow-md rounded-lg my-8 mx-auto dark:prose-invert">
      {title && (
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          {title}
        </h2>
      )}
      <ReactMarkdown
        className="post-markdown"
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MDSectionV4;
