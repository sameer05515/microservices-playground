import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark.css";
import { isValidString } from "../../utils/basic-validations";
import { apiRequest } from "../../utils/apiClient/v1";

hljs.registerLanguage("javascript", javascript);

/**
 * Abhi ke liye ye version kaam chalau solution de raha hai.
 *  But in future, hum log ko MDSection ka ek naya version banana chaiye, jo ek promise callback accept kare aur
 * text response kare. baaki complexity, calling component handle kare.
 * Iss tarah se response kaise get karna hai aur usme se text-content kaise nikalna hai ye totally calling function ke control me rahega.
 *
 */

/**
 * Currently, this version serves as a temporary workaround.
 * However, in the future, we should create a new version of `MDSection`
 * that accepts a promise-based callback and returns a text response.
 * The responsibility of handling complexities, such as making API calls
 * and extracting text content, should be delegated to the calling component.
 * This approach will provide greater flexibility and keep the control
 * of response handling entirely within the calling function.
 */

const MDSectionV8 = ({
  mdFileUrl = "",
  onRecievingSuccessResponse = (response = { data: {}, isError: false, message: "" }) => "",
}) => {
  const [markdownContents, setMarkdownContents] = useState("");

  const loadMarkdown = useCallback(
    async (mdFileUrl) => {
      try {
        if (typeof onRecievingSuccessResponse !== "function") {
          throw new Error("'onRecievingSuccessResponse' callback not provided");
        }
        console.log("loadMarkdown->  ", mdFileUrl);
        const response = await apiRequest({ url: mdFileUrl, method: "get" });
        if (response.isError) {
          throw new Error(response.message || "Error in fetching data");
        }
        //   const text = response.data.content;
        const text = onRecievingSuccessResponse?.(response);
        setMarkdownContents(text);
      } catch (error) {
        console.error("Error loading markdown file:" + mdFileUrl, error);
      }
    },
    [onRecievingSuccessResponse]
  );

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

export default MDSectionV8;
