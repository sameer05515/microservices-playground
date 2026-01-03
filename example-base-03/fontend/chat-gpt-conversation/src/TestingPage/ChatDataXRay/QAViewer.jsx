import React, { useState, useCallback } from "react";
import MDSectionV1 from "../../common/components/MDSection/v1";

const QAViewer = ({ data }) => {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = useCallback(async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  }, []);

  if (!data || !data.q) return null;

  return (
    <div className="max-w-full mx-auto mt-6 space-y-4 p-2 m-2">
      {/* Question Card */}
      <div className="bg-blue-200 dark:bg-blue-950 shadow-md rounded-lg overflow-hidden relative">
        <QAMetadata data={data.q} />
        <div className="relative group">
          <pre className="whitespace-pre-wrap break-words m-4">{data.q.content}</pre>
          <button
            onClick={() => copyToClipboard(data.q.content, `q-${data.q.id}`)}
            className="absolute top-2 right-2 p-2 bg-blue-300 dark:bg-blue-800 hover:bg-blue-400 dark:hover:bg-blue-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy question"
          >
            {copiedId === `q-${data.q.id}` ? (
              <span className="text-green-600 dark:text-green-400">✓</span>
            ) : (
              <span>📋</span>
            )}
          </button>
        </div>
      </div>

      {/* Answer Cards */}
      {Array.isArray(data.ans) && data.ans.length > 0
        ? data.ans.map((answer) => (
            <div key={answer.id || `ans-${Math.random()}`} className="bg-gray-200 dark:bg-gray-900 shadow-md rounded-lg overflow-hidden relative">
              <QAMetadata data={answer} />
              <div className="p-4 relative group">
                <MDSectionV1 content={answer.content} />
                <button
                  onClick={() => copyToClipboard(answer.content, `ans-${answer.id}`)}
                  className="absolute top-6 right-6 p-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy answer"
                >
                  {copiedId === `ans-${answer.id}` ? (
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  ) : (
                    <span>📋</span>
                  )}
                </button>
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

const QAMetadata = ({ data: q }) => {
  if (!q) return null;
  
  return (
    <div className="flex justify-end items-end m-0.5 text-xs gap-2 text-blue-600 dark:text-cyan-300">
      <span className={q.isUserMessage ? "font-thin" : "font-bold"}>
        {q.isUserMessage ? "User Query" : "ChatGPT Response"}
      </span>
      {q.createdOn && <span>createdOn: {q.createdOn}</span>}
      {q.updatedOn && <span>updatedOn: {q.updatedOn}</span>}
    </div>
  );
};

export default QAViewer;
