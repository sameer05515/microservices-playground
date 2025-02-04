import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark.css";

hljs.registerLanguage("javascript", javascript);

/**
 * MDSectionV1 Component
 *
 * > ====================== NOTE ==========================  
 * > v2 is unstable component and kept just for reference.
 * > 
 * > please refer details [here](./v2-details.md)
 * > 
 * > All enhancementS and bug-fixes were being done in v3/v4. 
 * 
 *  but for prod please use [v1](./v1.jsx) only, untill advanced functionalities are well tested 
 * >
 * > ==========================================
 *
 * A React component for rendering Markdown content with syntax highlighting,
 * light/dark theme compatibility, and a copy-to-clipboard feature for code blocks.
 *
 * Features:
 * - Renders Markdown content dynamically using `ReactMarkdown`.
 * - Supports GitHub Flavored Markdown (GFM) via the `remark-gfm` plugin.
 * - Provides syntax highlighting for code blocks using `rehype-highlight` and `highlight.js`.
 * - Includes a "Copy to Clipboard" button for each code block, visible on hover.
 * - Fully supports light and dark themes with TailwindCSS's `prose` and `dark:prose-invert` classes.
 *
 * Props:
 * - `title` (string): The optional title for the Markdown section. Defaults to an empty string.
 * - `content` (string): The Markdown content to render. Defaults to an empty string.
 *
 * Limitations:
 * - Currently, the code block theme is static (`github-dark.css`) and does not dynamically switch
 *   between light and dark themes.
 * - The component is marked as unstable for future improvements.
 *   Refer to details [here](./v2-details.md) for extended documentation and usage examples.
 *
 * Usage Example:
 * ```jsx
 * <MDSectionV1
 *   title="Markdown Example"
 *   content={`
 *     ## Features
 *     - **Syntax Highlighting**
 *     - **Light/Dark Theme Support**
 *
 *     \`\`\`javascript
 *     const greet = (name) => console.log(\`Hello, \${name}!\`);
 *     greet("World");
 *     \`\`\`
 *   `}
 * />
 * ```
 */

const MDSectionV2 = ({ title = "", content = "" }) => {
  // Function to handle copy to clipboard
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
  };

  // Custom renderers for ReactMarkdown
  const customComponents = {
    code({ inline, className, children, ...props }) {
      const language = className?.replace("language-", "") || "plaintext";
      return !inline ? (
        <div className="relative group">
          {/* Code Block */}
          <pre className={`hljs ${language} p-4 rounded-md`}>
            <code {...props}>{children}</code>
          </pre>
          {/* Copy Button */}
          <button
            onClick={() => handleCopy(children)}
            className="absolute top-2 right-2 text-gray-400 bg-gray-800 rounded p-1 opacity-0 group-hover:opacity-100 transition"
            title="Copy to clipboard"
          >
            📋
          </button>
        </div>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="prose max-w-7xl w-full p-8 shadow-md rounded-lg my-8 mx-auto dark:prose-invert">
      {title && <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{title}</h2>}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={customComponents} // Use custom renderers
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MDSectionV2;
