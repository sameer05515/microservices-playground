import React, { useState, forwardRef, useImperativeHandle } from "react";

const TextInputWithRef = forwardRef(({ title, onSubmit, initialText = "" }, ref) => {
  const [value, setValue] = useState(initialText || "");
  const [errorMessages, setErrorMessages] = useState([]);

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    getValue: () => value,
    addAPIErrorMessages: (messages) => {
      if (Array.isArray(messages)) {
        setErrorMessages(messages);
      } else {
        console.warn("addAPIErrorMessages expects an array of strings.");
      }
    },
  }));

  const handleClear = () => {
    setValue("");
    setErrorMessages([]);
  };

  const handleSubmit = () => {
    if (!value) {
      setErrorMessages(["Please add some text!"]);
      return;
    }
    onSubmit?.(value);
    // console.log("Submitted value:", value);
  };

  return (
    <div className="p-4 border rounded shadow-lg">
      {title && <p className="text-lg font-semibold">{title}</p>}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-white text-black p-2 border rounded mb-2"
        placeholder="Enter text here"
      />
      {errorMessages.length > 0 && (
        <ul className="text-red-500 text-sm mb-2">
          {errorMessages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      )}
      <div className="flex justify-between">
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
        <button onClick={handleClear} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
          Clear
        </button>
      </div>
    </div>
  );
});

export default TextInputWithRef;
