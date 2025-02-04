import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark.css";

hljs.registerLanguage("javascript", javascript);

const MDSectionV1 = ({ content = "" }) => (
  <ReactMarkdown
    className={"prose dark:prose-invert max-w-full"}
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[[rehypeHighlight, { highlighter: hljs }]]}
  >
    {content}
  </ReactMarkdown>
);

export default MDSectionV1;
