import React from "react";
// import { FiEdit, FiPlusCircle, FiUserPlus } from "react-icons/fi";
import { useConsolidatedReportContext } from "../context/v1";

const SectionItem = ({ question: q, qIdx }) => {
  const { selectedSectionItemId, handleSectionItemSelection, selectedSectionItemRef } =
    useConsolidatedReportContext();
  return (
    <div className="ml-2 pb-2 flex justify-between items-end mb-0.5 text-xs">
      <p
        ref={selectedSectionItemId === q.uniqueId ? selectedSectionItemRef : null}
        onClick={() => handleSectionItemSelection?.(q.uniqueId)}
        className={`text-base hover:font-semibold cursor-pointer ${
          selectedSectionItemId === q.uniqueId
            ? "font-bold text-yellow-950 dark:text-yellow-200"
            : "font-normal"
        }`}
      >
        {qIdx + 1}: {q.name}
      </p>
    </div>
  );
};

const Section = ({
  section = { uniqueId: "", type: "", items: [] },
  extraClasses = { main: "", name: "" },
}) => {
  if (!section) {
    return null;
  }
  return (
    <div className={`pb-4 ${extraClasses.main}`} key={section.uniqueId}>
      <div className="flex justify-between items-end mb-0.5 text-xs">
        <p className={`font-bold text-xl ${extraClasses.name}`}>{section.type}</p>
      </div>
      {section?.items &&
        section?.items.map((q, qIdx) => <SectionItem key={q.uniqueId} question={q} qIdx={qIdx} />)}
    </div>
  );
};

const Left = ({ className }) => {
  const { isSectionListDataLoading, sectionListOperationErrorMessage, sectionsForLeftList } =
    useConsolidatedReportContext();
  if (isSectionListDataLoading)
    return (
      <div className="flex justify-center items-center text-wrap">
        <p className="text-lg font-semibold text-blue-600 animate-pulse">Loading...</p>
      </div>
    );

  if (sectionListOperationErrorMessage)
    return (
      <div className="flex justify-center items-center text-wrap">
        <p className="text-lg font-semibold text-red-600">Error: {sectionListOperationErrorMessage}</p>
      </div>
    );
  return (
    <div className={className}>
      {/* Left
      {JSON.stringify(sectionData, null, 2)} */}
      {sectionsForLeftList &&
        sectionsForLeftList.map((section) => <Section key={section.uniqueId} section={section} />)}
    </div>
  );
};

export default Left;
