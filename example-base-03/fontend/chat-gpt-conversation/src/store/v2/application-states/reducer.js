import { produce } from "immer";
import initialState from "./initialState";
import * as ApplicationStateActions from "./action-types";

const applicationStateReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ApplicationStateActions.SET_LIGHT_VIEW_MODE:
        if (draft.isDarkMode === true) {
          draft.isDarkMode = false;
        }
        break;

      case ApplicationStateActions.SET_DARK_VIEW_MODE:
        if (draft.isDarkMode === false) {
          draft.isDarkMode = true;
        }
        break;

      case ApplicationStateActions.SET_SELECTED_MODULE_NAME:
        const { moduleName } = action.payload;
        draft.selectedModule = moduleName;
        if (draft.sidebarExpanded === true) {
          draft.sidebarExpanded = false;
        }
        break;

      case ApplicationStateActions.COLLAPSE_SIDE_BAR:
        draft.sidebarExpanded = false;
        break;

      case ApplicationStateActions.EXPAND_SIDE_BAR:
        draft.sidebarExpanded = true;
        break;

      default:
        break;
    }
  });
};

export default applicationStateReducer;
