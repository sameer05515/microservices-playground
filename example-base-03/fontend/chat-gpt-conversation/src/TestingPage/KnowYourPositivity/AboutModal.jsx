import React, { useCallback } from "react";
// import { marked } from "marked";
import MDSectionV8 from "../../common/components/MDSection/v8";

const AboutModal = ({ onClose }) => {
  //   const [content, setContent] = useState("Fetching...");
  const handleRecievingSuccessResponse = useCallback((response) => response.data?.content || "", []);

  //   useEffect(() => {
  //     fetch("http://localhost:3000/v2/api/smart-content/itr1/15Feb2025.know-your-positivity--about-this-module--index-v1-md")
  //       .then((res) => res.json())
  //       .then((data) => setContent(marked.parse(data.content)))
  //       .catch(() => setContent('<p class="text-red-500">Failed to load content.</p>'));
  //   }, []);

  //   return (
  //     <>
  //       <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
  //       <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 w-96 rounded-lg shadow-lg z-50">
  //         <button className="absolute top-2 right-3 text-red-500 text-xl" onClick={onClose}>
  //           &times;
  //         </button>
  //         <h2 className="text-xl font-bold mb-3">About This Module</h2>
  //         {/* <div className="prose text-gray-700" dangerouslySetInnerHTML={{ __html: content }} /> */}
  // <MDSectionV8
  //   mdFileUrl="http://localhost:3000/v2/api/smart-content/itr1/15Feb2025.know-your-positivity--about-this-module--index-v1-md"
  //   onRecievingSuccessResponse={handleRecievingSuccessResponse}
  // />
  //       </div>
  //     </>
  //   );

  return (
    <MDSectionV8
      mdFileUrl="http://localhost:3000/v2/api/smart-content/itr1/15Feb2025.know-your-positivity--about-this-module--index-v1-md"
      onRecievingSuccessResponse={handleRecievingSuccessResponse}
    />
  );
};

export default AboutModal;
