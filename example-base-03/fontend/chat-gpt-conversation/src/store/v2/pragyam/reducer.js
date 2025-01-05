import { produce } from "immer";
import initialState from "./initialState";
import * as ApplicationStateActions from "./action-types";

const applicationStateReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ApplicationStateActions.TOGGLE_VIEW_MODE:
        draft.active = !draft.active;
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
