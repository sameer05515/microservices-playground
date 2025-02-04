import React from "react";
import { createSearchParams, NavLink } from "react-router-dom";
import { isValidArray, isValidString } from "../../../../common/utils/basic-validations";

const createSearchParamsString = (params) => {
  return createSearchParams(params).toString();
};

// const reversedMap = JsonFileMap.sort((a, b) => b.order - a.order);
// const keys = ["order", "location", "isLatest", "id", "createdOn", "createdBy"];

export const ConversationListV1 = ({ tester, data, fileId }) => {
  // const iconParents = useMemo(() => getAllIconParents(), []);
  if (!isValidString(tester)) {
    return <>Invalid value for tester: {JSON.stringify(tester, null, 2)}</>;
  }
  if (!isValidArray(data)) {
    return <>provided data is not valid</>;
  }
  return (
    <div className="mt-0 flex flex-col items-center text-xs">
      <div className="text-4xl">SELECT A CONVERSATION</div>
      {data.map(({ id, title }) => (
        <NavLink
          key={id}
          to={{
            pathname: "/testing",
            search: createSearchParamsString({ tester: tester, fileId: fileId, conversationId: id }),
          }}
          className="text-blue-600 hover:underline"
        >
          <strong className="text-sm">{title}</strong>
        </NavLink>
      ))}
    </div>
  );
};
