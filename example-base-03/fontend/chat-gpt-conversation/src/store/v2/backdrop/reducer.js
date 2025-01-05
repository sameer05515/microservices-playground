import { produce } from "immer";
import initialState, { v3InitialState } from "./initialState";
import * as BackdropActions from "./action-types";
import { getSanitizedString } from "../../../common/utils/safely-updations";

const backdropReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case BackdropActions.SHOW_BACKDROP_V1:
        draft.active = true;
        break;

      case BackdropActions.HIDE_BACKDROP_V1:
        draft.active = false;
        break;

      case BackdropActions.SHOW_BACKDROP_V3:
        draft.customBackdrop.v3 = {
          ...v3InitialState,
          title: getSanitizedString(action.payload?.title || ""),
          subtitle: getSanitizedString(action.payload?.subtitle),
          description: getSanitizedString(action.payload?.description),
          active: true,
        };
        break;

      case BackdropActions.HIDE_BACKDROP_V3:
        draft.customBackdrop.v3 = { ...v3InitialState, active: false };
        break;

      case BackdropActions.UPDATE_BACKDROP_V3:
        const { v3 } = state.customBackdrop;
        if (!v3.active) return;
        if (v3.active) {
          state.customBackdrop.v3 = {
            ...v3,
            title: getSanitizedString(action.payload?.title || ""),
            subtitle: getSanitizedString(action.payload?.subtitle),
            description: getSanitizedString(action.payload?.description),
            active: true,
          };
        }
        console.log("state.customBackdrop.v3: ", state.customBackdrop.v3);
        break;

      default:
        break;
    }
  });
};

export default backdropReducer;
