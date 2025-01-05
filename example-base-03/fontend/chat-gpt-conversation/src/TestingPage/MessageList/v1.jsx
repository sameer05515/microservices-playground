import React, { useState } from "react";
// import PropTypes from "prop-types";

const MessagesList = ({ messages, onPrevClick, onNextClick, showButtons }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      {/* Messages List */}
      <ul className="divide-y divide-gray-200">
        {messages.map((message, index) => (
          <li key={index} className="py-2 px-4 hover:bg-gray-50 transition duration-200">
            <p className="text-sm text-gray-800">{message.text}</p>
          </li>
        ))}
      </ul>

      {/* Buttons Row */}
      {showButtons && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onPrevClick}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Prev
          </button>
          <button
            onClick={onNextClick}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const MessagesListV1 = () => {
  const [messages] = useState([{ text: "Message 1" }, { text: "Message 2" }, { text: "Message 3" }]);

  const handlePrev = () => {
    console.log("Prev button clicked");
  };

  const handleNext = () => {
    console.log("Next button clicked");
  };

  return (
    <MessagesList messages={messages} onPrevClick={handlePrev} onNextClick={handleNext} showButtons={true} />
  );
};

export default MessagesListV1;
