import React, { useCallback, useEffect, useMemo, useState } from "react";
import MDSectionV1 from "./MDSection/v1";
import { useInterviewFRPV1Context } from "./InterviewFRPV1Context";
// import { getAllQuestions } from "./sectionData1";

const debug = false;

const ExternalLinks = ({ links = [] }) => {
  if (!links.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {links.map((item, index) => (
        <a
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4  shadow-md rounded-md border border-gray-300 hover:bg-gray-100 transition-all"
        >
          <span className="text-blue-600 hover:underline font-medium">{item.title}</span>
        </a>
      ))}
    </div>
  );
};

const extractInfo = (questionData) => ({
  answerFiles: questionData?.data?.answerFiles || [],
  answers: questionData?.data?.answers || [],
  links: questionData?.data?.links || [],
  name: questionData?.data?.name,
  nextId: questionData?.nextId,
  prevId: questionData?.prevId,
  selectedIndex: questionData?.selectedIndex,
  title:
    questionData?.data?.name && questionData?.selectedIndex >= 0
      ? `[${questionData?.selectedIndex + 1}]: ${questionData?.data?.name}`
      : "",
});

const Right = ({ className }) => {
  const { selectedQuestionData, handleQuestionSelection } = useInterviewFRPV1Context();
  const [markdownContents, setMarkdownContents] = useState([]);
  const { answers, nextId, prevId, title, answerFiles, links } = useMemo(
    () => extractInfo(selectedQuestionData),
    [selectedQuestionData]
  );

  const handleNavigation = useCallback(
    (id) => {
      if (id && handleQuestionSelection) {
        handleQuestionSelection(id);
      }
    },
    [handleQuestionSelection]
  );

  const loadMarkdown = useCallback(async (fileName) => {
    try {
      // console.log("loadMarkdown->  ", fileName);
      const response = await fetch(`/ques-and-ans/${fileName}`);
      const text = await response.text();
      setMarkdownContents((prev) => [...prev, text]);
    } catch (error) {
      console.error("Error loading markdown file:" + fileName, error);
    }
  }, []);

  useEffect(() => {
    setMarkdownContents([]);
    [...answerFiles].forEach((af) => loadMarkdown(af));
  }, [answerFiles, loadMarkdown]);

  return (
    <div className={`${className} flex flex-col gap-4 p-4`}>
      {/* Question Title */}
      {title && <h2 className="text-xl font-semibold">{title}</h2>}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handleNavigation(prevId)}
          disabled={!prevId}
          className={`px-4 py-2 rounded-lg text-white ${
            prevId ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Prev
        </button>
        <button
          onClick={() => handleNavigation(nextId)}
          disabled={!nextId}
          className={`px-4 py-2 rounded-lg text-white ${
            nextId ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>

      {/* Answers */}
      {answers?.length > 0 && (
        <div className="flex flex-col gap-2">
          {answers.map((ans, idx) => (
            <div key={`ans_${idx + 1}`} className="p-3 shadow-lg rounded-lg">
              <MDSectionV1 content={ans} />
            </div>
          ))}
        </div>
      )}

      {/* Answers */}
      {markdownContents?.length > 0 && (
        <div className="flex flex-col gap-2">
          {markdownContents.map((mdText, idx) => (
            <div key={`md_contents_${idx + 1}`} className="p-3 shadow-lg rounded-lg">
              <MDSectionV1 content={mdText} />
            </div>
          ))}
        </div>
      )}

      {links && <ExternalLinks links={links} />}

      {/* Debug Information */}
      {debug && selectedQuestionData && (
        <div className="mt-6 p-4 bg-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700">Selected Question Data:</h3>
          <pre className="text-sm text-gray-600">
            {/* {JSON.stringify({ selectedQuestionData, markdownContents }, null, 2)} */}
            {/* {JSON.stringify(getAllQuestions(), null, 2)} */}
            {JSON.stringify(links, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Right;
