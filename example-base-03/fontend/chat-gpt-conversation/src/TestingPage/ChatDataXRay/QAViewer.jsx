import React from "react";

const QAViewer = ({ data }) => {
  if (!data) return null;

  return (
    <div className="container mt-4">
      <div className="card mb-3">
        <div className="card-header bg-primary text-white">
          <h5>Question</h5>
        </div>
        <div className="card-body">
          <p className="card-text">{data.q.content}</p>
        </div>
      </div>

      {data.ans.map((answer) => (
        <div key={answer.id} className="card mb-3">
          <div className="card-header bg-success text-white">
            <h6>Answer</h6>
          </div>
          <div className="card-body">
            <div
              className="card-text"
              dangerouslySetInnerHTML={{ __html: answer.content.replace(/\n/g, "<br/>") }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default QAViewer;
