import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LATEST_CONVERSATION_FILE } from "../../common/utils/constants";
import { localSessionManager } from "./UtilityMethods";
import { fetchCgptFileData } from "./cgpt-data-operations-v2";

// export default PragyamContext
const { setItemForKey, getItemForKey, KEYS } = localSessionManager();

// Create a Context
const PragyamContext = createContext();

export const PragyamContextProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  // const [selectedConv, setSelectedConv] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [jsonData, setJsonData] = useState([]);

  const [uiState, setUiState] = useState({
    showSearchSection: false,
    showSideBar: true,
    collapseAll: true,
    showFileSelectorModal: false,
  });

  /**
   * **WARNING**: 'refreshJsonDataForFile' is only for internal use for context and should not be exposed outside context.
   *
   */
  const refreshJsonDataForFile = useCallback(async (fileName, conversationId) => {
    try {
      if (!fileName) {
        console.error(`Invalid file name: '${fileName}'`);
        return;
      }
      const responsee = await fetchCgptFileData(fileName);
      // console.log("fetchCgptFileData response: ", responsee);
      if (!responsee.isError) {
        setSelectedFile(fileName);
        setItemForKey(KEYS.selectedFileName, fileName);
        setJsonData(responsee.data);
        if (conversationId) {
          // const selConv = responsee.data.find((c) => c.id === conversationId);
          setSelectedConversationId(conversationId);
          // if (selConv) setItemForKey(KEYS.selectedConversationId, selConv.id);
        } else {
          setSelectedConversationId("");
          // setItemForKey(KEYS.selectedConversationId, "");
        }
      } else {
        console.error(responsee.message);
      }
    } catch (error) {
      console.error("An Error occurred", error);
    }
  }, []);

  const fetchAndSelectDataForFileName = useCallback(
    (fileName) => {
      refreshJsonDataForFile(fileName, null);
    },
    [refreshJsonDataForFile]
  );

  // Fetch data whenever the file changes
  useEffect(() => {
    /**
     * On Context Initialization,
     * 1. fetch last saved data from local storage
     * 2. fetch JSon data for last selected file, if it is null, for the latest file.
     * 3. set json data in state variable
     * 4. fetch data for lastly saved conversation id. if its non-null, then set data for conversation.
     * */
    const lastValue = getItemForKey(KEYS.listVisible);
    const selectedFileName = getItemForKey(KEYS.selectedFileName);
    const selectedConversationId = getItemForKey(KEYS.selectedConversationId);
    if (lastValue != null) {
      setUiState((prev) => ({ ...prev, showSideBar: lastValue }));
    }

    refreshJsonDataForFile(selectedFileName || LATEST_CONVERSATION_FILE, selectedConversationId);
  }, [refreshJsonDataForFile]);

  /**
   * Extract conversation names from jsonData and set them in state
   */
  const conversationNames = useMemo(() => {
    if (!jsonData) return [];
    const names = jsonData.map((conversation) => ({
      title: conversation.title,
      id: conversation.id,
    }));
    return names;
  }, [jsonData]);

  const navigationData = useMemo(() => {
    let selConv = null,
      nextConversationId = "",
      prevConversationId = "";
    const jsonDataLength = conversationNames?.length || 0;
    const selectedIndex = (conversationNames || []).findIndex((c) => c.id === selectedConversationId);
    let nextIndex = 0,
      prevIndex = 0;

    if (selectedIndex >= 0) {
      nextIndex = (selectedIndex + 1 + jsonDataLength) % jsonDataLength;
      prevIndex = (selectedIndex - 1 + jsonDataLength) % jsonDataLength;
      // selConv = jsonData[selectedIndex];
      nextConversationId = conversationNames[nextIndex].id;
      prevConversationId = conversationNames[prevIndex].id;
    }
    // setSelectedConv(selConv);
    setItemForKey(KEYS.selectedConversationId, selConv?.id || "");
    return {
      selectedConv: selConv,
      nextConversationId,
      prevConversationId,
      selectedIndex,
      nextIndex,
      prevIndex,
    };
  }, [conversationNames, selectedConversationId]);

  const getCurrentSelectedConvDetails = useCallback(
    (startIndex = 0, limit = 10) => {
      try {
        if (navigationData.selectedIndex < 0) {
          return null;
        }
        const conv = jsonData[navigationData.selectedIndex];
        if (!conv) {
          return null;
        }
        return {
          id: conv.id,
          title: conv.title,
          createdOn: conv.createdOn,
          updatedOn: conv.updatedOn,
          messages: conv?.messages?.slice(startIndex, startIndex + limit) || [],
          totalMessages: conv?.messages?.length || 0,
          limit,
          currentPageNo: startIndex / limit + 1,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [jsonData, navigationData.selectedIndex]
  );

  const handleNext = useCallback(() => {
    setSelectedConversationId(conversationNames[navigationData.nextIndex]?.id);
  }, [conversationNames, navigationData.nextIndex]);

  const handlePrev = useCallback(() => {
    setSelectedConversationId(conversationNames[navigationData.prevIndex]?.id);
  }, [conversationNames, navigationData.prevIndex]);

  const handleLinkSelection = useCallback((selectedItem) => {
    console.log(JSON.stringify(selectedItem));
    setSelectedConversationId(selectedItem.id);
  }, []);

  const toggleState = useCallback(
    (key) => {
      setUiState((prev) => ({ ...prev, [key]: !prev[key] }));
      if (key === "showSideBar") setItemForKey(KEYS.listVisible, !uiState.showSideBar);
    },
    [uiState.showSideBar]
  );

  return (
    <PragyamContext.Provider
      value={{
        selectedFile,
        fetchAndSelectDataForFileName,
        selectedConv: navigationData.selectedConv,
        getCurrentSelectedConvDetails,
        conversationNames,
        selectedConversationId,
        jsonData,
        uiState,
        handleNext,
        handlePrev,
        toggleState,
        handleLinkSelection,
      }}
    >
      {children}
    </PragyamContext.Provider>
  );
};

// Hook to use the context
export const usePragyamContext = () => {
  const context = useContext(PragyamContext);
  if (!context) {
    throw new Error("usePragyamContext must be used within a PragyamContextProvider");
  }
  return context;
};
