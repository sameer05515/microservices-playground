import React from "react";
import { coversationNames } from "../../../common/utils/constants"; 
import { usePragyamContext } from "../PragyamContext";
import withModal from "../../../common/hoc/withModal/v2";

const mappedArray = Object.entries(coversationNames).map(([key, value]) => {
  return {
    value: value,
    label: key,
  };
});

const JSONFileSelectorV2 = () => {
  const { selectedFile, fetchAndSelectDataForFileName } = usePragyamContext();

  const handleChange = (event) => {
    fetchAndSelectDataForFileName(event.target.value);
  };

  return (
    <div className="p-4 max-w-md mx-auto border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800">
      <label htmlFor="jsonFileSelect" className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
        Change Json file source:
      </label>
      <select
        id="jsonFileSelect"
        className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        onChange={handleChange}
      >
        <option value="" disabled>
          Change Json file source
        </option>
        {mappedArray.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {selectedFile && (
        <div className="mt-4 p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200">
          <strong>Selected file: </strong>
          {selectedFile}
        </div>
      )}
    </div>
  );
};

export default JSONFileSelectorV2;

export const FSWithModal = withModal(JSONFileSelectorV2);
