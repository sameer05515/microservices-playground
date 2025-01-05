import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSPPNavigation from "../../../common/hooks/useSPPNavigation";
import { isValidString } from "../../../common/utils/basic-validations";
import { fetchNodeList, fetchSelectedNodeDetails } from "../../../store/v2/consolidated-report/actions";
import { getTypeForUniqueId, selectCRReport } from "../../../store/v2/consolidated-report/selectors";
import { getLastSideBarState, setSideBarState } from "../utils/common-utils";

const ConsolidatedReportContext = createContext();

export const ConsolidatedReportContextProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [isSidebarClosed, setIsSidebarClosed] = useState(getLastSideBarState());

  const { searchParams, location, goToTestingRoute } = useSPPNavigation();
  const {
    welcomeTitle,
    welcomeSubTitle,
    nodeList: { loading: isSectionListDataLoading, error: sectionListOperationErrorMessage },
    sectionsForLeftList,
    selectedNode: { data: selectedSectionItemData },
    selectedNodeNavigation: selectedSectionItemNavigation,
  } = useSelector(selectCRReport);

  const state = useMemo(() => location.state || {}, [location.state]);
  const selectedSectionItemId = searchParams.get("itemId");
  const reloadSectionData = "yes" === searchParams.get("reload");
  const selectedSectionItemRef = useRef(null);
  const selectedSectionItemType = useSelector(getTypeForUniqueId(selectedSectionItemId));

  const fetchSelectedSectionItemDetails = useCallback(
    (itemId) => {
      if (!selectedSectionItemType || !itemId) return;
      dispatch(fetchSelectedNodeDetails(itemId, selectedSectionItemType));
    },
    [selectedSectionItemType, dispatch]
  );

  useEffect(() => {
    if (selectedSectionItemRef.current) {
      selectedSectionItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (isValidString(selectedSectionItemId)) {
      fetchSelectedSectionItemDetails(selectedSectionItemId);
    }
  }, [fetchSelectedSectionItemDetails, selectedSectionItemId]);

  const handleSectionItemSelection = useCallback(
    (itemId) => {
      goToTestingRoute({
        search: {
          tester: "ConsolidatedReportV1",
          itemId: itemId,
        },
        state: { ...state },
      });
    },
    [goToTestingRoute, state]
  );

  const triggerReload = useCallback(() => {
    goToTestingRoute({
      search: {
        tester: "ConsolidatedReportV1",
        reload: "yes",
      },
    });
  }, [goToTestingRoute]);

  /**
   * `fetchAllSections` method is being called in 2 situations
   * 1. On change of `reloadSectionData`, which is linked with value of `reload` search (or query) parameter.
   * 2. in response of `triggerReload` callback.
   *
   * This could be simplified in future. However, for the time being, we are going with this approach.
   */
  const fetchAllSections = useCallback(() => {
    console.log("Going to reload section data");
    dispatch(fetchNodeList());
  }, [dispatch]);

  useEffect(() => {
    if (fetchAllSections && reloadSectionData) {
      fetchAllSections();
    }
  }, [fetchAllSections, reloadSectionData]);

  const handleSidebarClick = useCallback(() => {
    const newValue = isSidebarClosed ? "open" : "close";
    setIsSidebarClosed((prev) => !prev);
    setSideBarState(newValue);
  }, [isSidebarClosed]);

  return (
    <ConsolidatedReportContext.Provider
      value={{
        welcomeTitle,
        welcomeSubTitle,
        reloadSectionData,
        selectedSectionItemId,
        selectedSectionItemRef,
        selectedSectionItemData,
        selectedSectionItemNavigation,
        sectionsForLeftList,
        isSectionListDataLoading,
        sectionListOperationErrorMessage,
        handleSectionItemSelection,
        triggerReload,
        handleSidebarClick,
        isSidebarClosed,
      }}
    >
      {children}
    </ConsolidatedReportContext.Provider>
  );
};

// Hook to use the context
export const useConsolidatedReportContext = () => {
  const context = useContext(ConsolidatedReportContext);
  if (!context) {
    throw new Error("useConsolidatedReportContext must be used within a ConsolidatedReportContextProvider");
  }
  return context;
};
