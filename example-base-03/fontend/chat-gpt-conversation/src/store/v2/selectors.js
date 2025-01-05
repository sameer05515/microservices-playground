//---------------------------------------------------------------- 'COUNTER' RELATED SELECTORS
const selectCounterState = (state) => state.counter;
export const selectCurrentCount = (state) => selectCounterState(state).count;

//---------------------------------------------------------------- 'BACKDROP' RELATED SELECTORS
const selectBackdropState = (state) => state.backdrop;

export const selectBackdropV1IsActive = (state) => selectBackdropState(state).active;

const selectCustomBackdropV3State = (state) => selectBackdropState(state).customBackdrop.v3;

export const selectIsCustomBackdropV3Active = (state) => selectCustomBackdropV3State(state).active;
export const selectCustomBackdropV3CurrentTitle = (state) => selectCustomBackdropV3State(state).title;
export const selectCustomBackdropV3CurrentSubtitle = (state) => selectCustomBackdropV3State(state).subtitle;
export const selectCustomBackdropV3CurrentDescription = (state) =>
  selectCustomBackdropV3State(state).description;

//---------------------------------------------------------------- 'APPLICATION STATE' RELATED SELECTORS
const selectApplicationState = (state) => state.applicationState;

export const selectApplicationStateIsDarkModeActive = (state) =>
  selectApplicationState(state).isDarkMode === true;
export const selectApplicationStateSelectedModuleName = (state) =>
  selectApplicationState(state).selectedModule;
export const selectApplicationStateIsSidebarExpanded = (state) =>
  selectApplicationState(state).sidebarExpanded;
export const selectApplicationStateIsSidebarCollapsed = (state) =>
  !selectApplicationState(state).sidebarExpanded;

//---------------------------------------------------------------- 'CONSOLIDATED REPORT' RELATED SELECTORS
/**
 *
 * Please see './consolidated-report/selectors.js', as we are now re-organizing selectors in their respective folders.
 *
 * */
