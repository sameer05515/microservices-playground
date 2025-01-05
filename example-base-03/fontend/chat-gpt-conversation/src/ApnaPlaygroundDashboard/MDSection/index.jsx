import React, { useState } from "react";
import MDSectionV1 from "../../common/components/MDSection/v1";
import MDSectionV2 from "../../common/components/MDSection/v2";
import MDSectionV3 from "../../common/components/MDSection/v3";
import MDSectionV4 from "../../common/components/MDSection/v4";
import MDSectionV5 from "../../common/components/MDSection/v5";

const MDSection = {
  MDSectionV1,
  MDSectionV2,
  MDSectionV3,
  MDSectionV4,
  MDSectionV5,
};

const MDSectionTestingDashboard = () => {
  const [content, setContent] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6">
      {/* Dashboard Header */}
      <h2 className="text-3xl font-semibold text-center text-blue-600 dark:text-blue-400 mb-6 md:text-4xl">
        MDSection Testing Dashboard
      </h2>

      {/* Markdown Input Section */}
      <div className="mb-8">
        <label htmlFor="markdown-input" className="block text-lg font-medium mb-2">
          Enter Markdown Content:
        </label>
        <textarea
          id="markdown-input"
          className="w-full p-4 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
          rows="8"
          placeholder="Type your Markdown content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>

      {/* Rendered Markdown Sections */}
      <div className="space-y-10">
        {Object.keys(MDSection).map((key, idx) => {
          const Section = MDSection[key];
          return (
            <div key={`idx_${idx + 1}`}>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">{key}</h3>
              <Section title={`Rendered by ${key}`} content={content || ""} />
            </div>
          );
        })}
        {/* <div>
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">MDSection V4</h3>
          <MDSectionV4 title="Rendered by MDSectionV3" content={content || ""} />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">MDSection V5</h3>
          <MDSectionV5 title="Rendered by MDSectionV3" content={content || ""} />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">MDSection V3</h3>
          <MDSectionV3 title="Rendered by MDSectionV3" content={content || ""} />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">MDSection V1</h3>
          <MDSectionV1 title="Rendered by MDSectionV1" content={content || ""} />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">MDSection V2</h3>
          <MDSectionV2 title="Rendered by MDSectionV2" content={content || ""} />
        </div> */}
      </div>
    </div>
  );
};

export default MDSectionTestingDashboard;
