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

const PragyamLayoutAdjustV4 = () => {
  const dispatch = useDispatch();
  const { searchParams, location, goToTestingRoute, goBack } = useSPPNavigation();
  const state = location.state;
  const fileId = searchParams.get("fileId");
  const conversationId = searchParams.get("conversationId");
  const isErrorOccurred = searchParams.get("errorOccurred") === "yes";

  const conversationDetails = useMemo(() => {
    return state?.conversationDetails || [];
  }, [state?.conversationDetails]);

  const errorMessage = useMemo(() => {
    if (isErrorOccurred) {
      return state?.errorMessage || "Some unexpected occurred!";
    }
    return "";
  }, [isErrorOccurred, state?.errorMessage]);

  const { jsonFileData, intermediateData, fileDetails } = useMemo(() => {
    return {
      jsonFileData: state?.jsonFileData || null,
      intermediateData: state?.intermediateData || null,
      fileDetails: state?.fileDetails || null,
    };
  }, [state?.fileDetails, state?.intermediateData, state?.jsonFileData]);

  const handleJsonFileListV2ItemClick = useCallback(
    async (fileId) => {
      try {
        dispatch(showBackdropV3({title:"Starting search.."}));
        console.log("Start processing file id: " + fileId);
        const fileDetails = getFileDetailsById(fileId);
        console.log("fileDetails: ", fileDetails);
        if (!fileDetails) {
          throw new Error(`No data found for given fileId: ${fileId}`);
        }
        const response = await fetchBasicConversationDetailsFromCgptFileLocation(fileDetails.location);
        if (response.isError) {
          throw new Error(response.message || "An unexpected error occured");
        }
        const conversationObjKeys =
          response?.data && response.data.length > 0 ? Object.keys(response.data[0]) : [];
        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV4", fileId: fileDetails.id },
          state: {
            fileDetails,
            jsonFileData: {
              data: response.data,
            },
            intermediateData: { conversationObjKeys },
          },
        });
      } catch (error) {
        console.error("Error fetching file data:", error);
        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV4", errorOccurred: "yes" },
          state: {
            errorMessage: prepareErrorMessage(error, "Something enexpected occurred!"),
          },
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
        console.log("conversationId: " + conversationId);
        if (!isValidString(conversationId) || !isValidString(fileDetails?.location)) {
          throw new Error("Conversation id or file location value is not valid");
        }
        const response = await getConversationMessagesForId(fileDetails.location, conversationId);

        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV4", fileId: fileDetails.id, conversationId },
          state: {
            ...state,
            conversationDetails: response.data || [],
          },
        });
      } catch (error) {
        console.error("Error fetching file data:", error);
        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV4", errorOccurred: "yes" },
          state: {
            errorMessage: prepareErrorMessage(error, "Something enexpected occurred!"),
          },
        });
      } finally {
      }
    },
    [fileDetails?.id, fileDetails?.location, goToTestingRoute, state]
  );

  if (isErrorOccurred) {
    return (
      <>
        <div className="flex flex-col align-middle text-red-600 text-2xl w-full">
          <span>Some error occurred: {errorMessage}</span>
          <button onClick={goBack}>GO Back</button>
        </div>
        <JsonFileListV2 tester={"PragyamLayoutAdjustV4"} onClick={handleJsonFileListV2ItemClick} />
      </>
    );
  }

  // Render JsonFileList if no `fileId`
  if (!fileId || !jsonFileData || !intermediateData) {
    return <JsonFileListV2 tester={"PragyamLayoutAdjustV4"} onClick={handleJsonFileListV2ItemClick} />;
  }

  return (
    <div className="w-full mt-1 flex flex-col items-center p-4 text-sm bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <div className="font-bold text-xs text-gray-800 mb-4">PragyamLayoutAdjustV4</div>
      {/* Display file details */}
      <h1>Location States</h1>
      <StringifiedPre obj={state} />
      <StringifiedPre obj={fileDetails} />
      <StringifiedPre obj={intermediateData} />
      {!conversationId && isValidArray(jsonFileData?.data) && (
        <ConversationListV2 data={jsonFileData.data} onClick={handleConversationListV2ItemClick} />
      )}
      {conversationId && conversationDetails && <StringifiedPre obj={conversationDetails} space={4} />}
    </div>
  );
};

export default PragyamLayoutAdjustV4;
