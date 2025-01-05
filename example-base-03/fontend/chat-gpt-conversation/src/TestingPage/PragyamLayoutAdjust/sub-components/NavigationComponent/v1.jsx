import React from "react";
import { AiFillForward as NextIcon, AiFillBackward as PrevIcon } from "react-icons/ai";

const NavigationComponentV1 = ({
  onPrevClick = () => {},
  onNextClick = () => {},
  conversationTitle = "",
  totalConversationMessagesCount = 0,
  jsonFileName = "",
  createdOn = "",
  updatedOn = "",
}) => {
  const handlePrevClick = () => onPrevClick?.();
  const handleNextClick = () => onNextClick?.();
  return (
    <div className="w-full flex justify-between items-center font-bold text-xs text-gray-800 dark:text-sky-300 mb-4">
      <span
        onClick={handlePrevClick}
        className="mr-3 flex-1 text-left text-blue-600 dark:text-cyan-300 hover:underline flex items-center cursor-pointer"
      >
        <PrevIcon className="mr-3" />
        <span>Prev</span>
      </span>
      <span className="flex-2 text-center font-medium">
        {jsonFileName || "JSON File name missing"}
        {" , "}
        <b className="text-sm text-blue-600 dark:text-cyan-300">
          {conversationTitle || "Conversation Title Missing"}
          {" , "}
        </b>
        [Total {totalConversationMessagesCount || 0} messages]
        {createdOn ? ` , [Created: ${createdOn}]` : ""}
        {updatedOn ? ` , [Updated: ${updatedOn}]` : ""}
      </span>
      <span
        onClick={handleNextClick}
        className="flex-1 text-right text-blue-600 dark:text-cyan-300 hover:underline flex items-center cursor-pointer justify-end"
      >
        <span>Next</span>
        <NextIcon className="ml-3" />
      </span>
    </div>
  );
};

export default NavigationComponentV1;
