import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useDispatch } from "react-redux";
import { isValidString } from "../../common/utils/basic-validations";
import { hideBackdropV3, showBackdropV3 } from "../../store/v2/backdrop/actions";
import useSPPNavigation from "../../common/hooks/useSPPNavigation";
import {
  calculateNextPrev,
  fetchBasicConversationDetailsFromCgptFileLocation,
  getConversationMessagesForId,
} from "./utils/fetchCgptFileData";
import { getFileDetailsById } from "./utils/JsonFileMap";
import { prepareErrorMessage } from "../../common/utils/message-preparation-utils-v2";

const PragyamLayoutAdjustV7Context = createContext();

export const PragyamLayoutAdjustV7ContextProvider = ({ children }) => {
  const debug = {
    showState: false,
    showMessageMap: false,
  };

  /**
   * Please do not alter the admin settings.
   * Once we have completed the layout fixing and data flow simplification process,
   * we will work on moving these admin settings to Redux and create a separate page to control them.
   */
  const adminSettings = {
    showGroupedMessages: true,
    showAllMessages: false,
  };
  const dispatch = useDispatch();
  const { searchParams, location, goToTestingRoute, goBack } = useSPPNavigation();

  const state = useMemo(() => location.state || {}, [location.state]);
  const fileId = searchParams.get("fileId");
  const conversationId = searchParams.get("conversationId");
  const isErrorOccurred = searchParams.get("errorOccurred") === "yes";
  const messageId = searchParams.get("messageId");

  const { jsonFileData, fileDetails, conversationDetails } = useMemo(
    () => ({
      jsonFileData: state.jsonFileData || null,
      intermediateData: state.intermediateData || null,
      fileDetails: state.fileDetails || null,
      conversationDetails: state.conversationDetails || [],
    }),
    [state]
  );

  const errorMessage = useMemo(
    () => (isErrorOccurred ? state.errorMessage || "An unexpected error occurred!" : ""),
    [isErrorOccurred, state]
  );

  const {
    groupedMessages,
    prevUserMessageId,
    nextUserMessageId,
    currentUserMessageSequenceNo,
    totalUserMessages,
  } = useMemo(() => {
    let groupedMessages = [];
    let prevUserMessageId = null;
    let nextUserMessageId = null;
    let currentUserMessageSequenceNo = 0;
    let totalUserMessages = 0;
    if (messageId && conversationDetails?.messages) {
      const groupedMessageIds =
        (conversationDetails?.messageMap?.get(messageId) || []).map(({ id }) => id) || [];
      const userMessagesIdArr = Array.from(conversationDetails?.messageMap?.keys() || []);

      const index = userMessagesIdArr.findIndex((val) => val === messageId);

      if (index >= 0) {
        totalUserMessages = userMessagesIdArr.length;
        currentUserMessageSequenceNo = index + 1;
        const navigationObj = calculateNextPrev(totalUserMessages, index);
        prevUserMessageId = userMessagesIdArr[navigationObj.prev] || null;
        nextUserMessageId = userMessagesIdArr[navigationObj.next] || null;
      }
      groupedMessages = conversationDetails?.messages.filter((msg) => groupedMessageIds.includes(msg.id));
    }
    return {
      groupedMessages,
      prevUserMessageId,
      nextUserMessageId,
      currentUserMessageSequenceNo,
      totalUserMessages,
    };
  }, [conversationDetails?.messageMap, conversationDetails?.messages, messageId]);

  const handleFileSelection = useCallback(
    async (fileId) => {
      try {
        dispatch(showBackdropV3({ title: "Starting search for json file data" }));
        const fileDetails = getFileDetailsById(fileId);
        if (!fileDetails) throw new Error(`No data found for fileId: ${fileId}`);

        const { data, conversationKeys } = await fetchBasicConversationDetailsFromCgptFileLocation(
          fileDetails.location
        );

        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV7", fileId: fileDetails.id },
          state: {
            fileDetails,
            jsonFileData: { data },
            intermediateData: { conversationObjKeys: conversationKeys },
          },
        });
      } catch (error) {
        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV7", errorOccurred: "yes" },
          state: { errorMessage: prepareErrorMessage(error, "Something unexpected occurred!") },
        });
      } finally {
        dispatch(hideBackdropV3());
      }
    },
    [dispatch, goToTestingRoute]
  );

  const handleConversationSelection = useCallback(
    async (conversationId) => {
      try {
        dispatch(showBackdropV3({ title: "Starting search for selected conversation data" }));
        if (!isValidString(conversationId) || !isValidString(fileDetails?.location)) {
          throw new Error("Invalid conversationId or file location");
        }

        const response = await getConversationMessagesForId(fileDetails.location, conversationId);

        const conversationDetails = response.data || {};
        const firstUserMessageId = conversationDetails.firstUserMessageId;
        if (!firstUserMessageId) {
          throw new Error("No user messages found in conversation");
        }

        goToTestingRoute({
          search: {
            tester: "PragyamLayoutAdjustV7",
            fileId: fileDetails.id,
            conversationId,
            messageId: firstUserMessageId,
          },
          state: { ...state, conversationDetails: conversationDetails },
        });
      } catch (error) {
        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV7", errorOccurred: "yes" },
          state: { errorMessage: prepareErrorMessage(error, "Something unexpected occurred!") },
        });
      } finally {
        dispatch(hideBackdropV3());
      }
    },
    [dispatch, fileDetails?.id, fileDetails?.location, goToTestingRoute, state]
  );

  const handleMessageSelection = useCallback(
    (messageId) => {
      try {
        if (!isValidString(conversationId)) {
          throw new Error("Invalid conversationId");
        }
        if (!isValidString(fileDetails?.id)) {
          throw new Error("Invalid file id");
        }

        if (!isValidString(messageId)) {
          throw new Error("Invalid messageId");
        }

        if (!conversationDetails) {
          throw new Error("Invalid conversationDetails");
        }

        goToTestingRoute({
          search: {
            tester: "PragyamLayoutAdjustV7",
            fileId: fileDetails.id,
            conversationId,
            messageId: messageId,
          },
          state: { ...state },
        });
      } catch (error) {
        goToTestingRoute({
          search: { tester: "PragyamLayoutAdjustV7", errorOccurred: "yes" },
          state: { errorMessage: prepareErrorMessage(error, "Something unexpected occurred!") },
        });
      } finally {
        // dispatch(hideBackdropV3());
        console.log("Do any cleanup!");
      }
    },
    [conversationDetails, conversationId, fileDetails?.id, goToTestingRoute, state]
  );

  return (
    <PragyamLayoutAdjustV7Context.Provider
      value={{
        isErrorOccurred,
        errorMessage,
        goBack,
        handleFileSelection,
        handleConversationSelection,
        handleMessageSelection,
        fileId,
        jsonFileData,
        fileDetails,
        conversationDetails,
        conversationId,
        state,
        debug,
        adminSettings,
        groupedMessages,
        prevUserMessageId,
        nextUserMessageId,
        currentUserMessageSequenceNo,
        totalUserMessages,
      }}
    >
      {children}
    </PragyamLayoutAdjustV7Context.Provider>
  );
};

// Hook to use the context
export const usePragyamLayoutAdjustV7Context = () => {
  const context = useContext(PragyamLayoutAdjustV7Context);
  if (!context) {
    throw new Error(
      "usePragyamLayoutAdjustV7Context must be used within a PragyamLayoutAdjustV7ContextProvider"
    );
  }
  return context;
};
