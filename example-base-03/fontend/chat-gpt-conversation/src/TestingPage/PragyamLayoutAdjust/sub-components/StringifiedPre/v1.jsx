import React from "react";
import JsonFileMap from "../../utils/JsonFileMap";

const reversedMap = JsonFileMap.sort((a, b) => b.order - a.order);

export const StringifiedPre = ({ obj = reversedMap, space=0 }) => (
  <pre className="whitespace-pre-wrap break-words text-blue-600 bg-white p-4 rounded-md shadow-sm border border-gray-300 max-w-full">
    {JSON.stringify(obj, null, space)}
  </pre>
);
