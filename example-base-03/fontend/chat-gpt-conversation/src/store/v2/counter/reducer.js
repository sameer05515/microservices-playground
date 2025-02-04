import { produce } from "immer";
import * as CounterActions from "./action-types";

const initialState = {
  count: 0,
};

const counterReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case CounterActions.INCREMENT:
        draft.count += 1;
        break;
      case CounterActions.DECREMENT:
        draft.count -= 1;
        break;
      case CounterActions.INCREMENT_BY_AMOUNT:
        draft.count += action.payload;
        break;
      default:
        break;
    }
  });
};

export default counterReducer;
