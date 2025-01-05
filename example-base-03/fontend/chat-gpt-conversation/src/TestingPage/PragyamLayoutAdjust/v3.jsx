import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getFileDetailsById } from "./utils/JsonFileMap";
import { StringifiedPre } from "./sub-components/StringifiedPre/v1";
import { JsonFileList } from "./sub-components/JsonFileList/v1";
import {
  fetchBasicConversationDetailsFromCgptFileLocation,
  getConversationMessagesForId,
} from "./utils/fetchCgptFileData";
import { ConversationListV1 } from "./sub-components/ConversationList/v1";

const PragyamLayoutAdjustV3 = () => {
  //   const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [jsonFileData, setJsonFileData] = useState(null);
  const [intermediateData, setIntermediateData] = useState(null);
  const [conversationDetails, setConversationDetails] = useState(null);
  const fileId = searchParams.get("fileId");
  const conversationId = searchParams.get("conversationId");

  // Memoized file details based on `fileId`
  const fileDetails = useMemo(() => getFileDetailsById(fileId), [fileId]);

  // Fetch selected file data
  const getSelectedConversationDetails = useCallback(
    async (location) => {
      if (location && conversationId) {
        try {
          const response = await getConversationMessagesForId(location, conversationId);
          setConversationDetails({
            data: response.data,
          });
          // const conversationObjKeys =
          //   response?.data && response.data.length > 0 ? Object.keys(response.data[0]) : [];
          // setIntermediateData({ conversationObjKeys });
        } catch (error) {
          console.error("Error fetching file data:", error);
        } finally {
          // dispatch(hideBackdropV3());
        }
      }
    },
    [conversationId]
  );

  // Fetch selected file data
  const getSelectedFileData = useCallback(async () => {
    if (fileDetails?.location) {
      try {
        const response = await fetchBasicConversationDetailsFromCgptFileLocation(fileDetails.location);
        setJsonFileData({
          data: response.data,
        });
        const conversationObjKeys =
          response?.data && response.data.length > 0 ? Object.keys(response.data[0]) : [];
        setIntermediateData({ conversationObjKeys });
        getSelectedConversationDetails(fileDetails.location);
      } catch (error) {
        console.error("Error fetching file data:", error);
      } finally {
        // dispatch(hideBackdropV3());
      }
    }
  }, [fileDetails?.location, getSelectedConversationDetails]);

  // Fetch file data on `fileDetails` change
  useEffect(() => {
    if (fileDetails) {
      getSelectedFileData();
    }
  }, [getSelectedFileData, fileDetails]);

  // Render JsonFileList if no `fileId`
  if (!fileId) {
    return <JsonFileList tester={"PragyamLayoutAdjustV3"} />;
  }
  if (!jsonFileData && !intermediateData) {
    return <>Loading Data...</>;
  }
  //   if (!conversationId) {
  //     return <ConversationListV1 data={jsonFileData.data} fileId={fileId} tester={"PragyamLayoutAdjustV3"} />;
  //   }

  return (
    <div className="w-full mt-1 flex flex-col items-center p-4 text-sm bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <div className="font-bold text-xs text-gray-800 mb-4">PragyamLayoutAdjustV3</div>
      {/* Display file details */}
      <StringifiedPre obj={fileDetails} />
      <StringifiedPre obj={intermediateData} />
      {!conversationId && (
        <ConversationListV1 data={jsonFileData.data} fileId={fileId} tester={"PragyamLayoutAdjustV3"} />
      )}
      {conversationId && conversationDetails && <StringifiedPre obj={conversationDetails} space={4} />}
    </div>
  );
};

export default PragyamLayoutAdjustV3;
