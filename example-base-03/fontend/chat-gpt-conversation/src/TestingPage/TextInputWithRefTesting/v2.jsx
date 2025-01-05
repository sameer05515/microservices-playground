import React, { useRef, useState } from "react";
import TextInputWithRef from "../InterviewFinalRoundPreparation/TextInputWithRef";
import ModalV3 from "../../common/hoc/withModal/v3";

const TextInputWithRefTestingV2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const textInputRef = useRef();

  const handleGetValue = () => {
    const value = textInputRef.current?.getValue();
    console.log("Text input value:", value);
  };

  const handleAddErrors = () => {
    textInputRef.current?.addAPIErrorMessages(["Invalid input", "Try again"]);
  };

  const handleSubmit=(value)=>{
    // const value = textInputRef.current?.getValue();
    console.log("Text input value:", value);
    textInputRef.current?.addAPIErrorMessages(["Invalid input", "Try again"]);
  }

  return (
    <div className="p-8">
      <ModalV3 isOpen={isOpen} onClose={() => setIsOpen(false)} showCloseButton>
        <TextInputWithRef title="Add New Section" onSubmit={handleSubmit} ref={textInputRef} />
      </ModalV3>
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
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Open Modal
        </button>
      </div>
    </div>
  );
};

export default TextInputWithRefTestingV2;
