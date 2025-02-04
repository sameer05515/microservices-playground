import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { isValidArray, isValidString } from "../../common/utils/basic-validations";
import { hideBackdropV3, showBackdropV3 } from "../../store/v2/backdrop/actions";
import ConversationListV2 from "./sub-components/ConversationList/v2";
import { JsonFileListV2 } from "./sub-components/JsonFileList/v2";
import { StringifiedPre } from "./sub-components/StringifiedPre/v1";
import useSPPNavigation from "../../common/hooks/useSPPNavigation";
import {
  fetchBasicConversationDetailsFromCgptFileLocation,
  getConversationMessagesForId,
} from "./utils/fetchCgptFileData";
import { getFileDetailsById } from "./utils/JsonFileMap";
import { prepareErrorMessage } from "../../common/utils/message-preparation-utils-v2";

const PragyamLayoutAdjustV5 = () => {
  const dispatch = useDispatch();
  const { searchParams, location, goToTestingRoute, goBack } = useSPPNavigation();

  const state = useMemo(() => location.state || {}, [location.state]); // Stabilizing 'state'
  const fileId = searchParams.get("fileId");
  const conversationId = searchParams.get("conversationId");
  const isErrorOccurred = searchParams.get("errorOccurred") === "yes";

  const conversationDetails = useMemo(() => state.conversationDetails || [], [state]);
  const errorMessage = useMemo(
    () => (isErrorOccurred ? state.errorMessage || "An unexpected error occurred!" : ""),
    [isErrorOccurred, state]
  );

  const { jsonFileData, intermediateData, fileDetails } = useMemo(
    () => ({
      jsonFileData: state.jsonFileData || null,
      intermediateData: state.intermediateData || null,
      fileDetails: state.fileDetails || null,
    }),
    [state]
  );

  const validateFileDetails = (fileId) => {
    const fileDetails = getFileDetailsById(fileId);
    if (!fileDetails) throw new Error(`No data found for fileId: ${fileId}`);
    return fileDetails;
  };

  const fetchConversationKeys = async (location) => {
    const response = await fetchBasicConversationDetailsFromCgptFileLocation(location);
    if (response.isError) throw new Error(response.message || "Unexpected error occurred");
    return {
      data: response.data,
      conversationKeys: response.data.length > 0 ? Object.keys(response.data[0]) : [],
    };
  };

  const handleJsonFileListV2ItemClick = useCallback(
    async (fileId) => {
      try {
        dispatch(showBackdropV3());
        const fileDetails = validateFileDetails(fileId);
        const { data, conversationKeys } = await fetchConversationKeys(fileDetails.location);

        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV5", fileId: fileDetails.id },
          state: {
            fileDetails,
            jsonFileData: { data: data },
            intermediateData: { conversationObjKeys: conversationKeys },
          },
        });
      } catch (error) {
        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV5", errorOccurred: "yes" },
          state: { errorMessage: prepareErrorMessage(error, "Something unexpected occurred!") },
        });
      } finally {
        dispatch(hideBackdropV3());
      }
    },
    [dispatch, goToTestingRoute]
  );

  const handleConversationListV2ItemClick = useCallback(
    async (conversationId) => {
      try {
        if (!isValidString(conversationId) || !isValidString(fileDetails?.location)) {
          throw new Error("Invalid conversationId or file location");
        }

        const response = await getConversationMessagesForId(fileDetails.location, conversationId);

        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV5", fileId: fileDetails.id, conversationId },
          state: { ...state, conversationDetails: response.data || [] },
        });
      } catch (error) {
        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV5", errorOccurred: "yes" },
          state: { errorMessage: prepareErrorMessage(error, "Something unexpected occurred!") },
        });
      }
    },
    [fileDetails?.id, fileDetails?.location, goToTestingRoute, state]
  );

  if (isErrorOccurred) {
    return (
      <>
        <div className="flex flex-col align-middle text-red-600 text-2xl w-full">
          <span>Error: {errorMessage}</span>
          <button onClick={goBack}>Go Back</button>
        </div>
        <JsonFileListV2 tester="PragyamLayoutAdjustV5" onClick={handleJsonFileListV2ItemClick} />
      </>
    );
  }

  if (!fileId || !jsonFileData || !intermediateData) {
    return <JsonFileListV2 tester="PragyamLayoutAdjustV5" onClick={handleJsonFileListV2ItemClick} />;
  }

  return (
    <div className="w-full mt-1 flex flex-col items-center p-4 text-sm bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <div className="font-bold text-xs text-gray-800 mb-4">PragyamLayoutAdjustV5</div>
      {!conversationId && isValidArray(jsonFileData?.data) && (
        <ConversationListV2 data={jsonFileData.data} onClick={handleConversationListV2ItemClick} />
      )}

      {conversationId && conversationDetails && <StringifiedPre obj={conversationDetails} space={4} />}

      <h1>Location States</h1>
      <StringifiedPre obj={state} space={4} />
      {/* <StringifiedPre obj={fileDetails} />
      <StringifiedPre obj={intermediateData} /> */}
    </div>
  );
};

export default PragyamLayoutAdjustV5;
