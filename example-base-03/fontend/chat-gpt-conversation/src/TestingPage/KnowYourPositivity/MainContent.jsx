import { useSelector } from "react-redux";
import SastaDBService from "./SastaDBService";
import { useEffect, useState } from "react";
import MDSectionV1 from "../../common/components/MDSection/v1";
// import { marked } from "marked";
import { selectApplicationStateSelectedId } from "../../store/v2/selectors";

const MainContent = () => {
  const selectedId = useSelector(selectApplicationStateSelectedId);
  const [sentence, setSentence] = useState("Loading...");
  const [section, setSection] = useState("Loading...");

  useEffect(() => {
    const sentenceData = SastaDBService.getSentenceById(selectedId);
    if (sentenceData) {
      setSentence(sentenceData.text);
      setSection(SastaDBService.getSectionById(sentenceData.parentSectionId)?.title || "Unknown Section");
    }
  }, [selectedId]);

  return (
    <main className="flex-grow flex items-center justify-center pt-24 pb-16">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl text-center">
        <h1 className="prose text-3xl font-bold text-gray-800 mb-4">{section}</h1>
        {/* <p className="prose text-lg text-gray-600" dangerouslySetInnerHTML={{ __html: sentence }} /> */}
        <MDSectionV1 content={sentence} />
      </div>
    </main>
  );
};

export default MainContent;
