import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { LATEST_CONVERSATION_FILE } from "./constants";
import { getFilteredDataForSearchQuery } from "./SearchUtils-v2";
import { hideBackdropV3, showBackdropV3 } from "../../store/v2/backdrop/actions";
import { localSessionManager } from "./UtilityMethods";
import { fetchCgptFileData } from "./cgpt-data-operations-v2";



const { setItemForKey, getItemForKey, KEYS } = localSessionManager();

// Create a Context
const PragyamContext = createContext();

/**
 * **WARNING**: This version of code is not fully tested. Please use [`PragyamContext.jsx`](./PragyamContext.jsx).
 * 
*/

export const PragyamContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(getItemForKey(KEYS.selectedFileName) || LATEST_CONVERSATION_FILE);
  const [selectedConversationId, setSelectedConversationId] = useState(getItemForKey(KEYS.selectedConversationId) || null);
  const [jsonData, setJsonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uiState, setUiState] = useState(() => ({
    showSearchSection: false,
    showSideBar: getItemForKey(KEYS.listVisible) ?? true,
    collapseAll: true,
    showFileSelectorModal: false,
  }));

  const refreshJsonDataForFile = useCallback(async (fileName, conversationId = null) => {
    if (!fileName) {
      console.error(`Invalid file name: '${fileName}'`);
      return;
    }

    try {
      const response = await fetchCgptFileData(fileName);
      if (!response.isError) {
        setSelectedFile(fileName);
        setItemForKey(KEYS.selectedFileName, fileName);
        setJsonData(response.data);
        setSelectedConversationId(conversationId || "");
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, []);

  const initializeContext = useCallback(() => {
    refreshJsonDataForFile(selectedFile, selectedConversationId);
  }, [refreshJsonDataForFile, selectedFile, selectedConversationId]);

  // Initialize context without `useEffect`
  useMemo(() => {
    initializeContext();
  }, [initializeContext]);

  const conversationNames = useMemo(() => {
    return jsonData?.map(({ title, id }) => ({ title, id })) || [];
  }, [jsonData]);

  const navigationData = useMemo(() => {
    const selectedIndex = conversationNames.findIndex((c) => c.id === selectedConversationId);
    if (selectedIndex < 0) return { selectedConv: null, nextConversationId: "", prevConversationId: "" };

    const jsonDataLength = conversationNames.length;
    const nextIndex = (selectedIndex + 1) % jsonDataLength;
    const prevIndex = (selectedIndex - 1 + jsonDataLength) % jsonDataLength;

    return {
      selectedConv: jsonData[selectedIndex],
      nextConversationId: conversationNames[nextIndex]?.id || "",
      prevConversationId: conversationNames[prevIndex]?.id || "",
    };
  }, [conversationNames, selectedConversationId, jsonData]);

  const handleNext = useCallback(() => {
    setSelectedConversationId(navigationData.nextConversationId);
  }, [navigationData.nextConversationId]);

  const handlePrev = useCallback(() => {
    setSelectedConversationId(navigationData.prevConversationId);
  }, [navigationData.prevConversationId]);

  const handleLinkSelection = useCallback((selectedItem) => {
    setSelectedConversationId(selectedItem.id);
  }, []);

  const handleSearch = useCallback(
    async (query) => {
      try {
        dispatch(showBackdropV3({title:"Starting search.."}));
        const { data, isError, message } = await getFilteredDataForSearchQuery(jsonData, query);
        if (!isError) setFilteredData(data);
        else console.error(message);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        dispatch(hideBackdropV3());
      }
    },
    [dispatch, jsonData]
  );

  const toggleState = useCallback(
    (key) => {
      setUiState((prev) => {
        const updatedState = { ...prev, [key]: !prev[key] };
        if (key === "showSideBar") setItemForKey(KEYS.listVisible, updatedState.showSideBar);
        return updatedState;
      });
    },
    []
  );

  return (
    <PragyamContext.Provider
      value={{
        selectedFile,
        fetchAndSelectDataForFileName: refreshJsonDataForFile,
        selectedConv: navigationData.selectedConv,
        conversationNames,
        selectedConversationId,
        jsonData,
        filteredData,
        uiState,
        handleSearch,
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

export const usePragyamContext = () => {
  const context = useContext(PragyamContext);
  if (!context) {
    throw new Error("usePragyamContext must be used within a PragyamContextProvider");
  }
  return context;
};
