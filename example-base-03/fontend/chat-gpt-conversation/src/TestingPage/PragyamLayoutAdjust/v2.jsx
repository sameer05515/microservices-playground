// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { createSearchParams, NavLink, useSearchParams } from "react-router-dom";
// import JsonFileMap, { getFileDetailsById } from "./utils/JsonFileMap";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFileDetailsById } from "./utils/JsonFileMap";
import { StringifiedPre } from "./sub-components/StringifiedPre/v1";
import { JsonFileList } from "./sub-components/JsonFileList/v1";
import { fetchBasicConversationDetailsFromCgptFileLocation } from "./utils/fetchCgptFileData";
import { useDispatch } from "react-redux";
import { hideBackdropV3, showBackdropV3 } from "../../store/v2/backdrop/actions";

// const createSearchParamsString = (params) => {
//   return createSearchParams(params).toString();
// };

// const reversedMap = JsonFileMap.sort((a, b) => b.order - a.order);
// const keys = ["order", "location", "isLatest", "id", "createdOn", "createdBy"];

// const JsonFileList = () => {
//   // const iconParents = useMemo(() => getAllIconParents(), []);
//   return (
//     <div className="mt-0 flex flex-col items-center text-xs">
//       <div className="text-4xl">SELECT A FILE</div>
//       {reversedMap.map(({ id, isLatest }) => (
//         <NavLink
//           key={id}
//           to={{
//             pathname: "/testing",
//             search: createSearchParamsString({ tester: "PragyamLayoutAdjustV2", fileId: id }),
//           }}
//           className="text-blue-600 hover:underline"
//         >
//           <strong className="text-sm">{id}</strong>
//         </NavLink>
//       ))}
//     </div>
//   );
// };

const PragyamLayoutAdjustV2 = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [jsonFileData, setJsonFileData] = useState([]);
  const fileId = searchParams.get("fileId") || null;
  const fileDetails = useMemo(() => getFileDetailsById(fileId), [fileId]);

  const getSelectedFileData = useCallback(async () => {
    if (fileDetails && fileDetails.location) {
      dispatch(showBackdropV3({ title: "Starting search.." }));
      const responsee = await fetchBasicConversationDetailsFromCgptFileLocation(fileDetails.location);
      setJsonFileData({ data: responsee.data, formattedData: responsee.formattedData });
    }
  }, [dispatch, fileDetails]);

  const intermediateData = useMemo(() => {
    if (!jsonFileData?.data) {
      return null;
    }

    const intermediateData = jsonFileData.data || [];
    let conversationObjKeys = [];
    if (intermediateData?.length > 0) {
      const firstObj = intermediateData[0];
      conversationObjKeys = Object.keys(firstObj);
    }
    dispatch(hideBackdropV3());
    return { conversationObjKeys };
  }, [dispatch, jsonFileData.data]);

  useEffect(() => {
    getSelectedFileData();
  }, [getSelectedFileData]);

  if (!fileId) {
    return <JsonFileList />;
  }
  return (
    <div className="w-full mt-1 flex flex-col items-center p-0 text-sm bg-gray-50 border border-gray-200">
      <h1 className="font-bold text-sm text-gray-800 mb-0">PragyamLayoutAdjustV2</h1>
      {/* <StringifiedPre /> */}
      <StringifiedPre obj={fileDetails} />
      <div className="flex flex-row">
        <StringifiedPre obj={jsonFileData?.data || []} />
        <StringifiedPre obj={intermediateData} />
        <StringifiedPre obj={jsonFileData?.formattedData || []} />
      </div>
    </div>
  );
};

export default PragyamLayoutAdjustV2;
