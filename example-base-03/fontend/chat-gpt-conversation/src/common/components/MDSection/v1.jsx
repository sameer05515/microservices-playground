import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark.css";

hljs.registerLanguage("javascript", javascript);

/**
 * v1 is currently being used in this project. v2, v3, v4, v5 are unstable components and should not be used.
 *
 */

const MDSectionV1 = ({ title = "", content = "" }) => (
  <div className="prose max-w-7xl shadow-md rounded-lg dark:prose-invert">
    {title && <h2 className="text-3xl font-bold mb-6">{title}</h2>}
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeHighlight, { highlighter: hljs }]]}>
      {content}
    </ReactMarkdown>
  </div>
);

export default MDSectionV1;
