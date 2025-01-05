import React from "react";

/**
 *
 * This component is derived from
 * [**StringifiedPre**](../../../TestingPage/PragyamLayoutAdjust/sub-components/StringifiedPre/v1.jsx)
 */
export const StringifiedPreV2 = ({ obj = {}, space = 0 }) => (
  <pre className="whitespace-pre-wrap break-words text-blue-600 dark:text-blue-100 p-4 rounded-md shadow-sm border border-gray-300 max-w-full">
    {JSON.stringify(obj, null, space)}
  </pre>
);
