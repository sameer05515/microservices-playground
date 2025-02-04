import React from "react";
import JsonFileMap from "../../utils/JsonFileMap";

// const createSearchParamsString = (params) => {
//   return createSearchParams(params).toString();
// };

const reversedMap = JsonFileMap.sort((a, b) => b.order - a.order);
// const keys = ["order", "location", "isLatest", "id", "createdOn", "createdBy"];

export const JsonFileListV2 = ({ onClick = () => {} }) => {
  
  if(typeof onClick!=='function'){
    return <span className="text-3xl text-red-700">`onClick` should be a valid function!!</span>
  }

  return (
    <div className="mt-0 flex flex-col items-center text-xs">
      <div className="text-4xl text-gray-700 dark:text-sky-300">SELECT A FILE</div>
      {reversedMap.map(({ id, isLatest }) => (
        <span
          key={id}
          onClick={() => onClick && onClick(id)}
          className="text-blue-600 dark:text-cyan-300 hover:underline cursor-pointer"
        >
          <strong className="text-sm">{id}</strong>
        </span>
      ))}
    </div>
  );
};
