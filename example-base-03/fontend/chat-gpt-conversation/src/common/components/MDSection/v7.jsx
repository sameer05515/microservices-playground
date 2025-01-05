import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark.css";
import { isValidString } from "../../utils/basic-validations";

hljs.registerLanguage("javascript", javascript);

const MDSectionV7 = ({ mdFileUrl = "" }) => {
  const [markdownContents, setMarkdownContents] = useState("");

  const loadMarkdown = useCallback(async (mdFileUrl) => {
    try {
      console.log("loadMarkdown->  ", mdFileUrl);
      const response = await fetch(mdFileUrl);
      const text = await response.text();
      setMarkdownContents(text);
    } catch (error) {
      console.error("Error loading markdown file:" + mdFileUrl, error);
    }
  }, []);

  useEffect(() => {
    setMarkdownContents("");
    if (isValidString(mdFileUrl)) {
      loadMarkdown(mdFileUrl);
    }
  }, [loadMarkdown, mdFileUrl]);

  return (
    <ReactMarkdown
      className={"prose dark:prose-invert max-w-full"}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { highlighter: hljs }]]}
    >
      {markdownContents}
    </ReactMarkdown>
  );
};

export default MDSectionV7;
