import React from "react";
import { NavLink } from "react-router-dom";
import JsonFileMap from "../../utils/JsonFileMap";
import { prepareTestingRouteObjectForNavLink } from "../../../../common/hooks/useSPPNavigation/util";

// const createSearchParamsString = (params) => {
//   return createSearchParams(params).toString();
// };

const reversedMap = JsonFileMap.sort((a, b) => b.order - a.order);
// const keys = ["order", "location", "isLatest", "id", "createdOn", "createdBy"];

export const JsonFileList = ({ tester = "PragyamLayoutAdjustV2" }) => {
  // const iconParents = useMemo(() => getAllIconParents(), []);
  if (!tester) {
    return <>Invalid value for tester: {JSON.stringify(tester, null, 2)}</>;
  }
  return (
    <div className="mt-0 flex flex-col items-center text-xs">
      <div className="text-4xl">SELECT A FILE</div>
      {reversedMap.map(({ id, isLatest }) => (
        <NavLink
          key={id}
          // to={{
          //   pathname: "/testing",
          //   search: createSearchParamsString({ tester: tester, fileId: id }),
          // }}
          to={prepareTestingRouteObjectForNavLink({ tester: tester, fileId: id }).to}
          className="text-blue-600 hover:underline"
        >
          <strong className="text-sm">{id}</strong>
        </NavLink>
      ))}
    </div>
  );
};
