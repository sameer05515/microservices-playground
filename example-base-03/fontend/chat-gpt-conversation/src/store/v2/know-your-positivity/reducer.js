import Navigator from "../../../TestingPage/KnowYourPositivity/Navigator";
import { bootstrap } from "../../../TestingPage/KnowYourPositivity/Registry";
import * as PositivityContentStateActions from "./action-types";

const initialState = {
  selectedId: "",
};

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case PositivityContentStateActions.NAVIGATE_TO_NEXT_positivity_Content:
      return { ...state, selectedId: Navigator.getNextSentenceId(state.selectedId) };
    case PositivityContentStateActions.NAVIGATE_TO_PREV_positivity_Content:
      return { ...state, selectedId: Navigator.getPrevSentenceId(state.selectedId) };
    default:
      return state;
  }
};

bootstrap();

export default contentReducer;
