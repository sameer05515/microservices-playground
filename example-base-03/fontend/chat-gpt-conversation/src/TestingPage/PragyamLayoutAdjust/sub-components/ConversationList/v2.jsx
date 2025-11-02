import React, { useState } from "react";
import { isValidArray } from "../../../../common/utils/basic-validations";

const ConversationListV2 = ({ data, onClick = () => {} }) => {
  // const iconParents = useMemo(() => getAllIconParents(), []);
  
  const [filter, setFilter] = useState("");
  const filteredData = data?.filter(conv =>
    conv.title.toLowerCase().includes(filter.toLowerCase())
  );
  if (typeof onClick !== "function") {
    return <span className="text-3xl text-red-700">`onClick` should be a valid function!!</span>;
  }
  if (!isValidArray(data)) {
    return <>provided data is not valid</>;
  }
  return (
    <div className="mt-0 flex flex-col items-center text-xs">
      <div className="text-4xl text-gray-700 dark:text-sky-300">SELECT A CONVERSATION</div>
      <div>
        <input
        type="text"
        placeholder="Search fruit..."
        className="bg-white text-black p-2 border rounded mb-2"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      </div>
      {filteredData.map(({ id, title }) => (
        <span
          key={id}
          onClick={() => onClick && onClick(id)}
          className="text-blue-600 dark:text-cyan-300 hover:underline cursor-pointer"
        >
          <strong className="text-sm">{title}</strong>
        </span>
      ))}
    </div>
  );
};

export default ConversationListV2;
