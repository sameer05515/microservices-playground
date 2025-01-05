import React, { useState } from "react";
import MDSectionV1 from "../InterviewFinalRoundPreparation/MDSection/v1";
import { prepareErrorMessage } from "../../common/utils/message-preparation-utils-v2";

const OpenMdFileOnButtonClickV1 = () => {
  const [markdownContent, setMarkdownContent] = useState("");

  const loadMarkdown = async (fileName) => {
    try {
      const response = await fetch(`/ques-and-ans/${fileName}`);
      if(!response.ok){
        throw new Error("Error occurred!");
      }
      const text = await response.text();
      setMarkdownContent(text);
    } catch (error) {
      setMarkdownContent("# Error \n"+prepareErrorMessage(error,"Error loading markdown file"));
      console.error("Error loading markdown file:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Button Section */}
      <div style={{ width: "30%", padding: "1rem", borderRight: "1px solid #ccc" }}>
        <button onClick={() => loadMarkdown("file1.md")} style={{ display: "block", margin: "1rem 0" }}>
          Open File 1
        </button>
        <button onClick={() => loadMarkdown("16Jan2025.java--what-are-lambda-expressions-and-how-do-they-differ-from-anonymous-classes.md")} style={{ display: "block", margin: "1rem 0" }}>
          Open File 2
        </button>
      </div>

      {/* Markdown Content Section */}
      <div style={{ width: "70%", padding: "1rem" }}>
        {/* <ReactMarkdown>{markdownContent}</ReactMarkdown> */}
        <MDSectionV1 content={markdownContent}/>
      </div>
    </div>
  );
};




export default OpenMdFileOnButtonClickV1