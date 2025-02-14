import React, { useState, useCallback } from "react";
import MDSectionV8 from "../../common/components/MDSection/v8";

const MDSectionV8TesingV2 = () => {
    //"http://localhost:3000/v2/api/smart-content/itr1/actionables--my-bugs-and-new-requirements-md"
  const [mdFileUrl, setMdFileUrl] = useState("http://localhost:3000/v2/api/smart-content/itr1/actionables--my-bugs-and-new-requirements-md");
  const [submittedUrl, setSubmittedUrl] = useState("");

  const handleRecievingSuccessResponse = useCallback((response) => response.data?.content || "", []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedUrl(mdFileUrl.trim() ? mdFileUrl : ""); // Trim to remove accidental spaces
  };

  return (
    <div className="p-4">
      {/* Input & Button */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          className="border px-3 py-2 w-full bg-white text-black rounded"
          placeholder="Enter markdown file URL"
          value={mdFileUrl}
          onChange={(e) => setMdFileUrl(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          Load
        </button>
      </form>

      {/* Conditional Rendering */}
      {submittedUrl && (
        <MDSectionV8 mdFileUrl={submittedUrl} onRecievingSuccessResponse={handleRecievingSuccessResponse} />
      )}
    </div>
  );
};

export default MDSectionV8TesingV2;
