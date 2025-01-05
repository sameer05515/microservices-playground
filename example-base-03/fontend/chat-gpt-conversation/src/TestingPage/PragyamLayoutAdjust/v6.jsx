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
// import { capitalizeFirstLetter } from "./utils/UtilityMethods";
import MarkdownComponent from "./sub-components/ConvMessageDisplay/v2";

const PragyamLayoutAdjustV6 = () => {
  const dispatch = useDispatch();
  const {
    searchParams,
    location,
    goToTestingRoute: navigateToRoute,
    goBack: navigateBack,
  } = useSPPNavigation();

  const navigationState = useMemo(() => location.state || {}, [location.state]);
  const selectedFileId = searchParams.get("fileId");
  const selectedConversationId = searchParams.get("conversationId");
  const hasErrorOccurred = searchParams.get("errorOccurred") === "yes";

  const conversationDetails = useMemo(() => navigationState.conversationDetails || [], [navigationState]);
  const errorMessage = useMemo(
    () => (hasErrorOccurred ? navigationState.errorMessage || "An unexpected error occurred!" : ""),
    [hasErrorOccurred, navigationState]
  );

  const { jsonFileData, intermediateData, fileDetails } = useMemo(
    () => ({
      jsonFileData: navigationState.jsonFileData || null,
      intermediateData: navigationState.intermediateData || null,
      fileDetails: navigationState.fileDetails || null,
    }),
    [navigationState]
  );

  const getValidatedFileDetails = (fileId) => {
    const fileDetails = getFileDetailsById(fileId);
    if (!fileDetails) throw new Error(`No data found for fileId: ${fileId}`);
    return fileDetails;
  };

  const fetchConversationKeys = async (fileLocation) => {
    const response = await fetchBasicConversationDetailsFromCgptFileLocation(fileLocation);
    if (response.isError) throw new Error(response.message || "Unexpected error occurred");
    return {
      data: response.data,
      conversationKeys: response.data.length > 0 ? Object.keys(response.data[0]) : [],
    };
  };

  const handleFileSelection = useCallback(
    async (fileId) => {
      try {
        dispatch(showBackdropV3());
        const validatedFileDetails = getValidatedFileDetails(fileId);
        const { data, conversationKeys } = await fetchConversationKeys(validatedFileDetails.location);

        navigateToRoute({
          search: { tester: "PragyamLayoutAdjustV6", fileId: validatedFileDetails.id },
          state: {
            fileDetails: validatedFileDetails,
            jsonFileData: { data },
            intermediateData: { conversationObjKeys: conversationKeys },
          },
        });
      } catch (error) {
        navigateToRoute({
          search: { tester: "PragyamLayoutAdjustV6", errorOccurred: "yes" },
          state: { errorMessage: prepareErrorMessage(error, "Something unexpected occurred!") },
        });
      } finally {
        dispatch(hideBackdropV3());
      }
    },
    [dispatch, navigateToRoute]
  );

  const handleConversationSelection = useCallback(
    async (conversationId) => {
      try {
        if (!isValidString(conversationId) || !isValidString(fileDetails?.location)) {
          throw new Error("Invalid conversationId or file location");
        }

        const response = await getConversationMessagesForId(fileDetails.location, conversationId);

        navigateToRoute({
          search: { tester: "PragyamLayoutAdjustV6", fileId: fileDetails.id, conversationId },
          state: { ...navigationState, conversationDetails: response.data || [] },
        });
      } catch (error) {
        navigateToRoute({
          search: { tester: "PragyamLayoutAdjustV6", errorOccurred: "yes" },
          state: { errorMessage: prepareErrorMessage(error, "Something unexpected occurred!") },
        });
      }
    },
    [fileDetails?.id, fileDetails?.location, navigateToRoute, navigationState]
  );

  if (hasErrorOccurred) {
    return (
      <>
        <div className="flex flex-col align-middle text-red-600 text-2xl w-full">
          <span>Error: {errorMessage}</span>
          <button onClick={navigateBack}>Go Back</button>
        </div>
        <JsonFileListV2 tester="PragyamLayoutAdjustV6" onClick={handleFileSelection} />
      </>
    );
  }

  if (!selectedFileId || !jsonFileData || !intermediateData) {
    return <JsonFileListV2 tester="PragyamLayoutAdjustV6" onClick={handleFileSelection} />;
  }

  return (
    <div className="w-full mt-1 flex flex-col items-center p-4 text-sm bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <div className="font-bold text-xs text-gray-800 mb-4">PragyamLayoutAdjustV6</div>
      {!selectedConversationId && isValidArray(jsonFileData?.data) && (
        <ConversationListV2 data={jsonFileData.data} onClick={handleConversationSelection} />
      )}

      {/* {selectedConversationId && conversationDetails && (
        <StringifiedPre obj={conversationDetails} space={4} />
      )} */}

      {selectedConversationId && conversationDetails?.messages && conversationDetails.messages.map((message, msgIndex) => (
        <div
          key={message.id}
          className={`mb-4 p-4 rounded border ${
            message.author === "user" ? "border-yellow-300" : "border-purple-300"
          }`}
        >
          {/* <div className="font-bold mb-2 flex items-center justify-between">
            {capitalizeFirstLetter(message.author)}
            <span
              className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
              title={
                showAllNonUserMessages || message?.author === "user"
                  ? "Hide Message Text"
                  : "Show Message Text"
              }
            >
              {showAllNonUserMessages || message?.author ? "- " : "+ "}
            </span>
          </div> */}
          {(message?.author) && (
            <MarkdownComponent
              markdownText={message.text}
              additionalStyle={
                {
                  // backgroundColor: message.author === "user" ? "cornsilk" : "lavenderblush",
                }
              }
              showCopyToclipboardButton={message.author !== "user"}
              makeFontWeightBold={message?.author === "user"}
              reactMarkdownStyles={{
                fontWeight: message?.author === "user" ? "bold" : "",
              }}
            />
          )}
        </div>
      ))}

      <h1>Location States</h1>
      <StringifiedPre obj={navigationState} space={4} />
      {/* <StringifiedPre obj={fileDetails} />
      <StringifiedPre obj={intermediateData} /> */}
    </div>
  );
};

export default PragyamLayoutAdjustV6;
