import * as PositivityContentStateActions from "./action-types";

const initialState = {
  selectedId: 1,
};

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case PositivityContentStateActions.NAVIGATE_TO_NEXT_positivity_Content:
      return { ...state, selectedId: state.selectedId + 1 };
    case PositivityContentStateActions.NAVIGATE_TO_PREV_positivity_Content:
      return { ...state, selectedId: Math.max(1, state.selectedId - 1) };
    default:
      return state;
  }
};

export default contentReducer;
