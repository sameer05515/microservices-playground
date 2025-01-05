import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";


/**
 * This is too an unstable component, but partially it is able to fulfill the purpose, hence it is kept as reference
 * 
 * please use [v1](./v1.jsx) for other parts of application
 * 
 * for a markdown with copy button, this v3 version can be used, but with precaution.
 * 
 * */

const MDSectionV3 = ({ title = "", content = "" }) => {
  // Custom `pre` component with Copy Button
  const Pre = ({ children }) => (
    <div className="relative group">
      <CodeCopyBtn>{children}</CodeCopyBtn>
      {children}
    </div>
  );

  return (
    <div className="prose max-w-7xl w-full p-8 shadow-md rounded-lg my-8 mx-auto dark:prose-invert">
      {title && <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{title}</h2>}
      <ReactMarkdown
        className="post-markdown"
        // linkTarget="_blank"
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          pre: Pre,
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter style={a11yDark} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// Copy Button Component
const CodeCopyBtn = ({ children }) => {
  const handleCopy = () => {
    const code = children.props.children[0];
    navigator.clipboard.writeText(code);
    alert("Code copied!");
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 bg-gray-800 text-gray-300 rounded p-1 text-sm hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition"
    >
      📋 Copy
    </button>
  );
};
export default MDSectionV3;
