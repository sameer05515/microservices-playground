import React from "react";
import MDSectionV1 from "../../common/components/MDSection/v1";

const QAViewer = ({ data }) => {
  if (!data) return null;

  return (
    <div className="max-w-full mx-auto mt-6 space-y-4 p-2 m-2">
      {/* Question Card */}
      <div className="bg-blue-200 dark:bg-blue-950 shadow-md rounded-lg overflow-hidden">
        <QAMetadata data={data.q} />
        <pre className="whitespace-pre-wrap break-words m-4">{data.q.content}</pre>
      </div>

      {/* Answer Cards */}
      {data.ans.map((answer) => (
        <div key={answer.id} className="bg-gray-200 dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
          <QAMetadata data={answer} />
          <div className="p-4">
            <MDSectionV1 content={answer.content} />
          </div>
        </div>
      ))}
    </div>
  );
};

const QAMetadata = ({ data: q }) => (
  <div className="flex justify-end items-end m-0.5 text-xs gap-2 text-blue-600 dark:text-cyan-300">
    <span className={q.isUserMessage ? "font-thin" : "font-bold"}>
      {q.isUserMessage ? "User Query" : "ChatGPT Response"}
    </span>
    {q.createdOn && <span>createdOn: {q.createdOn}</span>}
    {q.updatedOn && <span>updatedOn: {q.updatedOn}</span>}
  </div>
);

export default QAViewer;
