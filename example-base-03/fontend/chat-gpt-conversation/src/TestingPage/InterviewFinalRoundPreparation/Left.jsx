import React, { useCallback } from "react";
import { sectionData1 } from "./sectionData1";
import { ModalOpenPurposes, useInterviewFRPV1Context } from "./InterviewFRPV1Context";
import { FiEdit, FiPlusCircle, FiUserPlus } from "react-icons/fi";

const QuestionListItem = ({ question: q, qIdx }) => {
  const { selectedQuestionId, handleQuestionSelection, selectedQuestionListItemRef } =
    useInterviewFRPV1Context();
  return (
    <div className="ml-2 pb-2 flex justify-between items-end mb-0.5 text-xs">
      <p
        ref={selectedQuestionId === q.id ? selectedQuestionListItemRef : null}
        onClick={() => handleQuestionSelection?.(q.id)}
        className={`text-base hover:font-semibold cursor-pointer ${
          selectedQuestionId === q.id ? "font-bold text-yellow-950 dark:text-yellow-200" : "font-normal"
        }`}
      >
        {qIdx + 1}: {q.name}
      </p>
      <span
        className="flex items-center gap-2 px-2 py-1 bg-blue-600 dark:bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer"
        title="Edit Question"
      >
        <FiEdit className="text-sm" size={8} />
      </span>
    </div>
  );
};

const Section = ({
  section = { id: "", name: "", subSections: [], questions: [] },
  extraClasses = { main: "", name: "" },
}) => {
  const { openTextInputModal } = useInterviewFRPV1Context();

  const openTIForEditSection = useCallback(
    (section) => {
      openTextInputModal("Edit Section", ModalOpenPurposes.EditSection, {
        id: section.id,
        text: section.name,
      });
    },
    [openTextInputModal]
  );
  if (!section) {
    return null;
  }
  return (
    <div className={`pb-4 ${extraClasses.main}`} key={section.id}>
      <div className="flex justify-between items-end mb-0.5 text-xs">
        <p className={`font-bold text-xl ${extraClasses.name}`}>{section.name}</p>
        <span
          className="flex items-center gap-2 px-2 py-1 bg-blue-600 dark:bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer"
          title="Edit"
        >
          <FiEdit className="text-sm" size={8} onClick={() => openTIForEditSection(section)} />
        </span>
        <span
          className="flex items-center gap-2 px-2 py-1 bg-blue-600 dark:bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer"
          title="Add Subsection"
        >
          <FiUserPlus className="text-sm" size={8} />
        </span>
        <span
          className="flex items-center gap-2 px-2 py-1 bg-blue-600 dark:bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer"
          title="Add Question"
        >
          <FiPlusCircle className="text-sm" size={8} />
        </span>
      </div>
      {section?.subSections &&
        section?.subSections.map((subSection) => (
          <Section
            key={subSection.id}
            extraClasses={{ main: "ml-2 pb-2", name: "font-semibold text-lg" }}
            section={subSection}
          />
        ))}
      {section?.questions &&
        section?.questions.map((q, qIdx) => <QuestionListItem key={q.id} question={q} qIdx={qIdx} />)}
    </div>
  );
};

const Left = ({ className }) => {
  return (
    <div className={className}>
      {[...sectionData1].map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  );
};

export default Left;
