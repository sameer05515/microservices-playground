import React, { useRef} from "react";
import TextInputWithRef from "../InterviewFinalRoundPreparation/TextInputWithRef";

const TextInputWithRefTestingV1 = () => {
  
  const textInputRef = useRef();

  const handleGetValue = () => {
    const value = textInputRef.current?.getValue();
    console.log("Text input value:", value);
  };

  const handleAddErrors = () => {
    textInputRef.current?.addAPIErrorMessages(["Invalid input", "Try again"]);
  };

  return (
    <div className="p-8">
      <TextInputWithRef ref={textInputRef} />
      <div className="mt-4">
        <button
          onClick={handleGetValue}
          className="px-4 py-2 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
        >
          Get Value
        </button>
        <button
          onClick={handleAddErrors}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Add Errors
        </button>
      </div>
    </div>
  );
};

export default TextInputWithRefTestingV1;
