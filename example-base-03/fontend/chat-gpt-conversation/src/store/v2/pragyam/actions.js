import * as ApplicationStateActions from "./action-types";

export const toggleViewMode = () => ({ type: ApplicationStateActions.TOGGLE_VIEW_MODE });
export const setSelectedModuleName = ({ moduleName } = { moduleName: "" }) => ({
  type: ApplicationStateActions.SET_SELECTED_MODULE_NAME,
  payload: { moduleName },
});
export const setSidebarCollapsed = () => ({
  type: ApplicationStateActions.COLLAPSE_SIDE_BAR,
  payload: { expand: false },
});
export const setSidebarExpanded = () => ({
  type: ApplicationStateActions.EXPAND_SIDE_BAR,
  payload: { expand: true },
});
