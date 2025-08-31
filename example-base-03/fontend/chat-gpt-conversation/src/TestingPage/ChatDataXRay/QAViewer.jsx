import React from "react";
import MDSectionV1 from "../../common/components/MDSection/v1";

const QAViewer = ({ data }) => {
  if (!data) return null;

  return (
    <div className="max-w-full mx-auto mt-6 space-y-4 p-2 m-2">
      {/* Question Card */}
      <div className="bg-gray-200 dark:bg-blue-700 shadow-md rounded-lg overflow-hidden">
        {/* <MDSectionV1 content={data.q.content} /> */}
        <pre className="whitespace-pre-wrap break-words m-10">{data.q.content}</pre>
      </div>

      {/* Answer Cards */}
      {data.ans.map((answer) => (
        <div key={answer.id} className="bg-white dark:bg-black shadow-md rounded-lg overflow-hidden p-10">
          <MDSectionV1 content={answer.content} />
        </div>
      ))}
    </div>
  );
};

export default QAViewer;
