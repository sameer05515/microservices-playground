import { mapResponseToSectionsForLeftList } from "../../../TestingPage/ConsolidatedReport/utils/mapResponseToSections";
import * as CRActions from "./action-types";
import { produce } from "immer";
import { calculateNextPrev } from "../../../common/utils/utility-methods";

const initialState = {
  welcomeTitle: "Welcome",
  welcomeSubTitle: `
  Welcome to consolidated report module. 
  
  We will collectively fetch data from all existing sections and show them here.
  `,
  nodeList: {
    data: [],
    loading: false,
    error: null,
  },

  sectionsForLeftList: [],
  nodeListDataLength: 0,

  selectedNode: {
    data: null,
    loading: false,
    error: null,
  },
  selectedNodeNavigation: {
    selectedIndex: -1,
    nextId: null,
    prevId: null,
  },
};

const consolidatedReportReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    if (action.type === CRActions.LOADING_FETCH_NODE_LIST) {
      draft.nodeList.loading = true;
    } else if (action.type === CRActions.SUCCESS_FETCH_NODE_LIST) {
      draft.nodeList.data = action.payload;
      draft.sectionsForLeftList = mapResponseToSectionsForLeftList(action.payload);
      draft.nodeListDataLength = draft.nodeList.data.length;
      draft.nodeList.loading = false;
    } else if (action.type === CRActions.ERROR_FETCH_NODE_LIST) {
      draft.nodeList.error = action.error;
      draft.nodeList.loading = false;
    } else if (action.type === CRActions.LOADING_FETCH_SELECTED_NODE_DETAILS) {
      draft.selectedNode.loading = true;
    } else if (action.type === CRActions.SUCCESS_FETCH_SELECTED_NODE_DETAILS) {
      draft.selectedNode.data = action.payload;
      const index = draft.nodeList.data.findIndex((d) => d.uniqueId === draft.selectedNode.data?.uniqueId);
      const nextPrev = calculateNextPrev(draft.nodeListDataLength, index);
      draft.selectedNodeNavigation = {
        selectedIndex: index,
        nextId: draft.nodeList.data[nextPrev.next]?.uniqueId || null,
        prevId: draft.nodeList.data[nextPrev.prev]?.uniqueId || null,
      };
      draft.selectedNode.loading = false;
    } else if (action.type === CRActions.ERROR_FETCH_SELECTED_NODE_DETAILS) {
      draft.selectedNode.error = action.error;
      draft.selectedNode.loading = false;
      draft.selectedNode.data = null;
    } else {
      // do nothing, immer will handle!!
    }
  });
};

export default consolidatedReportReducer;

/**
 * Basic approach to create reducer for an async action.
 * Keeping it  just for reference purpose.
 * */
const sectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case CRActions.LOADING_FETCH_NODE_LIST:
      return {
        ...state,
        loading: true,
      };
    case CRActions.SUCCESS_FETCH_NODE_LIST:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case CRActions.ERROR_FETCH_NODE_LIST:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};
export { sectionReducer };
