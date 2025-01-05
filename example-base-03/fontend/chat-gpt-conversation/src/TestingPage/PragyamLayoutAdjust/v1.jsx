import React from "react";
import JsonFileMap from "./utils/JsonFileMap";

const reversedMap = JsonFileMap.sort((a, b) => b.order - a.order);
const keys = ["order", "location", "isLatest", "id", "createdOn", "createdBy"];
const StringifiedPre = () => (
  <pre className="text-wrap text-blue-600">{JSON.stringify(reversedMap, null, 2)}</pre>
);

const PragyamLayoutAdjustV1 = () => {
  return (
    <div className="mt-4 flex flex-col items-center text-xs bg-gray-100 shadow-md">
      <h1 className="font-bold py-2">PragyamLayoutAdjustV1</h1>
      <StringifiedPre />
      <div className="flex items-center justify-evenly">
        {keys.map((key) => (
          <span className="flex-1 flex-grow" key={key}>
            {key}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PragyamLayoutAdjustV1;
